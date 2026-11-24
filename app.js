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
           3. TAB NAVIGATION
           ========================================================================== */
        function switchTab(tabName) {
            const isMathTab = tabName.startsWith('math-');

            if (tabName === 'home') {
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

            const sections = ['home', 'tests', 'generator', 'quiz', 'grading', 'results', 'learn', 'summary', 'math'];
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
                    'math-formulas': 'formulaView',
                    'math-videos': 'videosView'
                };
                if (typeof window.showMathView === 'function') window.showMathView(mathViews[tabName] || 'overviewView');
            } else {
                const target = document.getElementById(`section-${tabName}`);
                if (target) target.classList.remove('hidden');
            }

            document.querySelectorAll('.nav-tab-btn').forEach(btn => {
                const active = isMathTab ? btn.getAttribute('data-tab') === 'math-overview' : btn.getAttribute('data-tab') === tabName;
                btn.classList.toggle('active', active);
            });

            if (tabName === 'learn') renderFlashcards();
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

        function gradeWithFallback(q, studentAnswer) {
            const lower = studentAnswer.toLocaleLowerCase('nl-NL');
            const kws = q.keywords || [];
            const matched = kws.filter(k => lower.includes(k.toLocaleLowerCase('nl-NL')));
            const ratio = kws.length ? matched.length / kws.length : (studentAnswer.trim().length >= 35 ? 1 : 0);
            let pts = 0;

            if (ratio >= 0.7) pts = q.points;
            else if (ratio >= 0.3) pts = Math.max(1, Math.floor(q.points / 2));

            let fb;
            if (pts === q.points) {
                fb = `Je noemt veel belangrijke kernbegrippen (${matched.join(', ')}). Lees het modelantwoord nog even na om te controleren of je uitleg compleet is.`;
            } else if (pts > 0) {
                fb = `Je noemt al een deel van de kernbegrippen (${matched.join(', ')}). Vergelijk je uitleg met het modelantwoord en vul ontbrekende stappen aan.`;
            } else {
                fb = 'Ik herken nog te weinig kernbegrippen in je antwoord. Gebruik het modelantwoord om te zien welke onderdelen ontbreken.';
            }
            return { points: pts, feedback: fb };
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

        function generatePracticeMix() {
            const topicIndex = document.getElementById('gen-topic')?.selectedIndex ?? 0;
            const count = Number.parseInt(document.getElementById('gen-count')?.value || '10', 10);
            const questionType = document.getElementById('gen-type')?.value || 'mixed';
            const topicParas = { 1: ['1.1'], 2: ['1.2'], 3: ['1.3'], 4: ['1.4'], 5: ['Kaart'] };

            let pool = prebuiltTests.flatMap(test => test.questions);
            if (topicParas[topicIndex]) {
                pool = pool.filter(q => topicParas[topicIndex].includes(q.para));
            }
            if (questionType === 'mc' || questionType === 'open') {
                const typedPool = pool.filter(q => q.type === questionType);
                if (typedPool.length) pool = typedPool;
            }

            if (!pool.length) {
                showToast('Voor deze selectie zijn nog geen vragen beschikbaar. Kies een ander onderwerp.');
                return;
            }

            const selected = shuffleArray(pool).slice(0, Math.min(count, pool.length));
            activeQuizQuestions = selected.map(q => ({ ...q }));
            const topicNames = ['heel hoofdstuk 1', 'paragraaf 1.1', 'paragraaf 1.2', 'paragraaf 1.3', 'paragraaf 1.4', 'kaartvaardigheden'];
            activeQuizTitle = `Oefenmix: ${topicNames[topicIndex] || 'aardrijkskunde'} (${selected.length} vragen)`;

            if (selected.length < count) {
                showToast(`Er zijn ${selected.length} passende vragen in de vragenbank. Je oefenmix bevat ze allemaal.`);
            }
            initQuizEngine();
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
function showMathView(id){['overviewView','practiceView','formulaView','videosView'].forEach(v=>$math(v).classList.toggle('hidden',v!==id));window.scrollTo({top:0,behavior:'smooth'});}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function startPractice(chapter){currentChapter=chapter;currentQuestions=chapter==='mix'?shuffle(Object.values(bank).flat()).slice(0,12):shuffle(bank[chapter]);currentIndex=0;correctCount=0;answered=false;$math('practiceTitle').textContent=chapter==='mix'?'Oefenmix · Alle hoofdstukken':chapterNames[chapter];$math('practiceSubtitle').textContent=chapter==='mix'?'Een mix van vragen uit H1, H3, H4 en H6.':'Neem rustig de tijd. Na elk antwoord zie je meteen de uitleg.';$math('resultCard').classList.add('hidden');$math('questionCard').classList.remove('hidden');showMathView('practiceView');renderQuestion();}
function renderQuestion(){const q=currentQuestions[currentIndex];answered=false;$math('questionCounter').textContent=`Vraag ${currentIndex+1} van ${currentQuestions.length}`;$math('chapterLabel').textContent=currentChapter==='mix'?'GEMENGD':`HOOFDSTUK ${currentChapter}`;$math('questionProgress').style.width=`${(currentIndex/currentQuestions.length)*100}%`;$math('questionText').textContent=q.q;$math('feedback').className='hidden';$math('feedback').innerHTML='';$math('nextQuestion').disabled=true;$math('nextQuestion').textContent=currentIndex===currentQuestions.length-1?'Bekijk resultaat →':'Volgende vraag →';$math('answerList').innerHTML='';q.o.forEach((answer,i)=>{const btn=document.createElement('button');btn.className='answer';btn.innerHTML=`<span class="letter">${String.fromCharCode(65+i)}</span><span>${answer}</span>`;btn.addEventListener('click',()=>chooseAnswer(i));$math('answerList').appendChild(btn);});}
function chooseAnswer(choice){if(answered)return;answered=true;const q=currentQuestions[currentIndex];const buttons=[...$math('answerList').querySelectorAll('.answer')];buttons.forEach((b,i)=>{b.disabled=true;if(i===q.a)b.classList.add('correct');else if(i===choice)b.classList.add('wrong');});const good=choice===q.a;if(good)correctCount++;const f=$math('feedback');f.className=`feedback ${good?'good':'bad'}`;f.innerHTML=`<strong>${good?'✓ Helemaal goed!':'Nog niet helemaal.'}</strong>${q.e}`;$math('nextQuestion').disabled=false;$math('questionProgress').style.width=`${((currentIndex+1)/currentQuestions.length)*100}%`;}
function finishPractice(){ $math('questionCard').classList.add('hidden');$math('resultCard').classList.remove('hidden');const total=currentQuestions.length,pct=Math.round(correctCount/total*100);$math('resultScore').textContent=`${correctCount}/${total}`;$math('resultTitle').textContent=pct>=80?'Heel sterk gedaan!':pct>=55?'Goed geoefend!':'Blijf oefenen, je komt er!';$math('resultMessage').textContent=`Je had ${correctCount} van de ${total} vragen goed (${pct}%). Bekijk de uitleg bij vragen die lastig waren en probeer het daarna nog eens.`;try{const old=JSON.parse(localStorage.getItem('studyhub-math-progress')||'{"answered":0,"correct":0}');old.answered+=total;old.correct+=correctCount;localStorage.setItem('studyhub-math-progress',JSON.stringify(old));updateProgress();}catch(e){}}
function updateProgress(){try{const p=JSON.parse(localStorage.getItem('studyhub-math-progress')||'{"answered":0,"correct":0}');$math('progressStat').textContent=`${p.answered||0} vragen`;}catch(e){}}
function toast(msg){$math('toast').textContent=msg;$math('toast').classList.remove('hidden');setTimeout(()=>$math('toast').classList.add('hidden'),2400);}
document.querySelectorAll('#section-math [data-chapter]').forEach(btn=>btn.addEventListener('click',event=>{event.preventDefault();startPractice(btn.dataset.chapter);}));
document.querySelectorAll('#section-math [data-view]').forEach(btn=>btn.addEventListener('click',()=>showMathView(btn.dataset.view)));
$math('mixedPractice').addEventListener('click',()=>startPractice('mix'));
$math('backToOverview').addEventListener('click',()=>showMathView('overviewView'));
$math('quitPractice').addEventListener('click',()=>showMathView('overviewView'));
$math('nextQuestion').addEventListener('click',()=>{if(!answered)return;if(currentIndex<currentQuestions.length-1){currentIndex++;renderQuestion();}else finishPractice();});
$math('retryChapter').addEventListener('click',()=>startPractice(currentChapter));
$math('resultOverview').addEventListener('click',()=>showMathView('overviewView'));
updateProgress();
window.showMathView = showMathView;
})();
