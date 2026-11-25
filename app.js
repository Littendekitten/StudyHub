import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider,
  signInWithPopup, signInWithRedirect, getRedirectResult,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, collection, onSnapshot,
  runTransaction, serverTimestamp, Timestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

/* ==========================================================================
           1. DATA: BEGRIPPEN & 4 VOLLEDIGE OEFENTOETSEN
           ========================================================================== */
        const flashcardsData = [
            { id: 1, para: '1.1', term: 'Platentektoniek', def: 'Het bewegen van aardkorstplaten. Verantwoordelijk voor het ontstaan van gebergten en vulkanisme.' },
            { id: 2, para: '1.1', term: 'Pangea', def: 'Het supercontinent dat miljoenen jaren geleden opbrak in losse aardkorstplaten.' },
            { id: 3, para: '1.1', term: 'Himalaya ontstaan', def: 'Ontstaan door de botsing tussen de Indische plaat en de Euraziatische plaat (eerst vulkanisme, daarna gebergtevorming).' },
            { id: 4, para: '1.1', term: 'Jong gebergte', def: 'Hoge, scherpe/spitse bergtoppen en diepe, steile dalen (bijv. Alpen, Himalaya, Pyreneeën, Apennijnen).' },
            { id: 5, para: '1.1', term: 'Oud gebergte', def: 'Lage, afgeronde bergtoppen en ondiepe dalen door lange verwering/erosie (bijv. Ardennen, Oeral, Schotse Hooglanden).' },
            { id: 6, para: '1.1', term: 'Stollingsgesteente', def: 'Ontstaat door het stollen van vloeibaar magma (bijv. Graniet). Gevlekt uiterlijk, keihard en bevat NOOIT fossielen.' },
            { id: 7, para: '1.2', term: 'Verwering', def: 'Het afbreken/verbrokkelen van gesteente op één plek, zonder dat het materiaal meteen wordt vervoerd.' },
            { id: 8, para: '1.2', term: 'Mechanische verwering', def: 'Gesteente brokkelt af zonder dat de samenstelling verandert (vorstverwering, opwarmen/afkoelen, plantenwortels).' },
            { id: 9, para: '1.2', term: 'Chemische verwering', def: 'Gesteente verandert van samenstelling of lost op door reactie met water, zuurstof en zuren (karstgrotten in kalksteen).' },
            { id: 10, para: '1.3', term: 'Erosie', def: 'De uitschurende werking van bewegend ijs, water of wind mét meegenomen verweringsmateriaal.' },
            { id: 11, para: '1.3', term: 'Massabewegingen', def: 'Het langs een helling naar beneden bewegen (vallen, rollen, schuiven) van gesteente onder invloed van de zwaartekracht.' },
            { id: 12, para: '1.3', term: 'V-dal vs. U-dal', def: 'Een V-dal is uitgesleten door een rivier. Een U-dal heeft een vlakke bodem en steile wanden en is uitgesleten door een gletsjer.' },
            { id: 13, para: '1.4', term: 'Sedimentatie', def: 'Het neerleggen/afzetten van verweerd materiaal (grind, zand, klei) zodra de stroomsnelheid van water of wind afneemt.' },
            { id: 14, para: '1.4', term: 'Boven- / Midden- / Benedenloop', def: 'Bovenloop = steil/veel erosie (stenen). Middenloop = minder steil (grind/zand). Benedenloop = vlak/sedimentatie (klei).' },
            { id: 15, para: '1.4', term: 'Delta vs. Estuarium', def: 'Delta = vertakte riviermonding vol sediment. Estuarium = trechtervormige monding door groot verschil tussen eb en vloed (> 3 m).' },
            { id: 16, para: '1.4', term: 'Sedimentgesteente', def: 'Samengeperste lagen sediment: zandsteen (uit zand), schalie (uit klei), kalksteen (uit schelpen). Gelaagd en bevat vaak fossielen.' },
            { id: 17, para: 'Kaart', term: 'Reliëf', def: 'Hoogteverschillen in een landschap. Wordt op kaarten weergegeven met kleuren, hoogtelijnen, cijfers en schaduw.' },
            { id: 18, para: 'Kaart', term: 'Hoogtelijnen', def: 'Lijnen op een topografische kaart die punten van gelijke hoogte verbinden. Hoe dichter bij elkaar, hoe steiler de helling.' },
            { id: 19, para: 'Kaart', term: 'Hoogtezones', def: 'Laagland (0-200m), Heuvelland (200-500m), Middelgebergte (500-1500m), Hooggebergte (>1500m).' }
        ];

        const prebuiltTests = [
            // Test 1: § 1.1 & 1.2
            {
                title: "Toets 1: Gebergtevorming & Verwering (§ 1.1 & 1.2)",
                questions: [
                    { id: 101, para: '1.1', points: 1, type: 'mc', question: 'Welk proces is verantwoordelijk voor het ontstaan van gebergten en het verschuiven van continenten?', options: ['Erosie', 'Platentektoniek', 'Sedimentatie', 'Massabeweging'], correct: 1, explanation: 'Platentektoniek is het bewegen en botsen van aardkorstplaten.' },
                    { id: 102, para: '1.1', points: 2, type: 'open', question: 'Leg uit waarom je in het stollingsgesteente graniet NOOIT fossielen aantreft, maar in zandsteen wel.', modelAnswer: 'Graniet ontstaat uit gloeiend heet magma diep in de aarde waarin schelpen of organismen verbranden. Zandsteen is sedimentgesteente dat op de zeebodem ontstaat waar schelpen wel worden begraven.', keywords: ['magma', 'heet', 'zeebodem', 'sedimentgesteente', 'schelpen'] },
                    { id: 103, para: '1.1', points: 1, type: 'mc', question: 'Welk gebergte is ontstaan door de botsing tussen de Indische plaat en de Euraziatische plaat?', options: ['De Alpen', 'De Pyreneeën', 'De Himalaya', 'De Oeral'], correct: 2, explanation: 'De Himalaya ontstond toen de Indische plaat tegen de Euraziatische plaat botste.' },
                    { id: 104, para: '1.1', points: 2, type: 'open', question: 'Noem twee duidelijke uiterlijke kenmerken waaraan je een jong gebergte kunt onderscheiden van een oud gebergte.', modelAnswer: 'Een jong gebergte heeft hoge, spitse bergtoppen en diepe, steile dalen. Een oud gebergte heeft lage, afgeronde toppen en ondiepe dalen.', keywords: ['spitse', 'hoge', 'afgeronde', 'steile', 'diepe'] },
                    { id: 105, para: '1.2', points: 1, type: 'mc', question: 'Wat zorgt bij vorstverwering ervoor dat een rots met scheuren uiteindelijk breekt?', options: ['Water dat in de scheur bevriest en uitzet', 'Zuur regenwater dat het gesteente oplost', 'Felle zonneschijn overdag', 'Zand dat door de wind tegen de rots waait'], correct: 0, explanation: 'Bevroren water zet uit en drukt de scheur steeds verder open.' },
                    { id: 106, para: '1.2', points: 2, type: 'open', question: 'Leg het verschil uit tussen mechanische verwering en chemische verwering.', modelAnswer: 'Bij mechanische verwering verbrokkelt het gesteente zonder dat de samenstelling verandert. Bij chemische verwering verandert de samenstelling wel of lost het gesteente op.', keywords: ['samenstelling', 'verandert', 'oplossen', 'verbrokkelt'] },
                    { id: 107, para: '1.2', points: 1, type: 'mc', question: 'In welk klimaat verloopt chemische verwering het snelst?', options: ['Koud en droog polair klimaat', 'Warm en vochtig tropisch klimaat', 'Droog woestijnklimaat', 'Hooggebergteklimaat'], correct: 1, explanation: 'Hoge temperaturen en veel vocht versnellen chemische verwering.' },
                    { id: 108, para: '1.2', points: 2, type: 'open', question: 'Leg uit hoe ondergrondse grotten in kalksteengebieden (zoals de Belgische Ardennen) ontstaan.', modelAnswer: 'Regenwater wordt licht zuur door contact met plantenwortels en lucht. Dit zure water sijpelt door spleten naar beneden en lost het kalksteen langzaam op.', keywords: ['zuur', 'oplossen', 'sijpelt', 'kalksteen', 'plantenwortels'] },
                    { id: 109, para: '1.1', points: 1, type: 'mc', question: 'Hoe noemen we het vloeibare gesteente dat vanuit de aardmantel omhoog komt?', options: ['Lava', 'Basalt', 'Magma', 'Schalie'], correct: 2, explanation: 'Onder de grond heet vloeibaar gesteente magma (waaruit graniet kan stollen).' },
                    { id: 110, para: '1.2', points: 2, type: 'open', question: 'Leg uit waarom bij de eerste botsing tussen India en Azië vulkanisme ontstond en bij de tweede botsing gebergtevorming.', modelAnswer: 'Bij de eerste botsing dook de Indische plaat onder de Euraziatische plaat en smolt onder druk tot magma (vulkanisme). Bij de tweede botsing duwden beide platen elkaar omhoog (gebergtevorming).', keywords: ['onder', 'smolt', 'omhoog', 'duwden'] }
                ]
            },
            // Test 2: § 1.3 & 1.4
            {
                title: "Toets 2: Erosie, Rivieren & Sedimentatie (§ 1.3 & 1.4)",
                questions: [
                    { id: 201, para: '1.3', points: 1, type: 'mc', question: 'Welke natuurkracht is de motor achter massabewegingen langs een berghelling?', options: ['Windkracht', 'Zwaartekracht', 'Zonnekracht', 'Magnetisme'], correct: 1, explanation: 'Door de zwaartekracht valt, rolt of glijdt los materiaal naar beneden.' },
                    { id: 202, para: '1.3', points: 2, type: 'open', question: 'Beschrijf hoe een gletsjer een U-dal maakt.', modelAnswer: 'Een gletsjer beweegt langzaam door een dal naar beneden. Het gewicht van het ijs en het meegevoerde gesteente schuren zowel de bodem als de wanden breed en diep uit.', keywords: ['ijs', 'schuren', 'wanden', 'bodem', 'gewicht'] },
                    { id: 203, para: '1.4', points: 1, type: 'mc', question: 'Waar in de rivierloop vind je voornamelijk grote stenen en grof grind?', options: ['Benedenloop', 'Middenloop', 'Bovenloop', 'Lagune'], correct: 2, explanation: 'In de steile bovenloop is de stroomsnelheid het hoogst.' },
                    { id: 204, para: '1.4', points: 2, type: 'open', question: 'Waarom sedimenteert klei pas in het allerlaatste gedeelte van een rivier of in een lagune?', modelAnswer: 'Kleideeltjes zijn heel klein en licht. Ze zakken pas naar de bodem als het water bijna stilstaat (lage stroomsnelheid).', keywords: ['licht', 'klein', 'stroomsnelheid', 'stilstaat', 'lage'] },
                    { id: 205, para: '1.4', points: 1, type: 'mc', question: 'Hoe noem je een trechtervormige riviermonding die ontstaat als het verschil tussen eb en vloed groter is dan 3 meter?', options: ['Delta', 'Estuarium', 'Lagune', 'Puinwaaier'], correct: 1, explanation: 'Bij een groot getijdenverschil schuurt de monding uit tot een estuarium.' },
                    { id: 206, para: '1.4', points: 2, type: 'open', question: 'Noem de twee dingen die noodzakelijk zijn voor het ontstaan van duinen op het strand.', modelAnswer: '1) Wind die droog zand van het strand vervoert. 2) Obstakels op het strand (zoals hout of planten/helmgras) die de kracht van de wind breken zodat het zand blijft liggen.', keywords: ['wind', 'zand', 'obstakels', 'planten', 'breken'] },
                    { id: 207, para: '1.3', points: 1, type: 'mc', question: 'Wat is het verschil tussen verwering en erosie?', options: ['Bij verwering wordt materiaal vervoerd, bij erosie niet', 'Bij verwering breekt gesteente op één plek af; bij erosie wordt het afgesleten en vervoerd', 'Verwering gebeurt door rivieren en erosie door de zon', 'Er is geen verschil'], correct: 1, explanation: 'Erosie omvat altijd transport door water, ijs of wind.' },
                    { id: 208, para: '1.4', points: 2, type: 'open', question: 'Een rivier maakt een bocht. Aan de binnenbocht stroomt het water langzamer. Leg uit wat er met het zand gebeurt en hoe dat komt.', modelAnswer: 'Het zand wordt aan de binnenkant van de bocht afgezet (sedimentatie), omdat het water daar langzamer stroomt en dus minder zand kan vervoeren.', keywords: ['sedimentatie', 'afgezet', 'langzamer', 'vervoeren'] },
                    { id: 209, para: '1.4', points: 1, type: 'mc', question: 'Welk sedimentgesteente ontstaat door het langdurig samenpersen van kleilagen?', options: ['Zandsteen', 'Schalie', 'Kalksteen', 'Graniet'], correct: 1, explanation: 'Samenpersing van klei vormt schalie.' },
                    { id: 210, para: '1.3', points: 2, type: 'open', question: 'Heeft verwering invloed op erosie, of erosie op verwering? Leg je antwoord uit.', modelAnswer: 'Verwering heeft invloed op erosie: het gesteente dat door verwering loskomt, vormt het schuurmiddel waarmee rivieren en gletsjers het dal uitschuren (erosie).', keywords: ['verwering', 'schurende', 'loskomt', 'erosie'] }
                ]
            },
            // Test 3: Kaartvaardigheden & Reliëf
            {
                title: "Toets 3: Kaartvaardigheden & Reliëf (Atlas & Hoogtelijnen)",
                questions: [
                    { id: 401, para: 'Kaart', points: 1, type: 'mc', question: 'Wat wordt bedoeld met het begrip "reliëf"?', options: ['De grondsoort aan het aardoppervlak', 'Hoogteverschillen in een landschap', 'De stroomsnelheid van een rivier', 'De hoeveelheid neerslag in de bergen'], correct: 1, explanation: 'Reliëf is een ander woord voor hoogteverschillen in een landschap.' },
                    { id: 402, para: 'Kaart', points: 2, type: 'open', question: 'Op welke vier manieren kan het reliëf op een kaart worden weergegeven?', modelAnswer: 'Met hoogtekleuren, hoogtelijnen, hoogtecijfers en schaduw (reliëfschaduw).', keywords: ['kleuren', 'hoogtelijnen', 'cijfers', 'schaduw'] },
                    { id: 403, para: 'Kaart', points: 1, type: 'mc', question: 'Hoe zie je op een topografische kaart met hoogtelijnen waar een berghelling het steilst is?', options: ['Waar de hoogtelijnen ver uit elkaar liggen', 'Waar de hoogtelijnen heel dicht op elkaar liggen', 'Waar de kleur blauwgroen is', 'Waar de lijnen stoppen'], correct: 1, explanation: 'Hoe dichter hoogtelijnen bij elkaar liggen, hoe sneller de hoogte verandert (steile helling).' },
                    { id: 404, para: 'Kaart', points: 2, type: 'open', question: 'Zet Nederland, België en Zwitserland in de juiste volgorde van reliëf, beginnend bij het land met het MINSTE reliëf. Geef een korte toelichting.', modelAnswer: '1. Nederland (hoogste punt Vaalserberg 322 m), 2. België (Signal de Botrange 694 m), 3. Zwitserland (Dufourspitze 4634 m).', keywords: ['Nederland', 'België', 'Zwitserland'] },
                    { id: 405, para: 'Kaart', points: 1, type: 'mc', question: 'Tussen welke hoogtes ligt een "middelgebergte"?', options: ['0 tot 200 meter', '200 tot 500 meter', '500 tot 1500 meter', 'Hoger dan 1500 meter'], correct: 2, explanation: 'Laagland (0-200m), Heuvelland (200-500m), Middelgebergte (500-1500m), Hooggebergte (>1500m).' },
                    { id: 406, para: 'Kaart', points: 2, type: 'open', question: 'Wat is het verschil tussen een hooggebergte en een hoogvlakte?', modelAnswer: 'Beide liggen op grote hoogte, maar een hooggebergte heeft veel reliëf (hoge pieken en diepe dalen) terwijl een hoogvlakte juist weinig reliëf heeft (hooggelegen vlak gebied).', keywords: ['weinig reliëf', 'vlak', 'pieken', 'hooggelegen'] },
                    { id: 407, para: 'Kaart', points: 1, type: 'mc', question: 'Tot welk landschapstype behoort Vlaanderen (het noorden van België)?', options: ['Laagland', 'Heuvelland', 'Middelgebergte', 'Hooggebergte'], correct: 0, explanation: 'Vlaanderen ligt onder de 200 meter en is dus laagland.' },
                    { id: 408, para: 'Kaart', points: 2, type: 'open', question: 'Hoe bereken je de diepte van een dal op een overzichtskaart in de atlas?', modelAnswer: 'Je berekent het hoogteverschil tussen de ernaast gelegen bergtop en de bodem van het dal (bergtop min dalbodem).', keywords: ['verschil', 'bergtop', 'bodem', 'dal'] }
                ]
            },
            // Test 4: Grote Hoofdstuktoets (20 vragen)
            {
                title: "Grote Hoofdstuktoets: H1 Landschappen (20 Vragen)",
                questions: [
                    { id: 301, para: '1.1', points: 1, type: 'mc', question: 'Op welke manier zijn volgens geologen de kleine aardkorstplaten ontstaan?', options: ['Door erosie van rivieren', 'Bij het opbreken van het supercontinent Pangea', 'Door het smelten van gletsjers', 'Door chemische verwering'], correct: 1, explanation: 'Het supercontinent Pangea brak op in kleinere aardkorstplaten.' },
                    { id: 302, para: '1.1', points: 2, type: 'open', question: 'Leg uit hoe fossielen van zeedieren hoog in het Himalaya-gebergte terecht zijn gekomen.', modelAnswer: 'Tussen India en Azië lag vroeger een zee waarin sedimentlagen met schelpen werden afgezet. Door de botsing van de platen is de zeebodem geplooid en omhooggedrukt.', keywords: ['zeebodem', 'geplooid', 'omhooggedrukt', 'botsing'] },
                    { id: 303, para: '1.1', points: 1, type: 'mc', question: 'Welk van de volgende Europese gebergten is een OUD gebergte?', options: ['Alpen', 'Pyreneeën', 'Ardennen', 'Kaukasus'], correct: 2, explanation: 'De Ardennen zijn een oud, afgesleten middelgebergte/heuvelland.' },
                    { id: 304, para: '1.2', points: 2, type: 'open', question: 'Waarom komt mechanische verwering door opwarmen en afkoelen veel voor in woestijnen?', modelAnswer: 'In woestijnen zijn er grote temperatuurverschillen tussen de hete dag en koude nacht. Het gesteente zet overdag uit en krimpt s nachts, waardoor het barst.', keywords: ['temperatuurverschil', 'dag', 'nacht', 'uitzetten', 'krimpen'] },
                    { id: 305, para: '1.2', points: 1, type: 'mc', question: 'Wat gebeurt er met water als het bevriest?', options: ['Het krimpt', 'Het zet uit', 'Het wordt zuur', 'Het verdampt'], correct: 1, explanation: 'Water zet uit wanneer het bevriest.' },
                    { id: 306, para: '1.3', points: 2, type: 'open', question: 'Wat zijn massabewegingen en welke kracht is de motor hiervan?', modelAnswer: 'Massabewegingen zijn het langs een helling naar beneden vallen, rollen of schuiven van gesteente onder invloed van de zwaartekracht.', keywords: ['vallen', 'rollen', 'glijden', 'schuiven', 'zwaartekracht'] },
                    { id: 307, para: '1.3', points: 1, type: 'mc', question: 'Onder welke klimaatomstandigheden breidt een gletsjer zich uit?', options: ['Koude winters en hete zomers', 'Milde winters (veel sneeuw) en koele zomers', 'Droge winters en warme zomers', 'Alleen in een woestijnklimaat'], correct: 1, explanation: 'In milde winters valt veel sneeuw en in koele zomers smelt het niet weg.' },
                    { id: 308, para: '1.4', points: 2, type: 'open', question: 'Zet de vier sedimentsoorten in de juiste volgorde van bovenloop naar benedenloop: klei, stenen, zand, grind.', modelAnswer: '1. Stenen (bovenloop), 2. Grind, 3. Zand, 4. Klei (benedenloop).', keywords: ['stenen', 'grind', 'zand', 'klei'] },
                    { id: 309, para: '1.4', points: 1, type: 'mc', question: 'Wat is de overeenkomst tussen duinen en zandbanken?', options: ['Ze liggen allebei midden in zee', 'Ze bestaan allebei uit gesedimenteerd zand', 'Ze ontstaan allebei door gletsjers', 'Ze bestaan allebei uit graniet'], correct: 1, explanation: 'Beide bestaan uit gesedimenteerd zand (duinen op het land, zandbanken voor de kust).' },
                    { id: 310, para: '1.4', points: 2, type: 'open', question: 'Leg uit hoe een rivierdelta ontstaat bij de monding in zee.', modelAnswer: 'Zodra de rivier de zee instroomt, valt de stroomsnelheid weg. Het sediment zinkt naar de bodem, hoopt zich op en de rivier vertakt zich rondom het nieuwe land.', keywords: ['stroomsnelheid', 'sediment', 'vertakt', 'bodem'] },
                    { id: 311, para: '1.1', points: 1, type: 'mc', question: 'Welk gesteente ontstaat uit het samenpersen van schelpen op de zeebodem?', options: ['Graniet', 'Kalksteen', 'Schalie', 'Zandsteen'], correct: 1, explanation: 'Samengeperste schelpenresten vormen kalksteen.' },
                    { id: 312, para: '1.2', points: 2, type: 'open', question: 'Waarom ontstaan grotten wel in kalksteen en niet in graniet?', modelAnswer: 'Kalksteen kan oplossen in water en zuren (chemische verwering), terwijl keihard graniet niet oplost.', keywords: ['oplossen', 'zuur', 'water', 'graniet'] },
                    { id: 313, para: '1.3', points: 1, type: 'mc', question: 'Welke van de drie natuurkrachten (water, ijs, wind) is NIET betrokken bij het uitslijten van een bergdal?', options: ['Water', 'IJs', 'Wind', 'Alle drie zijn betrokken'], correct: 2, explanation: 'Bergdalen worden uitgesleten door rivieren (water) en gletsjers (ijs).' },
                    { id: 314, para: '1.4', points: 2, type: 'open', question: 'Wat is het verschil tussen een delta en een estuarium?', modelAnswer: 'Bij een delta sedimenteert het riviersediment voor de monding. Bij een estuarium is het verschil tussen eb en vloed groter dan 3 meter waardoor de monding uitschuurt tot een trechter.', keywords: ['sedimenteert', 'eb en vloed', '3 meter', 'trechter'] },
                    { id: 315, para: 'Kaart', points: 1, type: 'mc', question: 'Op welke hoogte ligt het grootste deel van Nederland?', options: ['Lager dan 200 meter', 'Tussen 200 en 500 meter', 'Tussen 500 en 1500 meter', 'Hoger dan 1500 meter'], correct: 0, explanation: 'Nederland bestaat grotendeels uit laagland (lager dan 200 meter).' },
                    { id: 316, para: '1.2', points: 2, type: 'open', question: 'Welke twee stoffen zorgen samen voor chemische verwering?', modelAnswer: 'Water (vocht) en zuurstof (samen met zuren).', keywords: ['water', 'zuurstof', 'vocht'] },
                    { id: 317, para: '1.1', points: 1, type: 'mc', question: 'Waaruit blijkt dat graniet een keihard gesteente is?', options: ['Het lost snel op in regenwater', 'Het andere gesteente dat erboven ligt slijt wel weg, waardoor graniet blijft staan', 'Je kunt het met je nagel bekrassen', 'Het bestaat uit losse kleikorrels'], correct: 1, explanation: 'Zachtere bovenlagen slijten door erosie weg, terwijl het harde graniet overblijft.' },
                    { id: 318, para: '1.4', points: 2, type: 'open', question: 'Waarom erodeert een rivier in een hooggebergte veel sterker dan in een heuvelland?', modelAnswer: 'In een hooggebergte zijn grotere hoogteverschillen. Daardoor stroomt de rivier sneller en is de schurende werking van stenen en zand veel groter.', keywords: ['hoogteverschillen', 'sneller', 'schurende'] },
                    { id: 319, para: '1.3', points: 1, type: 'mc', question: 'Hoelang doet een rivier erover om een diep V-dal uit te schuren?', options: ['Tientallen jaren', 'Honderden jaren', 'Miljoenen jaren', 'Enkele maanden'], correct: 2, explanation: 'Erosie is een heel traag proces dat miljoenen jaren duurt.' },
                    { id: 320, para: '1.4', points: 2, type: 'open', question: 'Wat wordt bedoeld met het begrip "sedimentatie"?', modelAnswer: 'Het neerleggen/afzetten van verweerd materiaal (zoals grind, zand of klei) door water, wind of ijs.', keywords: ['neerleggen', 'afzetten', 'materiaal'] }
                ]
            }
        ];

        /* ==========================================================================
           2. APPLICATION STATE — VOLLEDIG LOKAAL, GEEN API NODIG
           ========================================================================== */
        let activeQuizQuestions = [];
        let activeQuizTitle = "";
        let lastBuiltInIndex = 0;
        let currentQuizIndex = 0;
        let userAnswers = {};
        let timerInterval = null;
        let timerSecondsLeft = 0;

        function showToast(msg) {
            const toast = document.getElementById('toast-message');
            const textEl = document.getElementById('toast-text');
            if (toast && textEl) {
                textEl.innerText = msg;
                toast.classList.remove('hidden');
                setTimeout(() => toast.classList.add('hidden'), 6000);
            }
        }

        /* ==========================================================================
           STUDYHUB INSTALLEREN — PWA / TOEVOEGEN AAN STARTSCHERM
           ========================================================================== */
        let studyHubDeferredInstallPrompt = null;

        function isStudyHubInstalled() {
            return Boolean(
                window.matchMedia?.('(display-mode: standalone)').matches ||
                window.matchMedia?.('(display-mode: minimal-ui)').matches ||
                navigator.standalone === true
            );
        }

        // Toon de installatieknop uitsluitend op de Hub-homepagina en alleen
        // zolang StudyHub niet al als PWA is geïnstalleerd.
        function updateInstallButtonVisibility(tabName = window.studyHubCurrentTab || 'home') {
            const button = document.getElementById('install-app-btn');
            if (!button) return;
            const isHubHome = tabName === 'home' &&
                !document.body.classList.contains('subject-open') &&
                !document.body.classList.contains('math-open');
            button.hidden = !isHubHome || isStudyHubInstalled();
            button.setAttribute('aria-hidden', String(button.hidden));
        }

        // Chrome en Edge op Android/desktop geven dit event als StudyHub installeerbaar is.
        window.addEventListener('beforeinstallprompt', event => {
            event.preventDefault();
            studyHubDeferredInstallPrompt = event;
            updateInstallButtonVisibility();
        });

        window.addEventListener('appinstalled', () => {
            studyHubDeferredInstallPrompt = null;
            updateInstallButtonVisibility();
            showToast('StudyHub is geïnstalleerd! Je vindt de app nu op je startscherm.');
        });

        async function installStudyHub() {
            const button = document.getElementById('install-app-btn');
            if (isStudyHubInstalled()) {
                if (button) button.hidden = true;
                showToast('StudyHub is al geïnstalleerd op dit apparaat.');
                return;
            }

            if (studyHubDeferredInstallPrompt) {
                const installEvent = studyHubDeferredInstallPrompt;
                studyHubDeferredInstallPrompt = null;
                await installEvent.prompt();
                const choice = await installEvent.userChoice;
                if (choice?.outcome === 'accepted') {
                    if (button) button.hidden = true;
                    showToast('Top! StudyHub wordt aan je apparaat toegevoegd.');
                }
                return;
            }

            const userAgent = navigator.userAgent || '';
            const isIOS = /iphone|ipad|ipod/i.test(userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

            if (isIOS) {
                showToast(`StudyHub toevoegen op iPhone/iPad: open deze site in Safari, tik op Deel en kies ‘Zet op beginscherm’.`);
            } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
                showToast('Om StudyHub te installeren moet de website via een beveiligde HTTPS-link geopend zijn, bijvoorbeeld via GitHub Pages.');
            } else {
                showToast('Installeren nog niet beschikbaar? Open het browsermenu (⋮) en kies ‘App installeren’ of ‘Toevoegen aan startscherm’.');
            }
        }

        /* ==========================================================================
           3. TAB NAVIGATION
           ========================================================================== */
        function switchTab(tabName) {
            const isMathTab = tabName.startsWith('math-');
            const isAccountTab = tabName === 'account';
            const isPremiumTab = tabName === 'premium';

            if (isAccountTab) {
                if (window.studyHubCurrentTab !== 'account') window.studyHubReturnTab = window.studyHubCurrentTab || 'home';
            } else {
                window.studyHubCurrentTab = tabName;
                if (tabName === 'home' || isPremiumTab) {
                    document.body.classList.remove('subject-open', 'math-open');
                } else if (isMathTab) {
                    document.body.classList.add('subject-open', 'math-open');
                } else {
                    if (!document.body.classList.contains('subject-open') || document.body.classList.contains('math-open')) {
                        showToast('Open eerst een vak via de startpagina.');
                        return;
                    }
                    document.body.classList.remove('math-open');
                }
            }

            const sections = ['home', 'premium', 'tests', 'generator', 'quiz', 'grading', 'results', 'learn', 'summary', 'math', 'account'];
            sections.forEach(id => {
                const el = document.getElementById(`section-${id}`);
                if (el) el.classList.add('hidden');
            });

            if (isMathTab) {
                const mathSection = document.getElementById('section-math');
                if (mathSection) mathSection.classList.remove('hidden');
                const mathViews = {
                    'math-overview': 'overviewView',
                    'math-practice': 'practiceView',
                    'math-mix': 'mathMixView',
                    'math-formulas': 'formulaView',
                    'math-videos': 'videosView'
                };
                if (typeof window.showMathView === 'function') {
                    window.showMathView(mathViews[tabName] || 'overviewView');
                }
            } else {
                const target = document.getElementById(`section-${tabName}`);
                if (target) target.classList.remove('hidden');
            }

            document.querySelectorAll('.nav-tab-btn').forEach(btn => {
                const candidate = btn.getAttribute('data-tab');
                const activeMathTab = tabName === 'math-formulas' || tabName === 'math-videos' || tabName === 'math-mix'
                    ? tabName
                    : 'math-overview';
                const active = isMathTab ? candidate === activeMathTab : candidate === tabName;
                btn.classList.toggle('active', active);
            });

            if (tabName === 'learn') renderFlashcards();
            updateInstallButtonVisibility(tabName);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function openSubjectCard(subject) {
            if (subject === 'aardrijkskunde') {
                document.body.classList.add('subject-open');
                document.body.classList.remove('math-open');
                switchTab('tests');
            } else if (subject === 'wiskunde') {
                switchTab('math-overview');
            }
        }

        /* ==========================================================================
           4. QUIZ ENGINE (START, RENDER, NAVIGATE)
           ========================================================================== */
        function startBuiltInQuiz(index) {
            const test = prebuiltTests[index];
            if (!test) return;
            lastBuiltInIndex = index;
            activeQuizQuestions = test.questions;
            activeQuizTitle = test.title;
            initQuizEngine();
        }

        function initQuizEngine() {
            currentQuizIndex = 0;
            userAnswers = {};

            const titleEl = document.getElementById('quiz-main-title');
            if (titleEl) titleEl.innerText = activeQuizTitle;

            const timerSelect = document.getElementById('timer-select');
            const timerMinutes = timerSelect ? parseInt(timerSelect.value, 10) : 0;
            const timerBox = document.getElementById('timer-display-box');

            if (timerInterval) clearInterval(timerInterval);

            if (timerMinutes > 0 && timerBox) {
                timerSecondsLeft = timerMinutes * 60;
                timerBox.classList.remove('hidden');
                updateTimerDisplay();
                timerInterval = setInterval(() => {
                    timerSecondsLeft--;
                    updateTimerDisplay();
                    if (timerSecondsLeft <= 0) {
                        clearInterval(timerInterval);
                        showToast("De tijd is om! Je antwoorden worden nu ingeleverd en nagekeken.");
                        submitQuizForGrading();
                    }
                }, 1000);
            } else if (timerBox) {
                timerBox.classList.add('hidden');
            }

            switchTab('quiz');
            renderQuestion(0);
        }

        function updateTimerDisplay() {
            const timerText = document.getElementById('timer-text');
            if (!timerText) return;
            const mins = Math.floor(timerSecondsLeft / 60);
            const secs = timerSecondsLeft % 60;
            timerText.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }

        function renderQuestionPills() {
            const pillsContainer = document.getElementById('q-nav-pills');
            if (!pillsContainer) return;
            pillsContainer.innerHTML = '';

            activeQuizQuestions.forEach((q, idx) => {
                const pill = document.createElement('button');
                pill.type = 'button';
                pill.className = 'q-pill';
                if (idx === currentQuizIndex) pill.classList.add('current');

                const ans = userAnswers[q.id];
                const isAnswered = (q.type === 'mc' && ans?.mcChoice !== undefined) ||
                                   (q.type === 'open' && ans?.openText && ans.openText.trim().length > 0);
                if (isAnswered) pill.classList.add('answered');

                pill.innerText = idx + 1;
                pill.addEventListener('click', () => {
                    currentQuizIndex = idx;
                    renderQuestion(idx);
                });
                pillsContainer.appendChild(pill);
            });
        }

        function renderQuestion(index) {
            const q = activeQuizQuestions[index];
            if (!q) return;
            const total = activeQuizQuestions.length;

            const progText = document.getElementById('quiz-progress-text');
            const progBar = document.getElementById('quiz-progress-bar');
            const qPara = document.getElementById('q-paragraph');
            const qPts = document.getElementById('q-points');
            const qText = document.getElementById('q-text');
            const container = document.getElementById('q-answer-container');

            if (progText) progText.innerText = `Vraag ${index + 1} van ${total}`;
            if (progBar) progBar.style.width = `${((index + 1) / total) * 100}%`;
            if (qPara) qPara.innerText = q.para === 'Kaart' ? 'Kaartvaardigheden' : `§ ${q.para}`;
            if (qPts) qPts.innerText = `⭐ ${q.points} ${q.points === 1 ? 'Punt' : 'Punten'}`;
            if (qText) qText.innerText = `${index + 1}. ${q.question}`;

            renderQuestionPills();

            if (!container) return;
            container.innerHTML = '';

            if (q.type === 'mc') {
                q.options.forEach((opt, i) => {
                    const isSelected = userAnswers[q.id]?.mcChoice === i;
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = `mc-option ${isSelected ? 'selected' : ''}`;
                    btn.innerHTML = `
                        <div style="display:flex;align-items:center;">
                            <span class="mc-letter">${String.fromCharCode(65 + i)}</span>
                            <span>${opt}</span>
                        </div>
                        <span>${isSelected ? '✅' : ''}</span>
                    `;
                    btn.addEventListener('click', () => {
                        userAnswers[q.id] = { mcChoice: i };
                        renderQuestion(currentQuizIndex);
                    });
                    container.appendChild(btn);
                });
            } else {
                const textarea = document.createElement('textarea');
                textarea.rows = 5;
                textarea.placeholder = "Typ hier je uitgebreide antwoord in hele zinnen...";
                textarea.value = userAnswers[q.id]?.openText || '';
                textarea.addEventListener('input', (e) => {
                    if (!userAnswers[q.id]) userAnswers[q.id] = {};
                    userAnswers[q.id].openText = e.target.value;
                    renderQuestionPills();
                });
                container.appendChild(textarea);
            }

            const btnPrev = document.getElementById('btn-prev');
            const btnNext = document.getElementById('btn-next');
            const btnFinish = document.getElementById('btn-finish');

            if (btnPrev) btnPrev.disabled = (index === 0);
            if (index === total - 1) {
                if (btnNext) btnNext.classList.add('hidden');
                if (btnFinish) btnFinish.classList.remove('hidden');
            } else {
                if (btnNext) btnNext.classList.remove('hidden');
                if (btnFinish) btnFinish.classList.add('hidden');
            }
        }

        /* ==========================================================================
           5. OPEN ANTWOORDEN — LOKALE KERNWOORDENCONTROLE
           ========================================================================== */
        function submitQuizForGrading() {
            if (timerInterval) clearInterval(timerInterval);
            switchTab('grading');

            const openQuestions = activeQuizQuestions.filter(q => q.type === 'open');
            const statusText = document.getElementById('grading-progress-text');
            if (statusText) statusText.innerText = 'Open antwoorden vergelijken met kernbegrippen en modelantwoorden...';

            openQuestions.forEach(q => {
                const studentAnswer = userAnswers[q.id]?.openText || '';
                if (!studentAnswer.trim()) {
                    userAnswers[q.id] = {
                        openText: '',
                        localGrade: { points: 0, feedback: 'Geen antwoord ingevuld.' }
                    };
                    return;
                }
                userAnswers[q.id].localGrade = gradeWithFallback(q, studentAnswer);
            });

            calculateAndDisplayResults();
        }

        function normalizeStudyText(value) {
            return String(value || '')
                .toLocaleLowerCase('nl-NL')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function gradeWithFallback(q, studentAnswer) {
            const answer = normalizeStudyText(studentAnswer);
            const keywords = (q.keywords || []).map(normalizeStudyText).filter(Boolean);
            const matched = keywords.filter(word => answer.includes(word));
            const missing = keywords.filter(word => !answer.includes(word));
            const ratio = keywords.length ? matched.length / keywords.length : (answer.length >= 35 ? 1 : 0);
            let points = 0;

            if (ratio >= 0.65 || (matched.length >= 3 && ratio >= 0.5)) points = q.points;
            else if (ratio >= 0.25 || matched.length >= 1) points = Math.max(1, Math.floor(q.points / 2));

            let feedback;
            if (points === q.points) {
                feedback = `Sterk antwoord. Je noemt belangrijke onderdelen${matched.length ? ` (${matched.slice(0, 5).join(', ')})` : ''}. Lees het modelantwoord nog even na om te controleren of je uitleg volledig is.`;
            } else if (points > 0) {
                feedback = `Je hebt al een deel goed. Deze onderdelen herken ik: ${matched.slice(0, 5).join(', ')}. Denk ook aan: ${missing.slice(0, 4).join(', ') || 'de volledige uitleg en het verband tussen de begrippen'}.`;
            } else {
                feedback = `Je antwoord bevat nog te weinig belangrijke onderdelen. Gebruik het modelantwoord als stappenplan en probeer de vraag daarna nog eens in je eigen woorden te beantwoorden.`;
            }
            return { points, feedback, matchedKeywords: matched, missingKeywords: missing };
        }

        /* ==========================================================================
           6. RESULTS & GRADE CALCULATION
           ========================================================================== */
        function calculateAndDisplayResults() {
            let totalPossible = 0;
            let totalObtained = 0;

            activeQuizQuestions.forEach(q => {
                totalPossible += q.points;
                const ans = userAnswers[q.id];
                if (q.type === 'mc') {
                    if (ans && ans.mcChoice === q.correct) totalObtained += q.points;
                } else {
                    totalObtained += (ans?.localGrade?.points || 0);
                }
            });

            const pct = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : 0;

            // Dutch Grade formula with 55% cesuur (5.5)
            let grade = 1.0;
            if (totalObtained > 0 && totalPossible > 0) {
                const cesuur = totalPossible * 0.55;
                if (totalObtained >= cesuur) {
                    grade = 5.5 + ((totalObtained - cesuur) / (totalPossible - cesuur)) * 4.5;
                } else {
                    grade = 1.0 + (totalObtained / cesuur) * 4.5;
                }
            }
            const formattedGrade = Math.min(10.0, Math.max(1.0, grade)).toFixed(1);

            const gradeEl = document.getElementById('final-grade');
            const circleEl = document.getElementById('grade-circle');
            const badgeEl = document.getElementById('grade-badge');
            const ptsEl = document.getElementById('result-points');
            const pctEl = document.getElementById('result-percentage');
            const statusEl = document.getElementById('result-status');

            if (gradeEl) gradeEl.innerText = formattedGrade;
            if (ptsEl) ptsEl.innerText = `${totalObtained} / ${totalPossible}`;
            if (pctEl) pctEl.innerText = `${pct}%`;

            const numGrade = parseFloat(formattedGrade);
            if (numGrade >= 8.0) {
                if (circleEl) circleEl.style.borderColor = 'var(--emerald)';
                if (badgeEl) { badgeEl.className = 'tag tag-emerald'; badgeEl.innerText = 'Uitmuntend gewerkt! 🏆'; }
                if (statusEl) { statusEl.innerText = 'Ruim Voldoende'; statusEl.style.color = 'var(--emerald)'; }
            } else if (numGrade >= 5.5) {
                if (circleEl) circleEl.style.borderColor = 'var(--blue)';
                if (badgeEl) { badgeEl.className = 'tag tag-blue'; badgeEl.innerText = 'Voldoende behaald! 👍'; }
                if (statusEl) { statusEl.innerText = 'Voldoende'; statusEl.style.color = 'var(--blue)'; }
            } else {
                if (circleEl) circleEl.style.borderColor = 'var(--rose)';
                if (badgeEl) { badgeEl.className = 'tag tag-rose'; badgeEl.innerText = 'Nog even extra oefenen 📚'; }
                if (statusEl) { statusEl.innerText = 'Onvoldoende'; statusEl.style.color = 'var(--rose)'; }
            }

            renderReviewList();
            switchTab('results');
        }

        function escapeHtml(value) {
            return String(value).replace(/[&<>"']/g, char => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            })[char]);
        }

        function renderReviewList() {
            const container = document.getElementById('review-container');
            if (!container) return;
            container.innerHTML = '';

            activeQuizQuestions.forEach((q, idx) => {
                const ans = userAnswers[q.id];
                let earned = 0;
                let userStr = '';
                let feedbackStr = '';

                if (q.type === 'mc') {
                    const c = ans?.mcChoice;
                    if (c === q.correct) earned = q.points;
                    userStr = c !== undefined ? `Jouw keuze: ${String.fromCharCode(65 + c)}. ${q.options[c]}` : 'Geen antwoord gekozen';
                    feedbackStr = q.explanation;
                } else {
                    earned = ans?.localGrade?.points || 0;
                    userStr = ans?.openText ? `Jouw antwoord: "${ans.openText}"` : 'Geen antwoord ingevuld';
                    feedbackStr = ans?.localGrade?.feedback || 'Vergeleken met het modelantwoord.';
                }

                const stateClass = earned === q.points ? 'correct' : (earned > 0 ? 'partial' : 'wrong');
                const tagClass = earned === q.points ? 'tag-emerald' : (earned > 0 ? 'tag-amber' : 'tag-rose');

                const div = document.createElement('div');
                div.className = `review-card ${stateClass}`;
                div.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.75rem;">
                        <strong style="color:#fff;font-size:0.95rem;">${idx + 1}. ${q.question}</strong>
                        <span class="tag ${tagClass}" style="flex-shrink:0;">${earned} / ${q.points} pt</span>
                    </div>
                    <div class="user-answer-box">${escapeHtml(userStr)}</div>
                    ${q.type === 'mc'
                        ? `<div style="font-size:0.85rem;color:var(--emerald);font-weight:700;">✅ Juist antwoord: ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}</div>`
                        : `<div style="font-size:0.85rem;color:#e2e8f0;"><strong>📖 Modelantwoord:</strong> ${q.modelAnswer}</div>`
                    }
                    <div class="feedback-box">💡 <strong>Feedback:</strong> ${feedbackStr}</div>
                `;
                container.appendChild(div);
            });
        }

        /* ==========================================================================
           7. OEFENMIX — WILLEKEURIGE VRAGEN UIT DE INGEBOUWDE VRAGENBANK
           ========================================================================== */
        function shuffleArray(items) {
            const copy = [...items];
            for (let i = copy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            return copy;
        }

        function keywordSeeds(definition) {
            const stopWords = new Set(['de','het','een','en','of','van','door','met','als','dat','dit','die','wordt','worden','zijn','is','op','in','uit','bij','naar','voor','zonder','waardoor','zoals','kan','kunnen','dan','ook','wel','niet','zelfde','plek','materiaal']);
            return [...new Set(normalizeStudyText(definition).split(' ').filter(word => word.length >= 5 && !stopWords.has(word)))].slice(0, 7);
        }

        function makeGeoMultipleChoice(id, para, question, correctText, distractors, explanation, level = 'basis') {
            const unique = [...new Set([correctText, ...distractors])].slice(0, 4);
            const options = shuffleArray(unique);
            return {
                id, para, points: 1, type: 'mc', level, question,
                options,
                correct: options.indexOf(correctText),
                explanation
            };
        }

        const geoApplicationQuestions = [
            {id:'scenario-1',para:'1.1',points:2,type:'open',level:'challenge',question:'Een gebergte heeft hoge, spitse toppen en diepe, steile dalen. Leg uit of dit eerder een jong of oud gebergte is en noem een kenmerk.',modelAnswer:'Dit is eerder een jong gebergte. Jonge gebergten hebben hoge, spitse toppen en diepe, steile dalen.',keywords:['jong gebergte','spitse toppen','diepe dalen']},
            {id:'scenario-2',para:'1.1',points:1,type:'mc',level:'havo',question:'Twee aardkorstplaten botsen tegen elkaar. Welk landschap kan daardoor ontstaan?',options:['Een gebergte','Een delta','Een duinlandschap','Een estuarium'],correct:0,explanation:'Bij het naar elkaar toe bewegen en botsen van aardkorstplaten kan gebergtevorming plaatsvinden.'},
            {id:'scenario-3',para:'1.2',points:2,type:'open',level:'challenge',question:'Water komt in een rotsspleet, bevriest en zet uit. Leg uit welk soort verwering dit is en waarom de spleet groter kan worden.',modelAnswer:'Dit is mechanische verwering, namelijk vorstverwering. Het water bevriest en zet uit, waardoor de druk in de spleet groter wordt en de spleet wijder kan worden.',keywords:['mechanische verwering','vorstverwering','bevriest','zet uit','spleet']},
            {id:'scenario-4',para:'1.2',points:1,type:'mc',level:'havo',question:'In welke omstandigheden verloopt chemische verwering volgens de leerstof vaak het snelst?',options:['Warm en vochtig','Koud en droog','Alleen bij vorst','Alleen in een woestijn'],correct:0,explanation:'Warmte en vocht bevorderen veel chemische reacties en versnellen chemische verwering.'},
            {id:'scenario-5',para:'1.3',points:2,type:'open',level:'havo',question:'Leg het verschil uit tussen verwering en erosie.',modelAnswer:'Bij verwering breekt gesteente op één plek af of verandert het. Bij erosie wordt materiaal door water, ijs of wind uitgesleten en meegenomen.',keywords:['verwering','op een plek','erosie','water','ijs','wind','meegenomen']},
            {id:'scenario-6',para:'1.3',points:1,type:'mc',level:'basis',question:'Welke kracht zorgt ervoor dat los gesteente langs een helling naar beneden beweegt?',options:['Zwaartekracht','Magnetisme','Zonlicht','Getijdenwerking'],correct:0,explanation:'Massabewegingen worden veroorzaakt door de zwaartekracht.'},
            {id:'scenario-7',para:'1.3',points:1,type:'mc',level:'basis',question:'Welk dal hoort bij uitschuring door een rivier?',options:['V-dal','U-dal','Delta','Estuarium'],correct:0,explanation:'Een rivier snijdt vooral de bodem uit en kan zo een V-dal vormen.'},
            {id:'scenario-8',para:'1.3',points:1,type:'mc',level:'basis',question:'Welk dal wordt breed uitgesleten door een gletsjer?',options:['U-dal','V-dal','Kloofdelta','Duinvallei'],correct:0,explanation:'Een gletsjer schuurt zowel de dalbodem als de zijkanten uit; zo ontstaat een U-dal.'},
            {id:'scenario-9',para:'1.4',points:2,type:'open',level:'challenge',question:'Een rivier stroomt richting zee en wordt steeds langzamer. Leg uit waarom eerst grover materiaal en later fijner materiaal kan worden afgezet.',modelAnswer:'Als de stroomsnelheid afneemt, kan de rivier minder materiaal vervoeren. Grote en zware deeltjes worden eerder afgezet; kleine en lichte kleideeltjes bezinken pas bij een lage stroomsnelheid.',keywords:['stroomsnelheid','minder vervoeren','grote','zware','kleine','lichte','klei','afgezet']},
            {id:'scenario-10',para:'1.4',points:1,type:'mc',level:'havo',question:'Een rivier vertakt zich bij de monding en zet veel sediment af. Hoe heet deze riviermonding?',options:['Delta','Estuarium','U-dal','Hoogvlakte'],correct:0,explanation:'Een delta ontstaat door sedimentafzetting bij de riviermonding, waarna de rivier zich kan vertakken.'},
            {id:'scenario-11',para:'1.4',points:1,type:'mc',level:'havo',question:'Welke vorm past het best bij een estuarium?',options:['Trechtervormige riviermonding','Vertakte riviermonding met veel afzetting','Smalle V-vormige bergvallei','Brede gletsjervallei'],correct:0,explanation:'Een estuarium is een trechtervormige riviermonding die samenhangt met getijdenwerking.'},
            {id:'scenario-12',para:'Kaart',points:1,type:'mc',level:'basis',question:'Op een kaart liggen hoogtelijnen heel dicht bij elkaar. Wat betekent dit?',options:['De helling is steil','De helling is flauw','Het gebied ligt op zeeniveau','Er is geen hoogteverschil'],correct:0,explanation:'Hoe dichter hoogtelijnen bij elkaar liggen, hoe sneller de hoogte verandert: de helling is steil.'},
            {id:'scenario-13',para:'Kaart',points:2,type:'open',level:'havo',question:'Een bergtop ligt op 860 meter en het dal ernaast op 320 meter. Bereken het hoogteverschil.',modelAnswer:'860 − 320 = 540 meter.',keywords:['860','320','540','hoogteverschil','meter']},
            {id:'scenario-14',para:'Kaart',points:1,type:'mc',level:'basis',question:'In welke hoogtezone valt een gebied op 350 meter hoogte?',options:['Heuvelland','Laagland','Middelgebergte','Hooggebergte'],correct:0,explanation:'Heuvelland ligt tussen 200 en 500 meter.'}
        ];

        function buildGeographyQuestionPool() {
            const curated = prebuiltTests.flatMap(test => test.questions).map(question => ({
                ...question,
                id: `basis-${question.id}`,
                level: question.level || (question.type === 'open' ? 'havo' : 'basis')
            }));
            const conceptQuestions = [];
            flashcardsData.forEach(card => {
                const otherCards = shuffleArray(flashcardsData.filter(other => other.id !== card.id));
                const termOptions = otherCards.slice(0, 3).map(other => other.term);
                conceptQuestions.push(makeGeoMultipleChoice(
                    `concept-definition-${card.id}`, card.para,
                    `Welk begrip past bij deze omschrijving? “${card.def}”`,
                    card.term, termOptions,
                    `${card.term}: ${card.def}`, 'basis'
                ));
                const definitionOptions = otherCards.slice(0, 3).map(other => other.def);
                conceptQuestions.push(makeGeoMultipleChoice(
                    `concept-meaning-${card.id}`, card.para,
                    `Welke omschrijving past bij het begrip ${card.term}?`,
                    card.def, definitionOptions,
                    `${card.term}: ${card.def}`, 'havo'
                ));
                conceptQuestions.push({
                    id: `concept-open-${card.id}`, para: card.para, points: 2, type: 'open', level: 'havo',
                    question: `Leg in je eigen woorden uit wat ${card.term} betekent.`,
                    modelAnswer: card.def,
                    keywords: [card.term.toLocaleLowerCase('nl-NL'), ...keywordSeeds(card.def)].slice(0, 7)
                });
            });
            return [...curated, ...conceptQuestions, ...geoApplicationQuestions];
        }

        function balancedQuestionSelection(pool, count) {
            const groups = new Map();
            shuffleArray(pool).forEach(question => {
                const key = question.para || 'overig';
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(question);
            });
            const queues = shuffleArray([...groups.values()]);
            const selected = [];
            while (selected.length < count && queues.some(queue => queue.length)) {
                for (const queue of queues) {
                    if (queue.length && selected.length < count) selected.push(queue.pop());
                }
            }
            return selected;
        }

        function generatePracticeMix() {
            const topic = document.getElementById('gen-topic')?.value || 'all';
            const count = Number.parseInt(document.getElementById('gen-count')?.value || '10', 10);
            const questionType = document.getElementById('gen-type')?.value || 'mixed';
            const difficulty = document.getElementById('gen-difficulty')?.value || 'havo';
            const button = document.getElementById('btn-generate-mix');
            const loading = document.getElementById('gen-loading');
            if (button) button.disabled = true;
            if (loading) loading.classList.remove('hidden');

            window.setTimeout(() => {
                let pool = buildGeographyQuestionPool();
                if (topic !== 'all') pool = pool.filter(question => question.para === topic);
                if (difficulty === 'basis') pool = pool.filter(question => question.level === 'basis' || (questionType === 'open' && question.level === 'havo'));
                else if (difficulty === 'havo') pool = pool.filter(question => question.level !== 'challenge');
                else pool = pool.filter(question => question.level === 'havo' || question.level === 'challenge');
                if (questionType !== 'mixed') pool = pool.filter(question => question.type === questionType);

                if (!pool.length) {
                    showToast('Geen vragen gevonden met deze combinatie. Kies een ander niveau of vraagtype.');
                    if (button) button.disabled = false;
                    if (loading) loading.classList.add('hidden');
                    return;
                }
                const selected = balancedQuestionSelection(pool, Math.min(count, pool.length));
                activeQuizQuestions = selected.map(question => ({ ...question }));
                const topicLabels = {'all':'heel hoofdstuk 1','1.1':'§ 1.1 · Gebergten','1.2':'§ 1.2 · Verwering','1.3':'§ 1.3 · Erosie','1.4':'§ 1.4 · Sedimentatie','Kaart':'kaartvaardigheden'};
                const levelLabels = {basis:'Basis',havo:'Havo 2',uitdaging:'Uitdaging'};
                activeQuizTitle = `Slimme oefentoets · ${topicLabels[topic] || topic} · ${levelLabels[difficulty]} (${selected.length} vragen)`;
                if (selected.length < count) showToast(`Er zijn ${selected.length} passende vragen. Je krijgt ze allemaal, zonder dubbele vragen.`);
                if (button) button.disabled = false;
                if (loading) loading.classList.add('hidden');
                initQuizEngine();
            }, 180);
        }

        /* ==========================================================================
           8. FLASHCARDS RENDER (WITH SAFE NULL CHECKS)
           ========================================================================== */
        function renderFlashcards() {
            const container = document.getElementById('flashcard-grid');
            const filterEl = document.getElementById('fc-filter');
            const searchEl = document.getElementById('fc-search');
            const countEl = document.getElementById('fc-count');

            if (!container) return;

            const filterVal = filterEl ? filterEl.value : 'all';
            const searchVal = searchEl ? searchEl.value.toLowerCase().trim() : '';

            const filtered = flashcardsData.filter(card => {
                const matchPara = (filterVal === 'all' || card.para === filterVal);
                const matchText = card.term.toLowerCase().includes(searchVal) || card.def.toLowerCase().includes(searchVal);
                return matchPara && matchText;
            });

            if (countEl) {
                countEl.innerText = String(filtered.length);
            }

            container.innerHTML = '';

            if (filtered.length === 0) {
                container.innerHTML = `<div class="panel" style="grid-column:1/-1;text-align:center;color:var(--text-muted);">Geen begrippen gevonden voor deze zoekopdracht.</div>`;
                return;
            }

            filtered.forEach(card => {
                const el = document.createElement('div');
                el.className = 'flashcard';
                el.addEventListener('click', () => el.classList.toggle('flipped'));

                el.innerHTML = `
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span class="tag tag-emerald">${card.para === 'Kaart' ? 'Kaart' : '§ ' + card.para}</span>
                                <span style="font-size:0.72rem;color:var(--text-dim);">🔄 Klik om te draaien</span>
                            </div>
                            <div class="fc-term">${card.term}</div>
                            <div style="font-size:0.7rem;color:var(--text-dim);text-align:center;">Begrip</div>
                        </div>
                        <div class="flashcard-back">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <strong style="color:var(--emerald);font-size:0.85rem;">${card.term}</strong>
                                <span style="font-size:0.72rem;color:var(--text-dim);">Uitleg</span>
                            </div>
                            <div class="fc-def">${card.def}</div>
                            <div style="font-size:0.7rem;color:var(--text-dim);text-align:center;">Klik om terug te draaien</div>
                        </div>
                    </div>
                `;
                container.appendChild(el);
            });
        }

        /* ==========================================================================
           9. INITIALIZE ALL EVENT LISTENERS SAFELY
           ========================================================================== */
        document.addEventListener('DOMContentLoaded', () => {
            const installButton = document.getElementById('install-app-btn');
            updateInstallButtonVisibility('home');
            installButton?.addEventListener('click', installStudyHub);

            document.getElementById('brand-logo')?.addEventListener('click', () => switchTab('home'));

            document.querySelectorAll('.nav-tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tab = btn.getAttribute('data-tab');
                    if (tab) switchTab(tab);
                });
            });

            document.querySelectorAll('[data-open-subject]').forEach(card => {
                const openCard = () => openSubjectCard(card.getAttribute('data-open-subject'));
                card.addEventListener('click', openCard);
                card.addEventListener('keydown', event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openCard();
                    }
                });
            });

            document.querySelectorAll('.start-test-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.getAttribute('data-test-index') || '0', 10);
                    startBuiltInQuiz(idx);
                });
            });

            document.getElementById('btn-generate-mix')?.addEventListener('click', generatePracticeMix);
            document.getElementById('open-geo-generator')?.addEventListener('click', () => switchTab('generator'));
            document.getElementById('open-geo-summaries')?.addEventListener('click', () => switchTab('summary'));
            document.querySelectorAll('.geo-topic-start').forEach(button => {
                button.addEventListener('click', () => {
                    const topic = button.dataset.topic;
                    const select = document.getElementById('gen-topic');
                    if (select) select.value = topic;
                    switchTab('generator');
                });
            });

            document.getElementById('btn-prev')?.addEventListener('click', () => {
                if (currentQuizIndex > 0) {
                    currentQuizIndex--;
                    renderQuestion(currentQuizIndex);
                }
            });

            document.getElementById('btn-next')?.addEventListener('click', () => {
                if (currentQuizIndex < activeQuizQuestions.length - 1) {
                    currentQuizIndex++;
                    renderQuestion(currentQuizIndex);
                }
            });

            document.getElementById('btn-quit-quiz')?.addEventListener('click', () => {
                if (timerInterval) clearInterval(timerInterval);
                switchTab('tests');
            });

            document.getElementById('btn-finish')?.addEventListener('click', submitQuizForGrading);

            document.getElementById('btn-restart-tests')?.addEventListener('click', () => switchTab('tests'));
            document.getElementById('btn-retry-same')?.addEventListener('click', () => initQuizEngine());
            document.getElementById('btn-review-learn')?.addEventListener('click', () => switchTab('learn'));

            document.getElementById('fc-filter')?.addEventListener('change', renderFlashcards);
            document.getElementById('fc-search')?.addEventListener('input', renderFlashcards);

            document.getElementById('toast-close')?.addEventListener('click', () => {
                document.getElementById('toast-message')?.classList.add('hidden');
            });

            renderFlashcards();
        });

/* ===============================================================
   WISKUNDE APP · lokale oefenmodules en voortgang
   =============================================================== */
(function StudyHubMathApp(){
const bank = {
  1: [
    {q:'In een tabel staat: x = 0, 1, 2 en y = 4, 7, 10. Welke formule hoort bij dit lineaire verband?',o:['y = 4x + 3','y = 3x + 4','y = 7x + 4','y = 3x + 1'],a:1,e:'De y-waarde begint bij 4. Bij elke stap van x komt er 3 bij. Dus y = 3x + 4.'},
    {q:'Bereken y als y = −2x + 7 en x = 3.',o:['−1','1','5','13'],a:1,e:'Vul x = 3 in: y = −2 × 3 + 7 = −6 + 7 = 1.'},
    {q:'Wat is het startgetal in de formule y = 5x − 4?',o:['5','−4','4','−5'],a:1,e:'Het startgetal is het getal zonder x. Hier is dat −4.'},
    {q:'Bij een lineair verband neemt y telkens met 8 toe als x met 2 toeneemt. Wat is het hellingsgetal?',o:['2','4','8','16'],a:1,e:'Het hellingsgetal is de toename van y gedeeld door de toename van x: 8 ÷ 2 = 4.'},
    {q:'Welke formule hoort bij een recht evenredig verband?',o:['y = 4x + 2','y = 4x','y = 4 + x','y = x − 4'],a:1,e:'Een recht evenredig verband heeft de vorm y = ax. Het startgetal is 0, dus de grafiek gaat door de oorsprong.'},
    {q:'Een lijn gaat door de punten (2, 5) en (6, 13). Wat is het hellingsgetal?',o:['1','2','3','4'],a:1,e:'De x-toename is 6 − 2 = 4 en de y-toename is 13 − 5 = 8. Het hellingsgetal is 8 ÷ 4 = 2.'},
    {q:'Een lineaire formule heeft startgetal 3 en hellingsgetal 4. Welke formule past daarbij?',o:['y = 3x + 4','y = 4x + 3','y = 4x − 3','y = 3x − 4'],a:1,e:'In y = ax + b is a het hellingsgetal (4) en b het startgetal (3). Dus y = 4x + 3.'},
    {q:'Is y = 3x + 2 een recht evenredig verband?',o:['Ja, want het is lineair','Nee, want het startgetal is niet 0','Ja, want het hellingsgetal is 3','Nee, want de formule heeft een x'],a:1,e:'Een recht evenredig verband moet door (0,0) gaan. Bij x = 0 is y = 2, dus dat is hier niet zo.'}
  ],
  3: [
    {q:'Een zijde van 4 cm wordt vergroot naar 6 cm. Wat is de vergrotingsfactor?',o:['0,5','1,25','1,5','2'],a:2,e:'Vergrotingsfactor = nieuwe lengte ÷ oude lengte = 6 ÷ 4 = 1,5.'},
    {q:'Een lengte van 5 cm wordt verkleind met factor 0,8. Hoe lang wordt de nieuwe zijde?',o:['4 cm','4,8 cm','5,8 cm','6,25 cm'],a:0,e:'Vermenigvuldig de oude lengte met de factor: 5 × 0,8 = 4 cm.'},
    {q:'Welke uitspraak hoort bij gelijkvormige figuren?',o:['Alle zijden zijn even lang','Alle hoeken zijn gelijk en zijden hebben dezelfde verhouding','De oppervlakten zijn altijd gelijk','De figuren moeten dezelfde grootte hebben'],a:1,e:'Gelijkvormige figuren hebben overeenkomstige hoeken die even groot zijn en overeenkomstige zijden met één vaste verhouding.'},
    {q:'Op een kaart met schaal 1 : 100 meet een muur 3,5 cm. Hoe lang is de muur in werkelijkheid?',o:['35 cm','100 cm','3,5 m','35 m'],a:2,e:'3,5 × 100 = 350 cm. Dat is 3,5 meter.'},
    {q:'Een driehoek wordt vergroot met factor 1,25. Een zijde is eerst 8 cm. Hoe lang wordt die zijde?',o:['6,4 cm','9 cm','10 cm','12 cm'],a:2,e:'8 × 1,25 = 10 cm.'},
    {q:'De lengtes van een figuur worden 3 keer zo groot. Hoeveel keer zo groot wordt de oppervlakte?',o:['3 keer','6 keer','9 keer','12 keer'],a:2,e:'Oppervlakte schaalt met het kwadraat van de lengtfactor: 3² = 9.'},
    {q:'Twee driehoeken hebben overeenkomstige zijden 4 cm en 6 cm, maar ook 5 cm en 8 cm. Zijn ze gelijkvormig?',o:['Ja, factor 1,5','Ja, factor 1,6','Nee, de verhoudingen zijn niet gelijk','Dat kun je nooit bepalen'],a:2,e:'6 ÷ 4 = 1,5 maar 8 ÷ 5 = 1,6. De verhoudingen zijn niet gelijk, dus ze zijn niet gelijkvormig.'},
    {q:'Een schaalmodel is 12 cm hoog. De echte toren is 36 meter hoog. Wat is de vergrotingsfactor van model naar werkelijkheid?',o:['3','30','300','3000'],a:2,e:'Zet eerst 36 meter om naar 3600 cm. Dan 3600 ÷ 12 = 300.'}
  ],
  4: [
    {q:'Wat is √196?',o:['12','13','14','16'],a:2,e:'14 × 14 = 196, dus √196 = 14.'},
    {q:'Tussen welke twee hele getallen ligt √50?',o:['5 en 6','6 en 7','7 en 8','8 en 9'],a:2,e:'7² = 49 en 8² = 64. Omdat 50 tussen 49 en 64 ligt, ligt √50 tussen 7 en 8.'},
    {q:'Vereenvoudig: 3√5 + 2√5.',o:['5√10','6√5','5√5','√25'],a:2,e:'Het getal onder het wortelteken is hetzelfde. Tel de getallen ervoor op: 3 + 2 = 5. Dus 5√5.'},
    {q:'Bereken √3 × √12.',o:['√15','6','√36 + 1','12'],a:1,e:'√3 × √12 = √36 = 6.'},
    {q:'Welke vereenvoudigde vorm hoort bij √72?',o:['3√8','6√2','8√3','12√2'],a:1,e:'72 = 36 × 2. Dus √72 = √36 × √2 = 6√2.'},
    {q:'Wat is √(−25) binnen de gewone reële getallen?',o:['−5','5','0','Bestaat niet als reëel getal'],a:3,e:'Het kwadraat van elk reëel getal is 0 of positief. Daarom heeft √(−25) geen reële uitkomst.'},
    {q:'Bereken 2√3 × 3√12.',o:['6√15','18','36','6√36'],a:2,e:'Vermenigvuldig de getallen buiten de wortel: 2 × 3 = 6. Dan √3 × √12 = √36 = 6. Samen 6 × 6 = 36.'},
    {q:'Welke uitspraak is juist?',o:['√81 = 8','√0 = 0','√−9 = −3','√100 = 100'],a:1,e:'De vierkantswortel van 0 is 0. Controle: 0 × 0 = 0.'}
  ],
  6: [
    {q:'Welke zijde heet de schuine zijde in een rechthoekige driehoek?',o:['Een zijde naast de rechte hoek','De kortste zijde','De zijde tegenover de rechte hoek','Elke zijde mag zo heten'],a:2,e:'De schuine zijde ligt tegenover de rechte hoek en is de langste zijde van de rechthoekige driehoek.'},
    {q:'Een rechthoekige driehoek heeft rechthoekszijden van 6 cm en 8 cm. Hoe lang is de schuine zijde?',o:['9 cm','10 cm','12 cm','14 cm'],a:1,e:'c² = 6² + 8² = 36 + 64 = 100. Dus c = √100 = 10 cm.'},
    {q:'De schuine zijde is 13 cm en een rechthoekszijde is 5 cm. Hoe lang is de andere rechthoekszijde?',o:['8 cm','10 cm','12 cm','18 cm'],a:2,e:'b² = 13² − 5² = 169 − 25 = 144. Dus b = √144 = 12 cm.'},
    {q:'Een rechthoek is 9 cm lang en 12 cm breed. Hoe lang is de diagonaal?',o:['13 cm','14 cm','15 cm','21 cm'],a:2,e:'De diagonaal is de schuine zijde: d² = 9² + 12² = 81 + 144 = 225. Dus d = 15 cm.'},
    {q:'Een kubus heeft ribben van 4 cm. Welke berekening geeft de lichaamsdiagonaal?',o:['√(4² + 4²)','√(4² + 4² + 4²)','4 + 4 + 4','4² × 3'],a:1,e:'De lichaamsdiagonaal gebruikt drie loodrechte richtingen. Daarom is de lengte √(4² + 4² + 4²) = √48 = 4√3 cm.'},
    {q:'Een balk heeft lengte 3 cm, breedte 4 cm en hoogte 12 cm. Hoe lang is de lichaamsdiagonaal?',o:['12 cm','13 cm','15 cm','19 cm'],a:1,e:'d² = 3² + 4² + 12² = 9 + 16 + 144 = 169. Dus d = 13 cm.'},
    {q:'Een gelijkbenige driehoek heeft twee schuine zijden van 13 cm en een basis van 10 cm. Hoe hoog is de driehoek?',o:['5 cm','10 cm','12 cm','13 cm'],a:2,e:'De hoogte deelt de basis in twee stukken van 5 cm. Dan geldt h² = 13² − 5² = 169 − 25 = 144, dus h = 12 cm.'},
    {q:'Welke driehoek gebruik je bij een rechte vierkante piramide om de schuine ribbe van de top naar een hoekpunt te berekenen?',o:['Een driehoek met de hoogte van de piramide en de afstand van het middelpunt van de bodem naar een hoekpunt','Een driehoek met alleen twee zijden van het grondvlak','Een gelijkzijdige driehoek op de bodem','Geen driehoek; je telt de ribben op'],a:0,e:'Je tekent een rechthoekige driehoek van de top naar het middelpunt van het grondvlak en vervolgens naar een hoekpunt. De hoogte en de afstand in het grondvlak vormen de rechthoekszijden; de schuine ribbe is de schuine zijde.'}
  ]
};
const chapterNames={1:'H1 · Lineaire formules',3:'H3 · Gelijkvormigheid',4:'H4 · Wortels',6:'H6 · De stelling van Pythagoras'};
let currentChapter=null,currentQuestions=[],currentIndex=0,correctCount=0,answered=false;
const $math = id => document.getElementById(id);
function showMathView(id){['overviewView','mathMixView','practiceView','formulaView','videosView'].forEach(v=>{const el=$math(v);if(el)el.classList.toggle('hidden',v!==id);});window.scrollTo({top:0,behavior:'smooth'});}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function uniqueNumbers(values){return [...new Set(values.map(v=>Math.round(v*1000)/1000))];}
function prettyNumber(value){return Number.isInteger(value)?String(value):String(Number(value.toFixed(2))).replace('.',',');}
function signedNumber(value){return value<0?`− ${Math.abs(value)}`:`+ ${value}`;}
function linearFormula(a,b){return `y = ${a===1?'':a===-1?'−':a}x ${signedNumber(b)}`;}
function mathQuestion(prompt, correctValue, distractorValues, explanation){
  const correct=String(correctValue);
  let wrong=[...new Set(distractorValues.map(String).filter(value=>value!==correct))];
  let bump=1;
  const numericMatch=correct.match(/^(-?\d+(?:[.,]\d+)?)(.*)$/);
  while(wrong.length<3){
    let candidate;
    if(numericMatch){
      const numeric=Number(numericMatch[1].replace(',','.'));
      candidate=`${prettyNumber(numeric+bump)}${numericMatch[2]}`;
    } else {
      candidate=`Alternatief ${wrong.length+1}`;
    }
    if(candidate!==correct&&!wrong.includes(candidate))wrong.push(candidate);
    bump++;
  }
  const options=shuffle([correct,...wrong.slice(0,3)]);
  return {q:prompt,o:options,a:options.indexOf(correct),e:explanation};
}
function makeMathVariants(chapter,difficulty='havo'){
  const questions=[];
  const hard=difficulty==='challenge';
  const easy=difficulty==='basis';
  const add=(q)=>questions.push(q);

  if(chapter===1){
    for(let i=0;i<5;i++){
      const a=randInt(hard?-9:-6,hard?11:8)||2,b=randInt(-12,14),x=randInt(easy?1:-4,hard?9:6),answer=a*x+b;
      add(mathQuestion(`Bereken y bij ${linearFormula(a,b)} als x = ${x}.`,answer,[a*x-b,a+b+x,a*x+b+randInt(2,7)],`Vul x in: y = ${a} × ${x} ${signedNumber(b)} = ${a*x} ${signedNumber(b)} = ${answer}.`));
    }
    for(let i=0;i<4;i++){
      const a=randInt(-7,9)||3,b=randInt(-10,12),x1=randInt(-4,3),x2=x1+randInt(2,5),y1=a*x1+b,y2=a*x2+b;
      const target=linearFormula(a,b);
      add(mathQuestion(`Een rechte lijn gaat door (${x1}, ${y1}) en (${x2}, ${y2}). Welke formule hoort bij de lijn?`,target,[linearFormula(a+1,b),linearFormula(a,b+randInt(2,5)),linearFormula(-a,b)],`Het hellingsgetal is (${y2} − ${y1}) ÷ (${x2} − ${x1}) = ${a}. Vul een punt in om b = ${b} te vinden. De formule is ${target}.`));
    }
    for(let i=0;i<4;i++){
      const a=randInt(2,9),x=randInt(2,9),b=randInt(-8,9),y=a*x+b;
      add(mathQuestion(`Bij ${linearFormula(a,b)} hoort y = ${y}. Welke x-waarde hoort daarbij?`,x,[x+1,Math.max(0,x-1),x+2],`Los ${a}x ${signedNumber(b)} = ${y} op. Dan ${a}x = ${y-b} en x = ${x}.`));
    }
    for(let i=0;i<3;i++){
      const a=randInt(1,8),b=randInt(-6,8),formula=linearFormula(a,b),correct=b===0?'Ja':'Nee';
      add(mathQuestion(`Is ${formula} een recht evenredig verband?`,correct,correct==='Ja'?['Nee','Alleen als x positief is','Dat kun je niet zien']:['Ja','Alleen bij x = 0','Altijd'],b===0?'Ja. Bij een recht evenredig verband is het startgetal 0 en heeft de formule de vorm y = ax.':`Nee. Het startgetal is ${b}; bij een recht evenredig verband moet b = 0 zijn.`));
    }
  }

  if(chapter===3){
    for(let i=0;i<5;i++){
      const old=randInt(2,16),factorTenths=randInt(5,hard?25:20),factor=factorTenths/10,newLength=old*factor;
      add(mathQuestion(`Een zijde van ${old} cm wordt vergroot of verkleind tot ${prettyNumber(newLength)} cm. Wat is de factor?`,prettyNumber(factor),[prettyNumber(factor+0.2),prettyNumber(Math.max(0.1,factor-0.2)),prettyNumber(old/newLength)],`Factor = nieuwe lengte ÷ oude lengte = ${prettyNumber(newLength)} ÷ ${old} = ${prettyNumber(factor)}.`));
    }
    for(let i=0;i<4;i++){
      const factorTenths=randInt(6,hard?24:18),factor=factorTenths/10,old=randInt(3,15),answer=old*factor;
      add(mathQuestion(`Een figuur wordt vergroot/verkleind met factor ${prettyNumber(factor)}. Een zijde was ${old} cm. Hoe lang wordt die zijde?`,`${prettyNumber(answer)} cm`,[`${prettyNumber(answer+1)} cm`,`${prettyNumber(Math.max(0,answer-1))} cm`,`${prettyNumber(old/factor)} cm`],`Nieuwe lengte = oude lengte × factor = ${old} × ${prettyNumber(factor)} = ${prettyNumber(answer)} cm.`));
    }
    for(let i=0;i<3;i++){
      const factor=randInt(2,4),areaFactor=factor*factor;
      add(mathQuestion(`Alle zijden van een figuur worden ${factor} keer zo lang. Hoeveel keer zo groot wordt de oppervlakte?`,`${areaFactor} keer`,[`${factor-1} keer`,`${factor+1} keer`,`${factor*3} keer`],`Oppervlakte schaalt met het kwadraat van de lengtfactor: ${factor}² = ${areaFactor}.`));
    }
    for(let i=0;i<3;i++){
      const scale=randInt(20,100),map=randInt(2,9),actual=scale*map;
      add(mathQuestion(`Op een kaart met schaal 1 : ${scale} is een afstand ${map} cm. Hoeveel cm is dat in werkelijkheid?`,`${actual} cm`,[`${actual/10} cm`,`${actual+scale} cm`,`${map+scale} cm`],`Werkelijke afstand = ${map} × ${scale} = ${actual} cm.`));
    }
  }

  if(chapter===4){
    for(let i=0;i<4;i++){
      const n=randInt(3,hard?24:18),square=n*n;
      add(mathQuestion(`Wat is √${square}?`,n,[n-1,n+1,square],`Omdat ${n} × ${n} = ${square}, geldt √${square} = ${n}.`));
    }
    for(let i=0;i<3;i++){
      const n=randInt(3,14),inside=n*n+randInt(1,2*n),correct=`${n} en ${n+1}`;
      add(mathQuestion(`Tussen welke twee opeenvolgende hele getallen ligt √${inside}?`,correct,[`${n-1} en ${n}`,`${n+1} en ${n+2}`,`${n-2} en ${n-1}`],`${n}² = ${n*n} en ${n+1}² = ${(n+1)*(n+1)}. ${inside} ligt daartussen, dus √${inside} ligt tussen ${n} en ${n+1}.`));
    }
    for(let i=0;i<4;i++){
      const outside=randInt(2,9),inside=[2,3,5,6,7,10][randInt(0,5)],value=outside*outside*inside,answer=`${outside}√${inside}`;
      add(mathQuestion(`Vereenvoudig √${value}.`,answer,[`${outside+1}√${inside}`,`${outside}√${inside+1}`,`${inside}√${outside}`],`Splits ${value} in ${outside*outside} × ${inside}. Dan √${value} = √${outside*outside} × √${inside} = ${answer}.`));
    }
    for(let i=0;i<3;i++){
      const a=randInt(2,7),b=randInt(2,8),same=randInt(2,9),mode=randInt(0,1);
      const expression=mode?`${a}√${same} + ${b}√${same}`:`${a}√${same} − ${b}√${same}`;
      const result=mode?a+b:a-b,answer=result===0?'0':`${result===1?'':result===-1?'−':result}√${same}`;
      add(mathQuestion(`Vereenvoudig: ${expression}.`,answer,[`${a+b}√${same*2}`,`${a*b}√${same}`,`${result}√${same+1}`],`De wortel blijft hetzelfde. ${a} ${mode?'+':'−'} ${b} = ${result}, dus de uitkomst is ${answer}.`));
    }
  }

  if(chapter===6){
    const triples=[[3,4,5],[5,12,13],[6,8,10],[8,15,17],[7,24,25]];
    for(let i=0;i<5;i++){
      const [aa,bb,cc]=triples[randInt(0,triples.length-1)],k=randInt(1,hard?4:3),a=aa*k,b=bb*k,c=cc*k;
      add(mathQuestion(`Een rechthoekige driehoek heeft rechthoekszijden ${a} cm en ${b} cm. Hoe lang is de schuine zijde?`,`${c} cm`,[`${c+1} cm`,`${Math.abs(a-b)} cm`,`${a+b} cm`],`c² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}. Dus c = √${c*c} = ${c} cm.`));
    }
    for(let i=0;i<4;i++){
      const [aa,bb,cc]=triples[randInt(0,triples.length-1)],k=randInt(1,hard?3:2),known=aa*k,c=cc*k,missing=bb*k;
      add(mathQuestion(`De schuine zijde is ${c} cm en één rechthoekszijde is ${known} cm. Bereken de andere rechthoekszijde.`,`${missing} cm`,[`${c-known} cm`,`${Math.sqrt(c*c+known*known)} cm`,`${missing+2} cm`],`b² = c² − a² = ${c}² − ${known}² = ${c*c} − ${known*known} = ${missing*missing}. Dus b = ${missing} cm.`));
    }
    for(let i=0;i<4;i++){
      const [a,b,c]=triples[randInt(0,triples.length-1)];
      add(mathQuestion(`Een rechthoek is ${a} cm lang en ${b} cm breed. Hoe lang is de diagonaal?`,`${c} cm`,[`${a+b} cm`,`${c+2} cm`,`${Math.abs(a-b)} cm`],`De diagonaal is de schuine zijde: d² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}. Dus d = ${c} cm.`));
    }
    for(let i=0;i<3;i++){
      const [a,b,c]=triples[randInt(0,triples.length-1)],correct='Ja';
      add(mathQuestion(`Een driehoek heeft zijden ${a} cm, ${b} cm en ${c} cm. Is dit een rechthoekige driehoek?`,correct,['Nee','Alleen als de kleinste hoek recht is','Dat is niet te bepalen'],`Controleer de langste zijde: ${a}² + ${b}² = ${a*a+b*b} en ${c}² = ${c*c}. De uitkomsten zijn gelijk, dus de driehoek is rechthoekig.`));
    }
  }
  return questions;
}
function buildMathPool(chapter,difficulty='havo'){
  const chapters=chapter==='mix'?[1,3,4,6]:[Number(chapter)];
  return chapters.flatMap(ch=>[...(bank[ch]||[]),...makeMathVariants(ch,difficulty)]);
}
function startPractice(chapter, requestedCount=null, generated=false, customPool=null){
  currentChapter=chapter;
  const pool=customPool||buildMathPool(chapter,'havo');
  const defaultCount=chapter==='mix'?16:12;
  const count=Number.isFinite(requestedCount)?requestedCount:defaultCount;
  currentQuestions=shuffle(pool).slice(0,Math.min(count,pool.length));
  currentIndex=0;correctCount=0;answered=false;
  $math('practiceTitle').textContent=generated?`Slimme oefentoets · ${chapter==='mix'?'Alle hoofdstukken':chapterNames[chapter]}`:(chapter==='mix'?'Oefenmix · Alle hoofdstukken':chapterNames[chapter]);
  $math('practiceSubtitle').textContent=`${currentQuestions.length} vragen met variaties in getallen en vraagstellingen. Na elk antwoord krijg je de berekening en uitleg.`;
  $math('resultCard').classList.add('hidden');$math('questionCard').classList.remove('hidden');showMathView('practiceView');renderQuestion();
}
function renderQuestion(){
  const q=currentQuestions[currentIndex];
  answered=false;
  $math('questionCounter').textContent=`Vraag ${currentIndex+1} van ${currentQuestions.length}`;
  $math('chapterLabel').textContent=currentChapter==='mix'?'GEMENGD':`HOOFDSTUK ${currentChapter}`;
  $math('questionProgress').style.width=`${(currentIndex/currentQuestions.length)*100}%`;
  $math('questionText').textContent=q.q;
  $math('feedback').className='hidden';$math('feedback').innerHTML='';
  $math('nextQuestion').disabled=true;$math('nextQuestion').textContent=currentIndex===currentQuestions.length-1?'Bekijk resultaat →':'Volgende vraag →';
  $math('answerList').innerHTML='';
  q.o.forEach((answer,i)=>{
    const btn=document.createElement('button');btn.className='answer';
    const letter=document.createElement('span');letter.className='letter';letter.textContent=String.fromCharCode(65+i);
    const text=document.createElement('span');text.textContent=answer;
    btn.append(letter,text);btn.addEventListener('click',()=>chooseAnswer(i));$math('answerList').appendChild(btn);
  });
}
function chooseAnswer(choice){
  if(answered)return;answered=true;
  const q=currentQuestions[currentIndex];
  const buttons=[...$math('answerList').querySelectorAll('.answer')];
  buttons.forEach((button,index)=>{button.disabled=true;if(index===q.a)button.classList.add('correct');else if(index===choice)button.classList.add('wrong');});
  const good=choice===q.a;if(good)correctCount++;
  const feedback=$math('feedback');feedback.className=`feedback ${good?'good':'bad'}`;
  const heading=document.createElement('strong');heading.textContent=good?'✓ Helemaal goed!':'Nog niet helemaal.';
  const explanation=document.createElement('p');explanation.textContent=q.e;
  feedback.replaceChildren(heading,explanation);
  $math('nextQuestion').disabled=false;$math('questionProgress').style.width=`${((currentIndex+1)/currentQuestions.length)*100}%`;
}
function finishPractice(){
  $math('questionCard').classList.add('hidden');$math('resultCard').classList.remove('hidden');
  const total=currentQuestions.length,pct=Math.round(correctCount/total*100);
  $math('resultScore').textContent=`${correctCount}/${total}`;
  $math('resultTitle').textContent=pct>=80?'Heel sterk gedaan!':pct>=55?'Goed geoefend!':'Blijf oefenen, je komt er!';
  $math('resultMessage').textContent=`Je had ${correctCount} van de ${total} vragen goed (${pct}%). De volgende oefentoets krijgt opnieuw andere getalvarianten.`;
  try{const old=JSON.parse(localStorage.getItem('studyhub-math-progress')||'{"answered":0,"correct":0}');old.answered+=total;old.correct+=correctCount;localStorage.setItem('studyhub-math-progress',JSON.stringify(old));updateProgress();}catch(e){}
}
function updateProgress(){try{const p=JSON.parse(localStorage.getItem('studyhub-math-progress')||'{"answered":0,"correct":0}');$math('progressStat').textContent=`${p.answered||0} vragen`;}catch(e){}}
function toast(message){const el=$math('toast');if(!el)return;el.textContent=message;el.classList.remove('hidden');setTimeout(()=>el.classList.add('hidden'),2600);}
function generateMathMix(){
  const topic=$math('math-mix-topic').value;
  const count=Number.parseInt($math('math-mix-count').value,10)||10;
  const difficulty=$math('math-mix-difficulty')?.value||'havo';
  const chapter=topic==='all'?'mix':Number(topic);
  const pool=buildMathPool(chapter,difficulty);
  if(!pool.length){toast('Voor dit onderwerp zijn nog geen vragen beschikbaar.');return;}
  const button=$math('math-generate-mix'),loading=$math('math-generator-loading');
  button.disabled=true;loading.classList.remove('hidden');
  window.setTimeout(()=>{
    button.disabled=false;loading.classList.add('hidden');
    startPractice(chapter,count,true,pool);
    if(pool.length<count)toast(`Er zijn ${pool.length} passende vragen beschikbaar. Je krijgt ze allemaal.`);
  },250);
}
document.querySelectorAll('#section-math [data-chapter]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();startPractice(Number(button.dataset.chapter));}));
document.querySelectorAll('#section-math [data-view]').forEach(button=>button.addEventListener('click',()=>{
  const target=button.dataset.view;
  if(target==='formulaView')switchTab('math-formulas');
  else if(target==='videosView')switchTab('math-videos');
  else switchTab('math-overview');
}));
$math('mixedPractice').addEventListener('click',()=>switchTab('math-mix'));
$math('math-generate-mix').addEventListener('click',generateMathMix);
$math('backToOverview').addEventListener('click',()=>switchTab('math-overview'));
$math('quitPractice').addEventListener('click',()=>switchTab('math-overview'));
$math('nextQuestion').addEventListener('click',()=>{if(!answered)return;if(currentIndex<currentQuestions.length-1){currentIndex++;renderQuestion();}else finishPractice();});
$math('retryChapter').addEventListener('click',()=>startPractice(currentChapter));
$math('resultOverview').addEventListener('click',()=>switchTab('math-overview'));
updateProgress();
window.showMathView=showMathView;
window.startStudyHubMathPractice=startPractice;
})();

/* ======================================================================
   FIREBASE AUTH + ACCOUNT / INVENTORY / VIP
   ====================================================================== */
const studyHubFirebaseConfig = {
  apiKey: "AIzaSyB1fcdYvQvIksk2zn8-Dhudg4nH2vYFEdo",
  authDomain: "kitacat-studyhub.firebaseapp.com",
  projectId: "kitacat-studyhub",
  storageBucket: "kitacat-studyhub.firebasestorage.app",
  messagingSenderId: "737915107503",
  appId: "1:737915107503:web:473dc775207dfc4349bc5a",
  measurementId: "G-QBRNQQKZ44"
};

// Replace this with the exact public URL Render assigns to the StudyHub API.
// Example: https://studyhub-vip-api.onrender.com
const STUDYHUB_API_BASE_URL = "https://studyhub-vip-api.onrender.com";

const studyHubFirebaseApp = initializeApp(studyHubFirebaseConfig);
const studyHubAuth = getAuth(studyHubFirebaseApp);
const studyHubDb = getFirestore(studyHubFirebaseApp);
const studyHubGoogleProvider = new GoogleAuthProvider();
studyHubGoogleProvider.setCustomParameters({ prompt: "select_account" });

let studyHubUser = null;
let studyHubProfile = null;
let studyHubInventory = [];
let studyHubVipState = null;
let stopProfileListener = null;
let stopInventoryListener = null;
let stopVipListener = null;
let vipTimerHandle = null;
let expiryToastKey = "";
let adminCodeNextCursor = null;
let adminCodeListBusy = false;

const $id = (id) => document.getElementById(id);
const userDocRef = (uid) => doc(studyHubDb, "users", uid);
const inventoryCollectionRef = (uid) => collection(studyHubDb, "users", uid, "inventory");
const vipDocRef = (uid) => doc(studyHubDb, "users", uid, "vip", "current");
const redemptionDocRef = (uid, codeHash) => doc(studyHubDb, "users", uid, "redemptions", codeHash);

function setAuthMessage(message, isError = true) {
  const target = $id("auth-error");
  if (!target) return;
  target.textContent = message || "";
  target.style.color = isError ? "#ff9da9" : "#73ddb8";
}

function setCodeMessage(message, isError = false) {
  const target = $id("redeem-code-message");
  if (!target) return;
  target.textContent = message || "";
  target.classList.toggle("error", isError);
}

function friendlyFirebaseError(error) {
  const code = error?.code || "";
  const messages = {
    "auth/invalid-email": "Dit e-mailadres lijkt niet geldig.",
    "auth/user-not-found": "Geen account gevonden met dit e-mailadres.",
    "auth/wrong-password": "Het wachtwoord klopt niet.",
    "auth/invalid-credential": "E-mailadres of wachtwoord klopt niet.",
    "auth/email-already-in-use": "Er bestaat al een account met dit e-mailadres. Probeer in te loggen.",
    "auth/weak-password": "Kies een sterker wachtwoord van minimaal 6 tekens.",
    "auth/popup-closed-by-user": "Het Google-inlogvenster is gesloten.",
    "auth/popup-blocked": "Je browser blokkeerde het Google-inlogvenster. Probeer het opnieuw.",
    "auth/unauthorized-domain": "Dit domein staat nog niet in Firebase Authentication → Settings → Authorized domains.",
    "auth/operation-not-allowed": "Deze inlogmethode staat nog niet aan. Schakel Google of E-mail/wachtwoord in bij Firebase Authentication.",
    "auth/account-exists-with-different-credential": "Er bestaat al een account met dit e-mailadres via een andere inlogmethode.",
    "auth/too-many-requests": "Te veel pogingen achter elkaar. Probeer het later opnieuw.",
    "auth/network-request-failed": "Geen verbinding. Controleer je internet en probeer opnieuw."
  };
  return messages[code] || error?.message || "Er ging iets mis. Probeer het opnieuw.";
}

function showLoginOverlay() {
  const screen = $id("auth-screen");
  if (!screen) return;
  screen.hidden = false;
  screen.classList.add("auth-overlay");
  setAuthMessage("");
}

function showAppShell(mode) {
  document.body.classList.add("app-ready");
  document.body.classList.toggle("guest-mode", mode === "guest");
  const screen = $id("auth-screen");
  if (screen) {
    screen.hidden = true;
    screen.classList.remove("auth-overlay");
  }
  renderAccountState();
  updateInstallButtonVisibility(window.studyHubCurrentTab || 'home');
}

function continueAsGuest() {
  localStorage.setItem("studyhub-guest-mode", "1");
  studyHubUser = null;
  studyHubProfile = null;
  studyHubInventory = [];
  studyHubVipState = null;
  stopUserListeners();
  showAppShell("guest");
  showToast("Je gebruikt StudyHub als gast. Accountfuncties blijven vergrendeld.");
}

function stopUserListeners() {
  if (stopProfileListener) stopProfileListener();
  if (stopInventoryListener) stopInventoryListener();
  if (stopVipListener) stopVipListener();
  stopProfileListener = stopInventoryListener = stopVipListener = null;
  if (vipTimerHandle) clearInterval(vipTimerHandle);
  vipTimerHandle = null;
}

function makeDefaultUsername(user) {
  const raw = (user.displayName || user.email?.split("@")[0] || "StudyHub leerling").trim();
  return raw.replace(/[<>]/g, "").slice(0, 24) || "StudyHub leerling";
}

async function ensureStudyHubProfile(user) {
  const ref = userDocRef(user.uid);
  await runTransaction(studyHubDb, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists()) {
      transaction.set(ref, {
        username: makeDefaultUsername(user),
        themeMode: "dark",
        vipTheme: "dark-gold",
        goldModeEnabled: false,
        premiumMode: false,
        "Lifetime-VIP": false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  });
}

function startUserListeners(user) {
  stopUserListeners();
  const profileRef = userDocRef(user.uid);
  stopProfileListener = onSnapshot(profileRef, (snapshot) => {
    studyHubProfile = snapshot.exists() ? snapshot.data() : null;
    renderAccountState();
  }, (error) => showToast(`Account laden mislukt: ${friendlyFirebaseError(error)}`));

  stopInventoryListener = onSnapshot(inventoryCollectionRef(user.uid), (snapshot) => {
    studyHubInventory = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderAccountState();
  }, (error) => showToast(`Inventory laden mislukt: ${friendlyFirebaseError(error)}`));

  stopVipListener = onSnapshot(vipDocRef(user.uid), (snapshot) => {
    studyHubVipState = snapshot.exists() ? snapshot.data() : null;
    expiryToastKey = "";
    renderAccountState();
  }, (error) => showToast(`VIP-status laden mislukt: ${friendlyFirebaseError(error)}`));

  if (vipTimerHandle) clearInterval(vipTimerHandle);
  vipTimerHandle = setInterval(refreshVipTimer, 1000);
  refreshStudyHubAdminAccess();
}

function vipLifetime() {
  return studyHubProfile?.["Lifetime-VIP"] === true;
}

function activeVipNow() {
  if (vipLifetime()) return true;
  return studyHubVipState?.status === "active" &&
    studyHubVipState?.expiresAt?.toMillis?.() > Date.now();
}

function vipStillOwned() {
  if (vipLifetime()) return true;
  if (activeVipNow()) return true;
  return studyHubVipState?.status === "paused" && Number(studyHubVipState.remainingSeconds) > 0;
}

function formatStudyHubTime(seconds) {
  const value = Math.max(0, Math.ceil(Number(seconds) || 0));
  const days = Math.floor(value / 86400);
  const hours = Math.floor((value % 86400) / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const secs = value % 60;
  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours || days) parts.push(`${hours}u`);
  if (minutes || hours || days) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);
  return parts.join(" ");
}

function applyStudyHubAppearance() {
  const profile = studyHubProfile || {};
  const lifetime = profile["Lifetime-VIP"] === true;
  const active = lifetime || (
    studyHubVipState?.status === "active" &&
    studyHubVipState?.expiresAt?.toMillis?.() > Date.now()
  );
  const gold = active && profile.goldModeEnabled === true;
  const premium = active && profile.premiumMode === true;
  document.body.classList.toggle("light-theme", !gold && profile.themeMode === "light");
  document.body.classList.toggle("gold-mode", gold);
  document.body.classList.toggle("light-gold-mode", gold && profile.vipTheme === "light-gold");
  document.body.classList.toggle("premium-mode", premium);
  $id("nav-premium")?.classList.toggle("hidden", !premium);
  if (!premium && window.studyHubCurrentTab === "premium") switchTab("home");
  updatePremiumToolsUI();
  const themeColor = $id("theme-color-meta");
  if (themeColor) themeColor.content = gold ? (profile.vipTheme === "light-gold" ? "#f4f0e5" : "#15130e") : (profile.themeMode === "light" ? "#edf2f8" : "#0d1626");
}

function renderAccountState() {
  const loggedIn = Boolean(studyHubUser && studyHubProfile);
  const guestLock = $id("account-guest-lock");
  const content = $id("account-content");
  const accountButton = $id("account-button");

  if (guestLock) guestLock.classList.toggle("hidden", loggedIn);
  if (content) content.classList.toggle("hidden", !loggedIn);
  if (accountButton) {
    accountButton.classList.toggle("locked", !studyHubUser);
    accountButton.textContent = studyHubUser ? `⚙ ${studyHubProfile?.username || "Account"}` : "🔒 Account";
  }

  if (!loggedIn) {
    $id("admin-code-panel")?.classList.add("hidden");
    applyStudyHubAppearance();
    return;
  }

  const profile = studyHubProfile;
  const username = String(profile.username || makeDefaultUsername(studyHubUser));
  $id("account-display-name").textContent = username;
  $id("account-email-label").textContent = studyHubUser.email || "Google-account";
  $id("username-input").value = username;
  $id("account-avatar").textContent = username.slice(0, 1).toUpperCase();
  $id("account-provider").textContent = studyHubUser.providerData.map(p => p.providerId === "google.com" ? "Google" : "E-mail").join(" + ") || "Firebase";
  $id("theme-mode-select").value = profile.themeMode === "light" ? "light" : "dark";

  const lifetime = vipLifetime();
  const owned = vipStillOwned();
  const activeOrLifetime = lifetime || activeVipNow();
  const statusLabel = $id("account-status-label");
  const statusBadge = $id("account-status-badge");
  if (statusLabel) statusLabel.textContent = lifetime ? "Lifetime VIP-account" : (activeOrLifetime ? "VIP is actief" : (owned ? "VIP is gepauzeerd" : "Gratis account"));
  if (statusBadge) {
    statusBadge.textContent = lifetime ? "LIFETIME VIP" : (activeOrLifetime ? "VIP" : (owned ? "VIP PAUSED" : "FREE"));
    statusBadge.className = `tag ${activeOrLifetime || owned ? "tag-amber" : "tag-emerald"}`;
  }
  const inventoryPanel = document.querySelector(".inventory-panel");
  const codePanel = document.querySelector(".codes-panel-card");
  if (inventoryPanel) inventoryPanel.classList.toggle("hidden", lifetime);
  if (codePanel) codePanel.classList.toggle("hidden", lifetime);
  $id("lifetime-inventory-note").classList.toggle("hidden", !lifetime);
  $id("lifetime-code-note").classList.toggle("hidden", !lifetime);
  $id("lifetime-vip-value").textContent = lifetime ? "true" : "false";

  const count = studyHubInventory.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0);
  $id("inventory-count").textContent = `${count} ${count === 1 ? "item" : "items"}`;
  renderInventory();
  renderVipPanel();
  applyStudyHubAppearance();
}

function renderInventory() {
  const container = $id("inventory-list");
  if (!container) return;
  container.replaceChildren();
  const items = studyHubInventory
    .filter(item => item.type === "VIP-Coupon" && Number(item.quantity) > 0)
    .sort((a,b) => Number(a.durationSeconds) - Number(b.durationSeconds));

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "inventory-empty";
    empty.textContent = "Je inventory is nog leeg. Wissel een VIP-code in om een voucher te ontvangen.";
    container.appendChild(empty);
    return;
  }

  for (const item of items) {
    const card = document.createElement("article");
    card.className = "inventory-item";
    const art = document.createElement("div");
    art.className = "voucher-art";
    art.setAttribute("aria-label", "Gouden VIP-voucher");
    art.textContent = "🎟️";
    const copy = document.createElement("div");
    copy.className = "inventory-item-copy";
    const name = document.createElement("strong");
    name.textContent = "VIP-Coupon";
    const detail = document.createElement("small");
    detail.textContent = `${formatStudyHubTime(item.durationSeconds)} · ${item.quantity}×`;
    copy.append(name, detail);
    const useButton = document.createElement("button");
    useButton.type = "button";
    useButton.className = "btn btn-amber";
    useButton.textContent = "Gebruiken";
    useButton.disabled = vipLifetime() || (studyHubVipState && (
      (studyHubVipState.status === "active" && studyHubVipState.expiresAt?.toMillis?.() > Date.now()) ||
      studyHubVipState.status === "paused"
    ));
    useButton.addEventListener("click", () => activateVipCoupon(item.id));
    card.append(art, copy, useButton);
    container.appendChild(card);
  }
}

function renderVipPanel() {
  const panel = $id("vip-panel");
  if (!panel) return;
  const lifetime = vipLifetime();
  const session = studyHubVipState;
  const available = vipStillOwned();
  panel.classList.toggle("hidden", !available);
  $id("vip-timer-row").classList.toggle("hidden", lifetime);
  $id("vip-lifetime-label").classList.toggle("hidden", !lifetime);
  if (!available) return;

  if (lifetime) {
    $id("vip-status-text").textContent = "Lifetime VIP is permanent ingeschakeld.";
    $id("gold-mode-toggle").disabled = false;
    $id("vip-theme-select").disabled = false;
    $id("premium-mode-toggle").disabled = false;
    $id("pause-vip-button").classList.add("hidden");
    $id("resume-vip-button").classList.add("hidden");
  } else if (session?.status === "paused") {
    $id("vip-status-text").textContent = "VIP is gepauzeerd. Je resterende tijd wordt bewaard.";
    $id("vip-time-left").textContent = formatStudyHubTime(session.remainingSeconds);
    $id("gold-mode-toggle").disabled = true;
    $id("vip-theme-select").disabled = true;
    $id("premium-mode-toggle").disabled = true;
    $id("pause-vip-button").classList.add("hidden");
    $id("resume-vip-button").classList.remove("hidden");
  } else {
    $id("vip-status-text").textContent = "VIP is actief. Geniet van je extra thema-opties.";
    $id("gold-mode-toggle").disabled = false;
    $id("vip-theme-select").disabled = false;
    $id("premium-mode-toggle").disabled = false;
    $id("pause-vip-button").classList.remove("hidden");
    $id("resume-vip-button").classList.add("hidden");
    refreshVipTimer();
  }
  $id("gold-mode-toggle").checked = studyHubProfile?.goldModeEnabled === true;
  $id("vip-theme-select").value = studyHubProfile?.vipTheme === "light-gold" ? "light-gold" : "dark-gold";
  $id("premium-mode-toggle").checked = studyHubProfile?.premiumMode === true;
}

async function refreshVipTimer() {
  if (!studyHubUser || vipLifetime() || studyHubVipState?.status !== "active") return;
  const expiry = studyHubVipState.expiresAt?.toMillis?.();
  if (!expiry) return;
  const secondsLeft = Math.ceil((expiry - Date.now()) / 1000);
  if (secondsLeft > 0) {
    const timer = $id("vip-time-left");
    if (timer && !$id("vip-panel").classList.contains("hidden")) timer.textContent = formatStudyHubTime(secondsLeft);
    return;
  }

  const expiredKey = `${studyHubUser.uid}:${studyHubVipState.useId || expiry}`;
  if (expiryToastKey === expiredKey) return;
  expiryToastKey = expiredKey;
  showToast("⏰ Je VIP-Coupon is verlopen! Je normale StudyHub-instellingen zijn hersteld.");
  try {
    await updateDoc(userDocRef(studyHubUser.uid), {
      goldModeEnabled: false,
      premiumMode: false,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.warn("VIP theme reset failed:", error);
  }
  renderAccountState();
}

async function saveStudyHubUsername() {
  if (!studyHubUser) return;
  const input = $id("username-input");
  const username = String(input.value || "").trim();
  if (username.length < 2 || username.length > 24) {
    showToast("Je gebruikersnaam moet 2 tot 24 tekens lang zijn.");
    return;
  }
  if (/[<>]/.test(username)) {
    showToast("Gebruik geen HTML-tekens in je gebruikersnaam.");
    return;
  }
  try {
    await updateDoc(userDocRef(studyHubUser.uid), { username, updatedAt: serverTimestamp() });
    showToast("Gebruikersnaam opgeslagen! ✨");
  } catch (error) {
    showToast(`Opslaan mislukt: ${friendlyFirebaseError(error)}`);
  }
}

async function saveProfilePreference(field, value) {
  if (!studyHubUser || !studyHubProfile) return;
  try {
    const updates = { [field]: value, updatedAt: serverTimestamp() };
    await updateDoc(userDocRef(studyHubUser.uid), updates);
  } catch (error) {
    showToast(`Instelling opslaan mislukt: ${friendlyFirebaseError(error)}`);
    renderAccountState();
  }
}

async function savePremiumExperience(enabled) {
  if (!studyHubUser || !studyHubProfile) return;
  try {
    await updateDoc(userDocRef(studyHubUser.uid), {
      premiumMode: Boolean(enabled),
      updatedAt: serverTimestamp()
    });
    studyHubProfile = { ...studyHubProfile, premiumMode: Boolean(enabled) };
    applyStudyHubAppearance();
    if (enabled) {
      showToast("Premium Study Lab ingeschakeld! Je nieuwe leertools staan klaar. ✦");
      switchTab("premium");
    } else if (window.studyHubCurrentTab === "premium") {
      switchTab("home");
    }
  } catch (error) {
    showToast(`Premium-instelling opslaan mislukt: ${friendlyFirebaseError(error)}`);
    renderAccountState();
  }
}

function sha256Hex(value) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)).then(buffer =>
    [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, "0")).join("")
  );
}

function setAdminCodeMessage(message, isError = false) {
  const target = $id("admin-code-message");
  if (!target) return;
  target.textContent = message || "";
  target.classList.toggle("error", isError);
}

function studyHubApiConfigured() {
  return STUDYHUB_API_BASE_URL &&
    !STUDYHUB_API_BASE_URL.includes("YOUR-RENDER-SERVICE") &&
    /^https:\/\//i.test(STUDYHUB_API_BASE_URL);
}

async function studyHubApiRequest(path, options = {}) {
  if (!studyHubUser) throw new Error("Log eerst in met je StudyHub-account.");
  if (!studyHubApiConfigured()) {
    throw new Error("De Render-backend is nog niet gekoppeld. Vul de Render-URL in bovenaan app.js.");
  }

  const idToken = await studyHubUser.getIdToken();
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${idToken}`);
  if (options.body !== undefined) headers.set("Content-Type", "application/json");

  const response = await fetch(`${STUDYHUB_API_BASE_URL.replace(/\/$/, "")}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store"
  });

  let data = {};
  try { data = await response.json(); } catch { /* non-JSON error response */ }
  if (!response.ok) throw new Error(data.error || `De StudyHub-server gaf fout ${response.status}.`);
  return data;
}

async function refreshStudyHubAdminAccess() {
  const panel = $id("admin-code-panel");
  if (!panel) return;
  panel.classList.add("hidden");
  if (!studyHubUser || !studyHubProfile || !studyHubApiConfigured()) return;
  try {
    const result = await studyHubApiRequest("/api/admin/status");
    panel.classList.toggle("hidden", result.isAdmin !== true);
    if (result.isAdmin === true) {
      await refreshAdminVipCodeList({ reset: true });
    }
  } catch (error) {
    // A temporarily sleeping Render Free service must not reveal admin controls.
    console.info("StudyHub admin status not available yet:", error.message);
  }
}

async function createAdminVipCode() {
  const button = $id("admin-create-code");
  const resultPanel = $id("admin-code-result");
  if (!button) return;
  const durationSeconds = Number($id("admin-code-duration")?.value || 0);
  const usageScope = $id("admin-code-usage-scope")?.value || "per_user";

  button.disabled = true;
  setAdminCodeMessage("VIP-code veilig aanmaken…", false);
  if (resultPanel) resultPanel.classList.add("hidden");
  try {
    const result = await studyHubApiRequest("/api/admin/codes", {
      method: "POST",
      body: { durationSeconds, usageScope }
    });
    $id("admin-code-value").value = result.code;
    resultPanel?.classList.remove("hidden");
    setAdminCodeMessage("Code aangemaakt! Kopieer hem nu; de volledige code wordt maar één keer getoond.", false);
    await refreshAdminVipCodeList({ reset: true });
  } catch (error) {
    setAdminCodeMessage(error.message || "VIP-code maken is mislukt.", true);
  } finally {
    button.disabled = false;
  }
}

async function copyAdminVipCode() {
  const field = $id("admin-code-value");
  if (!field?.value) return;
  try {
    await navigator.clipboard.writeText(field.value);
    setAdminCodeMessage("VIP-code gekopieerd!", false);
  } catch {
    field.focus();
    field.select();
    setAdminCodeMessage("Selecteer en kopieer de code handmatig.", true);
  }
}


function formatAdminCodeDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium", timeStyle: "short"
  }).format(date);
}

function adminCodeStatusLabel(status) {
  return status === "active" ? "ACTIEF" : "INACTIEF";
}

function buildAdminCodeCard(code) {
  const card = document.createElement("article");
  card.className = `admin-code-item status-${code.status || "inactive"}`;
  card.dataset.codeId = code.id || "";
  card.dataset.usageScope = code.usageScope === "global" ? "global" : "per_user";

  const top = document.createElement("div");
  top.className = "admin-code-item-top";
  const reference = document.createElement("strong");
  reference.className = "admin-code-reference";
  reference.textContent = `CODE · …${code.reference || String(code.id || "").slice(-8).toUpperCase()}`;

  const status = document.createElement("span");
  status.className = `admin-code-status status-${code.status || "inactive"}`;
  status.textContent = adminCodeStatusLabel(code.status);
  top.append(reference, status);

  const reward = document.createElement("p");
  reward.className = "admin-code-description";
  reward.textContent = `REWARD: ${code.reward || `VIP-Coupon · ${formatStudyHubTime(code.durationSeconds || 0)}`}`;

  const usage = document.createElement("p");
  usage.className = "admin-code-usage-scope";
  usage.textContent = code.usageScope === "global" ? "GEBRUIK: GLOBAAL · 1× TOTAAL" : "GEBRUIK: PER PERSOON · 1× ELKE GEBRUIKER";

  const actions = document.createElement("div");
  actions.className = "admin-code-actions";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "btn btn-secondary";
  toggle.textContent = code.active ? "Maak INACTIEF" : "Maak ACTIEF";
  toggle.addEventListener("click", () => updateAdminVipCode(code.id, !code.active));

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "btn btn-danger-soft";
  remove.textContent = "Verwijderen";
  remove.addEventListener("click", () => deleteAdminVipCode(code));
  actions.append(toggle, remove);

  card.append(top, reward, usage, actions);
  return card;
}

async function refreshAdminVipCodeList({ reset = false } = {}) {
  const list = $id("admin-code-list");
  const moreButton = $id("admin-load-more-codes");
  if (!list || adminCodeListBusy) return;
  if (reset) {
    adminCodeNextCursor = null;
    list.innerHTML = "";
    list.append(Object.assign(document.createElement("p"), {
      className: "muted-note", textContent: "VIP-codes laden…"
    }));
  }

  adminCodeListBusy = true;
  const refreshButton = $id("admin-refresh-codes");
  if (refreshButton) refreshButton.disabled = true;
  if (moreButton) moreButton.disabled = true;
  try {
    const params = new URLSearchParams({ limit: "50" });
    if (!reset && adminCodeNextCursor) params.set("cursor", adminCodeNextCursor);
    const response = await studyHubApiRequest(`/api/admin/codes?${params.toString()}`);
    if (reset) list.innerHTML = "";

    if (reset && response.codes.length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted-note";
      empty.textContent = "Je hebt nog geen VIP-codes aangemaakt.";
      list.append(empty);
    } else {
      response.codes.forEach(code => list.append(buildAdminCodeCard(code)));
    }

    adminCodeNextCursor = response.nextCursor || null;
    if (moreButton) {
      moreButton.classList.toggle("hidden", !response.hasMore);
      moreButton.disabled = false;
    }
  } catch (error) {
    if (reset) list.innerHTML = "";
    const message = document.createElement("p");
    message.className = "account-feedback error";
    message.textContent = error.message || "Het code-overzicht kon niet worden geladen.";
    list.append(message);
    if (moreButton) moreButton.classList.add("hidden");
  } finally {
    adminCodeListBusy = false;
    if (refreshButton) refreshButton.disabled = false;
    if (moreButton) moreButton.disabled = false;
  }
}

async function updateAdminVipCode(codeId, active) {
  const codeCard = [...document.querySelectorAll(".admin-code-item")].find(card => card.dataset.codeId === codeId);
  const scope = codeCard?.dataset.usageScope || "per_user";
  const resetExplanation = scope === "global"
    ? "De globale eenmalige limiet wordt gereset; de eerste gebruiker kan hem opnieuw één keer totaal inwisselen."
    : "Iedere gebruiker kan hem opnieuw één keer inwisselen, ook als die persoon hem eerder al gebruikte.";
  const message = active
    ? `Deze code wordt opnieuw ACTIEF. ${resetExplanation} Doorgaan?`
    : "Deze code wordt INACTIEF en kan niet meer worden ingewisseld. Eerder ontvangen vouchers blijven bestaan. Doorgaan?";
  if (!window.confirm(message)) return;
  try {
    const result = await studyHubApiRequest(`/api/admin/codes/${encodeURIComponent(codeId)}`, {
      method: "PATCH",
      body: { active }
    });
    setAdminCodeMessage(result.message || (active ? "Code ACTIEF." : "Code INACTIEF."), false);
    await refreshAdminVipCodeList({ reset: true });
  } catch (error) {
    setAdminCodeMessage(error.message || "De code kon niet worden bijgewerkt.", true);
  }
}

async function deleteAdminVipCode(code) {
  const reference = code.reference || String(code.id || "").slice(-8).toUpperCase();
  const warning = "\n\nDe code wordt definitief verwijderd. Reeds ontvangen vouchers blijven in gebruikersinventories staan.";
  if (!window.confirm(`Code …${reference} definitief verwijderen?${warning}`)) return;
  try {
    await studyHubApiRequest(`/api/admin/codes/${encodeURIComponent(code.id)}`, { method: "DELETE" });
    setAdminCodeMessage("Code definitief verwijderd.", false);
    await refreshAdminVipCodeList({ reset: true });
  } catch (error) {
    setAdminCodeMessage(error.message || "De code kon niet worden verwijderd.", true);
  }
}

async function redeemStudyHubCode() {
  if (!studyHubUser || !studyHubProfile) return;
  if (vipLifetime()) {
    setCodeMessage("Lifetime VIP-accounts kunnen geen coupons via codes ontvangen.", true);
    return;
  }
  const field = $id("redeem-code-input");
  const code = String(field?.value || "").trim().toUpperCase().replace(/\s+/g, "");
  if (code.length < 12) {
    setCodeMessage("Deze code lijkt te kort. Controleer of je de volledige code hebt ingevuld.", true);
    return;
  }

  const button = $id("redeem-code-button");
  if (button) button.disabled = true;
  setCodeMessage("Code veilig controleren…", false);
  try {
    const result = await studyHubApiRequest("/api/redeem", {
      method: "POST",
      body: { code }
    });
    field.value = "";
    setCodeMessage(result.message || "Gelukt! Je VIP-Coupon is toegevoegd aan je inventory. ✨", false);
    showToast("VIP-Coupon ontvangen! 🎟️");
  } catch (error) {
    console.error("Code redemption failed:", error);
    setCodeMessage(error.message || "De code kon niet worden ingewisseld.", true);
  } finally {
    if (button) button.disabled = false;
  }
}

async function activateVipCoupon(itemId) {
  if (!studyHubUser || vipLifetime()) return;
  const inventoryRef = doc(studyHubDb, "users", studyHubUser.uid, "inventory", itemId);
  const vipRef = vipDocRef(studyHubUser.uid);
  const useId = crypto.randomUUID();
  try {
    await runTransaction(studyHubDb, async (transaction) => {
      const [profileSnap, itemSnap, vipSnap] = await Promise.all([
        transaction.get(userDocRef(studyHubUser.uid)), transaction.get(inventoryRef), transaction.get(vipRef)
      ]);
      if (!profileSnap.exists() || profileSnap.data()["Lifetime-VIP"] === true) throw new Error("Deze coupon kan niet op dit account worden gebruikt.");
      if (!itemSnap.exists() || Number(itemSnap.data().quantity) < 1) throw new Error("Je hebt geen coupon van deze duur meer.");
      const oldVip = vipSnap.exists() ? vipSnap.data() : null;
      if (oldVip && oldVip.status === "paused" && Number(oldVip.remainingSeconds) > 0) throw new Error("Hervat eerst je gepauzeerde VIP-tijd.");
      if (oldVip && oldVip.status === "active" && oldVip.expiresAt?.toMillis?.() > Date.now()) throw new Error("Er loopt al VIP-tijd. Pauzeer of wacht tot deze verloopt.");

      const item = itemSnap.data();
      const durationSeconds = Number(item.durationSeconds);
      if (!Number.isInteger(durationSeconds) || durationSeconds < 1) throw new Error("Deze coupon bevat een ongeldige tijdsduur.");
      const expiresAt = Timestamp.fromMillis(Date.now() + durationSeconds * 1000);
      transaction.update(inventoryRef, {
        quantity: Number(item.quantity) - 1,
        lastUseId: useId
      });
      transaction.set(vipRef, {
        status: "active",
        durationSeconds,
        remainingSeconds: 0,
        expiresAt,
        startedAt: serverTimestamp(),
        sourceItemId: itemId,
        useId,
        updatedAt: serverTimestamp()
      });
    });
    showToast("VIP-Coupon geactiveerd! Je VIP-tijd loopt nu. ✨");
  } catch (error) {
    showToast(error.message || friendlyFirebaseError(error));
  } finally {
    renderInventory();
  }
}

async function pauseVipTimer() {
  if (!studyHubUser || vipLifetime()) return;
  const ref = vipDocRef(studyHubUser.uid);
  try {
    await runTransaction(studyHubDb, async (transaction) => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists()) throw new Error("Er is geen actieve VIP-sessie.");
      const session = snapshot.data();
      if (session.status !== "active" || !session.expiresAt?.toMillis) throw new Error("Er loopt geen actieve VIP-timer.");
      const remaining = Math.max(0, Math.floor((session.expiresAt.toMillis() - Date.now()) / 1000) - 1);
      if (remaining < 1) throw new Error("Je VIP-tijd is al afgelopen.");
      transaction.update(ref, {
        status: "paused",
        remainingSeconds: remaining,
        expiresAt: null,
        updatedAt: serverTimestamp()
      });
    });
    await saveProfilePreference("goldModeEnabled", false);
    await saveProfilePreference("premiumMode", false);
    showToast("VIP gestopt. Je resterende tijd is bewaard. ⏸");
  } catch (error) {
    showToast(error.message || friendlyFirebaseError(error));
  }
}

async function resumeVipTimer() {
  if (!studyHubUser || vipLifetime()) return;
  const ref = vipDocRef(studyHubUser.uid);
  try {
    await runTransaction(studyHubDb, async (transaction) => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists()) throw new Error("Er is geen gepauzeerde VIP-sessie.");
      const session = snapshot.data();
      const remaining = Number(session.remainingSeconds);
      if (session.status !== "paused" || !Number.isInteger(remaining) || remaining < 1) throw new Error("Er is geen VIP-tijd om te hervatten.");
      transaction.update(ref, {
        status: "active",
        expiresAt: Timestamp.fromMillis(Date.now() + remaining * 1000),
        startedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });
    showToast("VIP is hervat! De timer loopt weer. ▶");
  } catch (error) {
    showToast(error.message || friendlyFirebaseError(error));
  }
}

async function handleEmailSignIn(createAccount) {
  const email = String($id("auth-email").value || "").trim();
  const password = String($id("auth-password").value || "");
  if (!email || !password) {
    setAuthMessage("Vul je e-mailadres en wachtwoord in.");
    return;
  }
  try {
    setAuthMessage(createAccount ? "Account wordt aangemaakt…" : "Je wordt ingelogd…", false);
    await setPersistence(studyHubAuth, browserLocalPersistence);
    if (createAccount) await createUserWithEmailAndPassword(studyHubAuth, email, password);
    else await signInWithEmailAndPassword(studyHubAuth, email, password);
    setAuthMessage("Gelukt! Je wordt doorgestuurd…", false);
  } catch (error) {
    setAuthMessage(friendlyFirebaseError(error));
  }
}

async function handleGoogleSignIn() {
  try {
    setAuthMessage("Google-inloggen wordt geopend…", false);
    await setPersistence(studyHubAuth, browserLocalPersistence);
    const mobileBrowser = /iphone|ipad|ipod|android/i.test(navigator.userAgent || "");
    if (mobileBrowser) {
      await signInWithRedirect(studyHubAuth, studyHubGoogleProvider);
      return;
    }
    await signInWithPopup(studyHubAuth, studyHubGoogleProvider);
  } catch (error) {
    if (error?.code === "auth/popup-blocked") {
      try {
        await signInWithRedirect(studyHubAuth, studyHubGoogleProvider);
        return;
      } catch (redirectError) {
        setAuthMessage(friendlyFirebaseError(redirectError));
        return;
      }
    }
    setAuthMessage(friendlyFirebaseError(error));
  }
}

async function handlePasswordReset() {
  const email = String($id("auth-email").value || "").trim();
  if (!email) {
    setAuthMessage("Vul eerst je e-mailadres in.");
    return;
  }
  try {
    await sendPasswordResetEmail(studyHubAuth, email);
    setAuthMessage("Als dit e-mailadres een account heeft, is een resetmail verstuurd.", false);
  } catch (error) {
    setAuthMessage(friendlyFirebaseError(error));
  }
}

function openCodePanel() {
  const panel = $id("code-entry-panel");
  const button = $id("toggle-code-panel");
  const open = panel.classList.contains("hidden");
  panel.classList.toggle("hidden", !open);
  button.setAttribute("aria-expanded", String(open));
  button.textContent = open ? "Code verbergen" : "Code invoeren";
}

/* ======================================================================
   PREMIUM STUDY LAB — local focus tools and subject shortcuts
   ====================================================================== */
let premiumFocusInterval = null;
let premiumFocusDurationSeconds = 25 * 60;
let premiumFocusRemainingSeconds = 25 * 60;
let premiumFocusEndsAt = 0;
let premiumFocusSessionStartRemaining = 0;
let premiumFocusSessionRecorded = 0;

function premiumTodayKey() {
  const date = new Date();
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return `studyhub-premium-focus-${studyHubUser?.uid || "guest"}-${dateKey}`;
}

function premiumGoalKey() {
  return `studyhub-premium-goal-${studyHubUser?.uid || "guest"}`;
}

function readPremiumTodaySeconds() {
  try {
    const value = Number(localStorage.getItem(premiumTodayKey()) || 0);
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  } catch { return 0; }
}

function recordPremiumFocusSeconds(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  try {
    const next = readPremiumTodaySeconds() + Math.floor(seconds);
    localStorage.setItem(premiumTodayKey(), String(next));
  } catch { /* Private browsing can block local storage; the timer still works. */ }
  updatePremiumToolsUI();
}

function formatPremiumClock(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function premiumFocusTick() {
  if (!premiumFocusInterval) return;
  const now = Date.now();
  premiumFocusRemainingSeconds = Math.max(0, Math.ceil((premiumFocusEndsAt - now) / 1000));
  const elapsed = Math.max(0, premiumFocusSessionStartRemaining - premiumFocusRemainingSeconds);
  const unrecorded = elapsed - premiumFocusSessionRecorded;
  if (unrecorded > 0) {
    recordPremiumFocusSeconds(unrecorded);
    premiumFocusSessionRecorded = elapsed;
  }
  updatePremiumToolsUI();
  if (premiumFocusRemainingSeconds <= 0) {
    clearInterval(premiumFocusInterval);
    premiumFocusInterval = null;
    const status = $id("premium-focus-status");
    if (status) status.textContent = "Focusblok afgerond! Neem even pauze en geef jezelf een moment. ✨";
    showToast("Focus Sprint voltooid! Goed bezig. 🎉");
    const startButton = $id("premium-focus-start");
    if (startButton) startButton.textContent = "Opnieuw starten";
    updatePremiumToolsUI();
  }
}

function startPremiumFocus() {
  if (!document.body.classList.contains("premium-mode")) {
    showToast("Schakel Premium Experience in via Account → VIP-menu.");
    return;
  }
  if (premiumFocusInterval) return;
  if (premiumFocusRemainingSeconds <= 0) {
    premiumFocusRemainingSeconds = premiumFocusDurationSeconds;
  }
  premiumFocusSessionStartRemaining = premiumFocusRemainingSeconds;
  premiumFocusSessionRecorded = 0;
  premiumFocusEndsAt = Date.now() + premiumFocusRemainingSeconds * 1000;
  const status = $id("premium-focus-status");
  if (status) status.textContent = "Focus staat aan. Je minuten worden automatisch bijgehouden.";
  const button = $id("premium-focus-start");
  if (button) button.textContent = "Bezig…";
  premiumFocusInterval = window.setInterval(premiumFocusTick, 250);
  premiumFocusTick();
}

function pausePremiumFocus() {
  if (!premiumFocusInterval) return;
  premiumFocusTick();
  if (premiumFocusInterval) {
    clearInterval(premiumFocusInterval);
    premiumFocusInterval = null;
  }
  const status = $id("premium-focus-status");
  if (status) status.textContent = "Focus gepauzeerd. Je resterende tijd is bewaard.";
  const button = $id("premium-focus-start");
  if (button) button.textContent = "Verdergaan";
  updatePremiumToolsUI();
}

function resetPremiumFocus() {
  pausePremiumFocus();
  const preset = Number($id("premium-focus-preset")?.value || 25);
  premiumFocusDurationSeconds = Math.max(5, Math.min(90, preset)) * 60;
  premiumFocusRemainingSeconds = premiumFocusDurationSeconds;
  premiumFocusSessionStartRemaining = premiumFocusDurationSeconds;
  premiumFocusSessionRecorded = 0;
  const status = $id("premium-focus-status");
  if (status) status.textContent = "Nieuwe focusduur ingesteld. Je bent er klaar voor!";
  const button = $id("premium-focus-start");
  if (button) button.textContent = "Start";
  updatePremiumToolsUI();
}

function updatePremiumToolsUI() {
  const clock = $id("premium-focus-clock");
  if (!clock) return;
  if (!premiumFocusInterval && premiumFocusRemainingSeconds === 25 * 60 && $id("premium-focus-preset")) {
    const preset = Number($id("premium-focus-preset").value || 25) * 60;
    if (premiumFocusDurationSeconds !== preset) {
      premiumFocusDurationSeconds = preset;
      premiumFocusRemainingSeconds = preset;
    }
  }
  clock.textContent = formatPremiumClock(premiumFocusRemainingSeconds);
  const progress = $id("premium-focus-progress");
  const percent = premiumFocusDurationSeconds > 0 ? ((premiumFocusDurationSeconds - premiumFocusRemainingSeconds) / premiumFocusDurationSeconds) * 100 : 0;
  if (progress) progress.style.width = `${Math.max(0, Math.min(100, percent))}%`;

  const todaySeconds = readPremiumTodaySeconds();
  const minutes = Math.floor(todaySeconds / 60);
  const goalSelect = $id("premium-daily-goal");
  if (goalSelect) {
    const savedGoal = Number(localStorage.getItem(premiumGoalKey()) || goalSelect.value || 30);
    if ([15, 30, 45, 60, 90].includes(savedGoal)) goalSelect.value = String(savedGoal);
  }
  const goal = Number(goalSelect?.value || 30);
  const todayMinutes = $id("premium-today-minutes");
  if (todayMinutes) todayMinutes.textContent = String(minutes);
  const goalProgress = $id("premium-goal-progress");
  if (goalProgress) goalProgress.style.width = `${Math.min(100, goal ? (minutes / goal) * 100 : 0)}%`;
  const goalStatus = $id("premium-goal-status");
  if (goalStatus) goalStatus.textContent = minutes >= goal
    ? `Doel behaald! Je hebt vandaag ${minutes} van ${goal} minuten gefocust. 🏆`
    : `Nog ${Math.max(0, goal - minutes)} minuten tot je doel van ${goal} minuten.`;
}

function launchPremiumRandomChallenge() {
  if (!document.body.classList.contains("premium-mode")) return;
  const requested = $id("premium-challenge-subject")?.value || "random";
  const subject = requested === "random" ? (Math.random() < 0.5 ? "geo" : "math") : requested;
  if (subject === "math") {
    switchTab("math-mix");
    const topic = ["all", "1", "3", "4", "6"][Math.floor(Math.random() * 5)];
    if ($id("math-mix-topic")) $id("math-mix-topic").value = topic;
    if ($id("math-mix-count")) $id("math-mix-count").value = "6";
    if ($id("math-mix-difficulty")) $id("math-mix-difficulty").value = "havo";
    window.setTimeout(() => $id("math-generate-mix")?.click(), 80);
    return;
  }

  openSubjectCard("aardrijkskunde");
  const topicSelect = $id("gen-topic");
  if (topicSelect) {
    const choices = [...topicSelect.options].filter(option => option.value && !/Heel Hoofdstuk|Compleet/i.test(option.textContent));
    if (choices.length) topicSelect.value = choices[Math.floor(Math.random() * choices.length)].value;
  }
  if ($id("gen-count")) $id("gen-count").value = "6";
  if ($id("gen-difficulty")) $id("gen-difficulty").value = "Havo / Vwo onderbouw";
  window.setTimeout(() => {
    switchTab("generator");
    $id("btn-generate-mix")?.click();
  }, 80);
}

function initialisePremiumTools() {
  const preset = $id("premium-focus-preset");
  const goal = $id("premium-daily-goal");
  if (preset) preset.addEventListener("change", resetPremiumFocus);
  if (goal) {
    try {
      const saved = Number(localStorage.getItem(premiumGoalKey()) || 30);
      if ([15, 30, 45, 60, 90].includes(saved)) goal.value = String(saved);
    } catch { /* keep default */ }
    goal.addEventListener("change", () => {
      try { localStorage.setItem(premiumGoalKey(), goal.value); } catch { /* optional preference */ }
      updatePremiumToolsUI();
    });
  }
  $id("premium-focus-start")?.addEventListener("click", startPremiumFocus);
  $id("premium-focus-pause")?.addEventListener("click", pausePremiumFocus);
  $id("premium-focus-reset")?.addEventListener("click", resetPremiumFocus);
  $id("premium-random-challenge")?.addEventListener("click", launchPremiumRandomChallenge);
  $id("premium-open-geo-summary")?.addEventListener("click", () => {
    openSubjectCard("aardrijkskunde");
    switchTab("summary");
  });
  $id("premium-open-math-formulas")?.addEventListener("click", () => switchTab("math-formulas"));
  updatePremiumToolsUI();
}

function initialiseStudyHubAccounts() {
  // Restore local auth persistence before showing the first-run choice.
  setPersistence(studyHubAuth, browserLocalPersistence).catch(console.warn);
  window.studyHubCurrentTab = "home";

  $id("continue-guest")?.addEventListener("click", continueAsGuest);
  $id("sign-in-from-account")?.addEventListener("click", showLoginOverlay);
  $id("google-signin")?.addEventListener("click", handleGoogleSignIn);
  $id("email-signin")?.addEventListener("click", () => handleEmailSignIn(false));
  $id("email-create")?.addEventListener("click", () => handleEmailSignIn(true));
  $id("forgot-password")?.addEventListener("click", handlePasswordReset);
  $id("email-auth-form")?.addEventListener("submit", (event) => { event.preventDefault(); handleEmailSignIn(false); });

  $id("account-button")?.addEventListener("click", () => switchTab("account"));
  $id("account-back")?.addEventListener("click", () => switchTab(window.studyHubReturnTab || "home"));
  $id("sign-out")?.addEventListener("click", async () => {
    try {
      localStorage.removeItem("studyhub-guest-mode");
      await signOut(studyHubAuth);
    } catch (error) {
      showToast(friendlyFirebaseError(error));
    }
  });
  $id("save-username")?.addEventListener("click", saveStudyHubUsername);
  $id("theme-mode-select")?.addEventListener("change", (event) => saveProfilePreference("themeMode", event.target.value));
  $id("toggle-code-panel")?.addEventListener("click", openCodePanel);
  $id("redeem-code-button")?.addEventListener("click", redeemStudyHubCode);
  $id("admin-create-code")?.addEventListener("click", createAdminVipCode);
  $id("admin-copy-code")?.addEventListener("click", copyAdminVipCode);
  $id("admin-refresh-codes")?.addEventListener("click", () => refreshAdminVipCodeList({ reset: true }));
  $id("admin-load-more-codes")?.addEventListener("click", () => refreshAdminVipCodeList({ reset: false }));
  $id("redeem-code-input")?.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); redeemStudyHubCode(); } });
  $id("gold-mode-toggle")?.addEventListener("change", (event) => saveProfilePreference("goldModeEnabled", event.target.checked));
  $id("vip-theme-select")?.addEventListener("change", (event) => saveProfilePreference("vipTheme", event.target.value));
  $id("premium-mode-toggle")?.addEventListener("change", (event) => savePremiumExperience(event.target.checked));
  initialisePremiumTools();
  $id("pause-vip-button")?.addEventListener("click", pauseVipTimer);
  $id("resume-vip-button")?.addEventListener("click", resumeVipTimer);

  onAuthStateChanged(studyHubAuth, async (user) => {
    if (user) {
      studyHubUser = user;
      localStorage.removeItem("studyhub-guest-mode");
      try {
        await ensureStudyHubProfile(user);
        startUserListeners(user);
        showAppShell("user");
      } catch (error) {
        console.error("StudyHub profile initialisation failed:", error);
        setAuthMessage(`Inloggen lukte, maar je profiel kon niet worden geladen: ${friendlyFirebaseError(error)}`);
        showAppShell("user");
      }
    } else {
      studyHubUser = null;
      studyHubProfile = null;
      studyHubInventory = [];
      studyHubVipState = null;
      stopUserListeners();
      $id("admin-code-panel")?.classList.add("hidden");
      if (localStorage.getItem("studyhub-guest-mode") === "1") {
        showAppShell("guest");
      } else {
        document.body.classList.remove("app-ready", "guest-mode", "light-theme", "gold-mode", "light-gold-mode", "premium-mode");
        const screen = $id("auth-screen");
        if (screen) { screen.hidden = false; screen.classList.remove("auth-overlay"); }
        renderAccountState();
      }
    }
  });

  getRedirectResult(studyHubAuth).catch((error) => {
    if (error?.code && error.code !== "auth/no-auth-event") setAuthMessage(friendlyFirebaseError(error));
  });
}

document.addEventListener("DOMContentLoaded", initialiseStudyHubAccounts, { once: true });
