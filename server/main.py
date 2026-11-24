"""StudyHub VIP API — deployed on Render, with Firebase Spark as the datastore.

No local execution is required by the project owner. Render builds and runs this
service from the connected Git repository. All persistent records live in Firestore.
"""

from __future__ import annotations

import hashlib
import json
import os
import secrets
from datetime import datetime, timezone
from functools import wraps
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
    methods=["GET", "POST", "OPTIONS"],
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
        max_redemptions = int(payload.get("maxRedemptions", 1))
    except (TypeError, ValueError):
        return api_error("De couponduur of het aantal inwisselingen is ongeldig.", 400)

    if not 1 <= duration_seconds <= 31_536_000:
        return api_error("De couponduur moet tussen 1 seconde en 365 dagen liggen.", 400)
    if not 1 <= max_redemptions <= 500:
        return api_error("Het aantal inwisselingen moet tussen 1 en 500 liggen.", 400)

    # The raw code is returned once. Only the SHA-256 hash is stored in Firestore.
    code = f"SHVIP-{secrets.token_hex(16).upper()}"
    code_hash = hash_code(code)
    code_ref = DB.collection("codes").document(code_hash)
    code_ref.create(
        {
            "type": "VIP-Coupon",
            "active": True,
            "durationSeconds": duration_seconds,
            "maxRedemptions": max_redemptions,
            "redeemedCount": 0,
            "expiresAt": None,
            "createdAt": firestore.SERVER_TIMESTAMP,
            "createdBy": request.studyhub_user["uid"],
        }
    )

    response = jsonify(
        {
            "ok": True,
            "code": code,
            "durationSeconds": duration_seconds,
            "maxRedemptions": max_redemptions,
            "message": "VIP-code is aangemaakt. Bewaar hem; hij wordt maar één keer volledig getoond.",
        }
    )
    response.headers["Cache-Control"] = "no-store, max-age=0"
    return response


@app.post("/api/redeem")
@authenticated
def redeem_vip_code():
    payload = request.get_json(silent=True) or {}
    code = normalize_code(payload.get("code"))
    if len(code) < 12 or len(code) > 80:
        return api_error("Deze code lijkt ongeldig. Controleer de volledige code.", 400)

    uid = request.studyhub_user["uid"]
    code_hash = hash_code(code)
    profile_ref = DB.collection("users").document(uid)
    code_ref = DB.collection("codes").document(code_hash)
    redemption_ref = profile_ref.collection("redemptions").document(code_hash)

    @firestore.transactional
    def redeem_in_transaction(transaction):
        # Read all required documents before any writes in this transaction.
        profile_snap = profile_ref.get(transaction=transaction)
        code_snap = code_ref.get(transaction=transaction)
        redemption_snap = redemption_ref.get(transaction=transaction)

        if not profile_snap.exists:
            raise ValueError("Je StudyHub-profiel is niet gevonden. Log opnieuw in.")
        if profile_snap.to_dict().get("Lifetime-VIP") is True:
            raise ValueError("Lifetime VIP heeft geen coupons nodig en kan geen codes inwisselen.")
        if not code_snap.exists:
            raise ValueError("Deze code bestaat niet of is ongeldig.")
        if redemption_snap.exists:
            raise ValueError("Je hebt deze code al eens gebruikt.")

        code_data = code_snap.to_dict()
        if code_data.get("active") is not True or code_data.get("type") != "VIP-Coupon":
            raise ValueError("Deze code is niet actief of heeft een ongeldig type.")

        duration_seconds = code_data.get("durationSeconds")
        max_redemptions = code_data.get("maxRedemptions")
        redeemed_count = code_data.get("redeemedCount", 0)
        if not isinstance(duration_seconds, int) or not 1 <= duration_seconds <= 31_536_000:
            raise ValueError("Deze coupon heeft een ongeldige tijdsduur.")
        if not isinstance(max_redemptions, int) or not isinstance(redeemed_count, int):
            raise ValueError("Deze code heeft ongeldige instellingen.")
        if redeemed_count >= max_redemptions:
            raise ValueError("Deze code is al maximaal ingewisseld.")

        expires_at = code_data.get("expiresAt")
        if expires_at is not None and expires_at <= utc_now():
            raise ValueError("Deze code is verlopen.")

        item_id = f"vip-coupon-{duration_seconds}"
        inventory_ref = profile_ref.collection("inventory").document(item_id)
        inventory_snap = inventory_ref.get(transaction=transaction)
        now = firestore.SERVER_TIMESTAMP

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
            },
        )

        if inventory_snap.exists:
            current_item = inventory_snap.to_dict()
            if (
                current_item.get("type") != "VIP-Coupon"
                or current_item.get("durationSeconds") != duration_seconds
            ):
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
        transaction = DB.transaction()
        duration_seconds = redeem_in_transaction(transaction)
    except ValueError as exc:
        return api_error(str(exc), 400)
    except Exception:
        app.logger.exception("VIP code redemption failed for uid=%s", uid)
        return api_error("De code kon nu niet worden ingewisseld. Probeer het straks opnieuw.", 500)

    return jsonify(
        {
            "ok": True,
            "durationSeconds": duration_seconds,
            "message": "Gelukt! Je VIP-Coupon is toegevoegd aan je inventory. ✨",
        }
    )


@app.errorhandler(413)
def too_large(_error):
    return api_error("Het verzoek is te groot.", 413)


if __name__ == "__main__":
    # Render runs Gunicorn using the startCommand in render.yaml.
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "10000")))
