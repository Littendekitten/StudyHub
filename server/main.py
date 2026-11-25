"""StudyHub VIP API — deployed on Render, with Firebase Spark as the datastore.

No local execution is required by the project owner. Render builds and runs this
service from the connected Git repository. All persistent records live in Firestore.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import secrets
from datetime import datetime, timezone
from functools import wraps

from google.api_core.exceptions import AlreadyExists
from typing import Any

import firebase_admin
from firebase_admin import auth, credentials, firestore
from flask import Flask, jsonify, request
from flask_cors import CORS


PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "kitacat-studyhub").strip()
SERVICE_ACCOUNT_JSON = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON", "").strip()
ALLOWED_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
]
ADMIN_UIDS = {
    uid.strip()
    for uid in os.getenv("ADMIN_UIDS", "").split(",")
    if uid.strip()
}

if not SERVICE_ACCOUNT_JSON:
    raise RuntimeError(
        "Missing FIREBASE_SERVICE_ACCOUNT_JSON. Add the Firebase service-account "
        "JSON as a secret environment variable in Render. Do not commit it to Git."
    )

try:
    service_account_info = json.loads(SERVICE_ACCOUNT_JSON)
except json.JSONDecodeError as exc:
    raise RuntimeError("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.") from exc

if not firebase_admin._apps:
    firebase_admin.initialize_app(
        credentials.Certificate(service_account_info),
        {"projectId": PROJECT_ID},
    )

DB = firestore.client()
app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024

# Only the exact GitHub Pages origin(s) configured in Render can call this API.
CORS(
    app,
    resources={r"/api/*": {"origins": ALLOWED_ORIGINS}},
    methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=3600,
)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def api_error(message: str, status: int):
    return jsonify({"error": message}), status


def require_firebase_user() -> dict[str, Any] | None:
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    token = header[7:].strip()
    if not token:
        return None
    try:
        # Verify the Firebase client ID token. Never trust a uid sent in JSON.
        return auth.verify_id_token(token, check_revoked=True)
    except Exception:
        return None


def authenticated(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        decoded = require_firebase_user()
        if not decoded:
            return api_error("Je sessie is ongeldig of verlopen. Log opnieuw in.", 401)
        request.studyhub_user = decoded
        return view(*args, **kwargs)

    return wrapped


def is_admin(decoded: dict[str, Any]) -> bool:
    return decoded.get("uid") in ADMIN_UIDS


def normalize_code(raw: Any) -> str:
    if not isinstance(raw, str):
        return ""
    return "".join(raw.strip().upper().split())


def hash_code(code: str) -> str:
    return hashlib.sha256(code.encode("utf-8")).hexdigest()


def mask_code(code: str) -> str:
    """Show admins a recognizable preview without storing the redeemable code."""
    if len(code) <= 8:
        return f"{code[:2]}•••{code[-2:]}"
    return f"{code[:4]}…{code[-4:]}"


def format_duration(seconds: int) -> str:
    if seconds % 86400 == 0:
        days = seconds // 86400
        return f"{days} dag" if days == 1 else f"{days} dagen"
    if seconds % 3600 == 0:
        hours = seconds // 3600
        return f"{hours} uur"
    if seconds % 60 == 0:
        minutes = seconds // 60
        return f"{minutes} min"
    return f"{seconds} sec"


@app.get("/api/health")
def health():
    return jsonify({"ok": True, "service": "studyhub-vip-api", "project": PROJECT_ID})


@app.get("/api/admin/status")
@authenticated
def admin_status():
    return jsonify({"isAdmin": is_admin(request.studyhub_user)})


@app.post("/api/admin/codes")
@authenticated
def create_vip_code():
    if not is_admin(request.studyhub_user):
        return api_error("Je hebt geen toestemming om VIP-codes te maken.", 403)

    payload = request.get_json(silent=True) or {}
    try:
        duration_seconds = int(payload.get("durationSeconds", 0))
    except (TypeError, ValueError):
        return api_error("De couponduur is ongeldig.", 400)

    if not 1 <= duration_seconds <= 31_536_000:
        return api_error("De couponduur moet tussen 1 seconde en 365 dagen liggen.", 400)

    code = normalize_code(payload.get("code"))
    if not re.fullmatch(r"[A-Z0-9][A-Z0-9_-]{5,63}", code):
        return api_error("Kies zelf een code van 6–64 tekens met alleen letters, cijfers, - of _.", 400)

    usage_scope = payload.get("usageScope", "per_user")
    if not isinstance(usage_scope, str) or usage_scope not in {"global", "per_user"}:
        return api_error("Kies globaal één keer of één keer per persoon.", 400)

    # One activation generation defines a fresh redemption round. Re-enabling
    # the code rotates this value, resetting either global or per-user usage.
    code_hash = hash_code(code)
    generation = secrets.token_hex(16)
    code_ref = DB.collection("codes").document(code_hash)
    try:
        code_ref.create(
            {
                "type": "VIP-Coupon",
                # Only a masked preview is stored. The redeemable string itself
                # is used as the SHA-256 document ID and is never persisted.
                "codePreview": mask_code(code),
                "reward": "VIP-Coupon",
                "active": True,
                "durationSeconds": duration_seconds,
                "usageScope": usage_scope,
                "generation": generation,
                "redeemedCount": 0,
                "expiresAt": None,
                "createdAt": firestore.SERVER_TIMESTAMP,
                "createdBy": request.studyhub_user["uid"],
            }
        )
    except AlreadyExists:
        return api_error("Deze code bestaat al. Kies een andere code.", 409)

    response = jsonify(
        {
            "ok": True,
            "code": code,
            "codePreview": mask_code(code),
            "durationSeconds": duration_seconds,
            "usageScope": usage_scope,
            "reward": f"VIP-Coupon · {format_duration(duration_seconds)}",
            "message": (
                "Je eigen VIP-code is aangemaakt. Bewaar de code die je hebt gekozen. "
                + ("Deze code kan globaal één keer worden gebruikt." if usage_scope == "global" else "Iedere gebruiker kan deze code één keer gebruiken.")
            ),
        }
    )
    response.headers["Cache-Control"] = "no-store, max-age=0"
    return response


@app.get("/api/admin/codes")
@authenticated
def list_admin_vip_codes():
    """Return the minimal admin view: status and reward, never the plaintext code."""
    if not is_admin(request.studyhub_user):
        return api_error("Je hebt geen toestemming om VIP-codes te bekijken.", 403)

    try:
        page_size = int(request.args.get("limit", "50"))
    except (TypeError, ValueError):
        return api_error("Ongeldige paginagrootte.", 400)
    page_size = max(1, min(page_size, 100))

    query = DB.collection("codes").order_by(
        "createdAt", direction=firestore.Query.DESCENDING
    )
    cursor_id = request.args.get("cursor", "").strip()
    if cursor_id:
        if not re.fullmatch(r"[a-fA-F0-9]{64}", cursor_id):
            return api_error("Ongeldige cursor.", 400)
        cursor_snapshot = DB.collection("codes").document(cursor_id).get()
        if not cursor_snapshot.exists:
            return api_error("De volgende pagina is niet meer beschikbaar. Vernieuw het overzicht.", 400)
        query = query.start_after(cursor_snapshot)

    snapshots = list(query.limit(page_size + 1).stream())
    has_more = len(snapshots) > page_size
    page_snapshots = snapshots[:page_size]
    now = utc_now()
    codes = []

    for snapshot in page_snapshots:
        data = snapshot.to_dict() or {}
        expires_at = data.get("expiresAt")
        active = data.get("active") is True and (expires_at is None or expires_at > now)
        duration = data.get("durationSeconds", 0)
        duration = duration if isinstance(duration, int) and not isinstance(duration, bool) else 0
        stored_scope = data.get("usageScope", "per_user")
        if not isinstance(stored_scope, str) or stored_scope not in {"global", "per_user"}:
            stored_scope = "per_user"
        codes.append({
            "id": snapshot.id,
            "reference": snapshot.id[-8:].upper(),
            "codePreview": str(data.get("codePreview", ""))[:24] or None,
            "active": active,
            "status": "active" if active else "inactive",
            "reward": f"{data.get('reward', 'VIP-Coupon')} · {format_duration(duration)}",
            "durationSeconds": duration,
            # Old codes predate this selector; retain their previous per-user behavior.
            "usageScope": stored_scope,
        })

    return jsonify({
        "ok": True,
        "codes": codes,
        "hasMore": has_more,
        "nextCursor": page_snapshots[-1].id if has_more and page_snapshots else None,
    })


@app.patch("/api/admin/codes/<code_id>")
@authenticated
def update_admin_vip_code(code_id: str):
    """Toggle a code. Re-enabling starts a new redemption cycle for every user."""
    if not is_admin(request.studyhub_user):
        return api_error("Je hebt geen toestemming om VIP-codes te wijzigen.", 403)
    if not re.fullmatch(r"[a-fA-F0-9]{64}", code_id):
        return api_error("Ongeldige codeverwijzing.", 400)

    payload = request.get_json(silent=True) or {}
    active = payload.get("active")
    if not isinstance(active, bool):
        return api_error("Geef active als true of false op.", 400)

    code_ref = DB.collection("codes").document(code_id)

    @firestore.transactional
    def toggle_in_transaction(transaction):
        snapshot = code_ref.get(transaction=transaction)
        if not snapshot.exists:
            raise ValueError("Deze code bestaat niet meer.")
        data = snapshot.to_dict() or {}
        was_active = data.get("active") is True
        updates = {
            "active": active,
            "updatedAt": firestore.SERVER_TIMESTAMP,
        }
        reset = active and not was_active
        if reset:
            # A new generation means every account may redeem once again.
            updates["generation"] = secrets.token_hex(16)
            updates["redeemedCount"] = 0
        transaction.update(code_ref, updates)
        usage_scope = data.get("usageScope", "per_user")
        if not isinstance(usage_scope, str) or usage_scope not in {"global", "per_user"}:
            usage_scope = "per_user"
        return reset, usage_scope

    try:
        reset, usage_scope = toggle_in_transaction(DB.transaction())
    except ValueError as exc:
        return api_error(str(exc), 404)
    except Exception:
        app.logger.exception("VIP code status update failed")
        return api_error("De code kon niet worden bijgewerkt.", 500)

    if active and reset and usage_scope == "global":
        message = "Code opnieuw geactiveerd. De globale gebruikslimiet is gereset; de code kan opnieuw één keer totaal worden ingewisseld."
    elif active and reset:
        message = "Code opnieuw geactiveerd. Iedere gebruiker kan deze code opnieuw één keer inwisselen."
    elif active:
        message = "Code ingeschakeld."
    else:
        message = "Code uitgeschakeld. Nieuwe inwisselingen zijn geblokkeerd."
    return jsonify({"ok": True, "active": active, "reset": reset, "message": message})


@app.delete("/api/admin/codes/<code_id>")
@authenticated
def delete_admin_vip_code(code_id: str):
    """Permanently remove a code definition. Previously issued inventory remains."""
    if not is_admin(request.studyhub_user):
        return api_error("Je hebt geen toestemming om VIP-codes te verwijderen.", 403)
    if not re.fullmatch(r"[a-fA-F0-9]{64}", code_id):
        return api_error("Ongeldige codeverwijzing.", 400)

    code_ref = DB.collection("codes").document(code_id)
    snapshot = code_ref.get()
    if not snapshot.exists:
        return api_error("Deze code bestaat niet meer.", 404)

    # Firestore does not automatically remove subcollections when a parent
    # document is deleted. Remove global redemption markers in small batches.
    redemption_collection = code_ref.collection("redemptions")
    while True:
        marker_docs = list(redemption_collection.limit(400).stream())
        if not marker_docs:
            break
        batch = DB.batch()
        for marker_doc in marker_docs:
            batch.delete(marker_doc.reference)
        batch.commit()

    code_ref.delete()
    return jsonify({
        "ok": True,
        "message": "Code verwijderd. Eerder ontvangen VIP-Coupons blijven in gebruikersinventories staan."
    })


@app.post("/api/redeem")
@authenticated
def redeem_vip_code():
    payload = request.get_json(silent=True) or {}
    code = normalize_code(payload.get("code"))
    if not re.fullmatch(r"[A-Z0-9][A-Z0-9_-]{5,63}", code):
        return api_error("Deze code lijkt ongeldig. Gebruik de volledige code van 6–64 tekens.", 400)

    uid = request.studyhub_user["uid"]
    code_hash = hash_code(code)
    profile_ref = DB.collection("users").document(uid)
    code_ref = DB.collection("codes").document(code_hash)

    @firestore.transactional
    def redeem_in_transaction(transaction):
        # Read the account and code first. The redemption record includes the
        # current code generation, so reactivation resets every user's use.
        profile_snap = profile_ref.get(transaction=transaction)
        code_snap = code_ref.get(transaction=transaction)

        if not profile_snap.exists:
            raise ValueError("Je StudyHub-profiel is niet gevonden. Log opnieuw in.")
        # Lifetime-VIP owners may also collect and redeem regular VIP-Coupons.
        # Their permanent entitlement is independent from coupon inventory.
        if not code_snap.exists:
            raise ValueError("Deze code bestaat niet of is ongeldig.")

        code_data = code_snap.to_dict() or {}
        if code_data.get("active") is not True or code_data.get("type") != "VIP-Coupon":
            raise ValueError("Deze code is niet actief of heeft een ongeldig type.")

        duration_seconds = code_data.get("durationSeconds")
        if not isinstance(duration_seconds, int) or isinstance(duration_seconds, bool) or not 1 <= duration_seconds <= 31_536_000:
            raise ValueError("Deze coupon heeft een ongeldige tijdsduur.")

        expires_at = code_data.get("expiresAt")
        if expires_at is not None and expires_at <= utc_now():
            raise ValueError("Deze code is verlopen.")

        generation = code_data.get("generation") or "legacy"
        if not isinstance(generation, str) or not re.fullmatch(r"[a-fA-F0-9]{1,64}|legacy", generation):
            raise ValueError("Deze code heeft een ongeldige activatie-status.")

        usage_scope = code_data.get("usageScope", "per_user")
        if not isinstance(usage_scope, str) or usage_scope not in {"global", "per_user"}:
            # Fail closed if a code contains an unexpected policy value.
            raise ValueError("Deze code heeft een ongeldige gebruiksinstelling.")

        if usage_scope == "global":
            # One marker shared by every user: the entire code can be redeemed once.
            redemption_ref = code_ref.collection("redemptions").document(generation)
            redemption_snap = redemption_ref.get(transaction=transaction)
            if redemption_snap.exists:
                raise ValueError("Deze code is globaal al één keer ingewisseld.")
        else:
            # Each user gets one redemption marker for this activation generation.
            redemption_id = f"{code_hash}_{generation}"
            redemption_ref = profile_ref.collection("redemptions").document(redemption_id)
            redemption_snap = redemption_ref.get(transaction=transaction)
            if redemption_snap.exists:
                raise ValueError("Je hebt deze code al gebruikt. Deze code is één keer per persoon geldig.")

        item_id = f"vip-coupon-{duration_seconds}"
        inventory_ref = profile_ref.collection("inventory").document(item_id)
        inventory_snap = inventory_ref.get(transaction=transaction)
        now = firestore.SERVER_TIMESTAMP
        redeemed_count = code_data.get("redeemedCount", 0)
        if not isinstance(redeemed_count, int) or isinstance(redeemed_count, bool):
            redeemed_count = 0

        transaction.update(
            code_ref,
            {"redeemedCount": redeemed_count + 1, "updatedAt": now},
        )
        transaction.create(
            redemption_ref,
            {
                "type": "VIP-Coupon",
                "durationSeconds": duration_seconds,
                "inventoryItemId": item_id,
                "redeemedAt": now,
                "codeGeneration": generation,
                "usageScope": usage_scope,
                "uid": uid,
            },
        )

        if inventory_snap.exists:
            current_item = inventory_snap.to_dict() or {}
            if current_item.get("type") != "VIP-Coupon" or current_item.get("durationSeconds") != duration_seconds:
                raise ValueError("Je inventory bevat een ongeldig coupon-item. Neem contact op met StudyHub-beheer.")
            transaction.update(
                inventory_ref,
                {
                    "quantity": int(current_item.get("quantity", 0)) + 1,
                    "lastRedemptionHash": code_hash,
                    "lastRedemptionAt": now,
                },
            )
        else:
            transaction.set(
                inventory_ref,
                {
                    "type": "VIP-Coupon",
                    "durationSeconds": duration_seconds,
                    "quantity": 1,
                    "createdAt": now,
                    "lastRedemptionHash": code_hash,
                    "lastRedemptionAt": now,
                    "lastUseId": "",
                },
            )
        return duration_seconds

    try:
        duration_seconds = redeem_in_transaction(DB.transaction())
    except ValueError as exc:
        return api_error(str(exc), 400)
    except Exception:
        app.logger.exception("VIP code redemption failed for uid=%s", uid)
        return api_error("De code kon nu niet worden ingewisseld. Probeer het straks opnieuw.", 500)

    return jsonify({
        "ok": True,
        "durationSeconds": duration_seconds,
        "message": "Gelukt! Je VIP-Coupon is toegevoegd aan je inventory. ✨",
    })


@app.errorhandler(413)
def too_large(_error):
    return api_error("Het verzoek is te groot.", 413)


if __name__ == "__main__":
    # Render runs Gunicorn using the startCommand in render.yaml.
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "10000")))
