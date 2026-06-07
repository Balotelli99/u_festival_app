// 1. PWA Service Worker registreren
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

// 2. Dark Mode Schakelaar
const themeBtn = document.getElementById('theme-btn');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// 2b. QR Code Modal
const qrBtn = document.getElementById('qr-btn');
const qrModal = document.getElementById('qr-modal');
const qrClose = document.getElementById('qr-close');
const qrcodeDiv = document.getElementById('qrcode');
const qrUrlEl = document.getElementById('qr-url');

function openQR() {
    let currentUrl = window.location.href;

    // Als we lokaal draaien, vraag dan om een URL of geef de optie om het huidige (lokale) IP in te voeren.
    const isLocal = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1') || currentUrl.startsWith('file://');
    
    if (isLocal) {
        const inputUrl = prompt(
            'Je draait de app lokaal. Je telefoon kan geen localhost openen.\n\nVoer je netwerk IP of live URL in (bijv. http://192.168.x.x:5500 of https://jouw-app.onrender.com):', 
            currentUrl
        );
        
        if (!inputUrl || !inputUrl.trim()) return; // Geannuleerd
        currentUrl = inputUrl.trim();
    }

    if (!qrModal) return;
    qrModal.style.display = 'flex';
    qrModal.setAttribute('aria-hidden', 'false');
    qrcodeDiv.innerHTML = '';
    qrUrlEl.textContent = currentUrl;
    
    new QRCode(qrcodeDiv, {
        text: currentUrl,
        width: 220,
        height: 220,
        colorDark: '#000000',
        colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.M
    });
}

function closeQR() {
    if (!qrModal) return;
    qrModal.style.display = 'none';
    qrModal.setAttribute('aria-hidden', 'true');
}

qrBtn?.addEventListener('click', openQR);
qrClose?.addEventListener('click', closeQR);
qrModal?.addEventListener('click', (e) => {
    if (e.target === qrModal) closeQR();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeQR();
});

// 3. Taalwissel (NL / EN)
const langBtn = document.getElementById('lang-btn');
let currentLang = 'nl';

const translations = {
    nl: {
        home: 'Acts',
        info: 'Informatie',
        schedule: 'Programma',
        map: 'Plattegrond',
        back: 'Terug',
        navHome: 'Home',
        navInfo: 'Info',
        navSchedule: 'Programma',
        navMap: 'Kaart',
        daySat: 'Zaterdag',
        daySun: 'Zondag',
        location: 'Locatie',
        time: 'Tijd',
        news: 'Nieuws',
        discoverArtists: 'Ontdek onze artiesten. Klik op een act voor meer informatie, een biografie en een video.',
        qrTitle: 'Scan de QR-code',
        qrSubtitle: 'Scan met je telefoon om de app te openen',
        generalContact: 'Algemeen & Contact',
        address: 'Adres',
        addressText: 'Locatie: Strijkviertel, Utrecht<br>Navigatieadres: Strijkviertelweg, Utrecht',
        dateHours: 'Datum & Openingstijden',
        dateText: 'Zaterdag 5 september 2026 - 12:00 tot 23:00 uur',
        accessibility: 'Bereikbaarheid',
        bike: 'Fiets',
        bikeText: 'Er is een grote gratis fietsenstalling aanwezig waar je jouw fiets de gehele dag kunt stallen.',
        car: 'Auto',
        carText: 'Je kunt een parkingticket aanschaffen. Parkeren kan op P+R Papendorp, volg hiervoor de borden \'P online ticket\'. Heb je geen ticket van te voren gekocht? Dan kun je bij de parkeerwachter op locatie een parkeerticket aanschaffen (PIN ONLY). Let wel op: VOL=VOL',
        public: 'OV',
        publicText: 'Kom je met het openbaar vervoer naar Lief? Plan dan je trip via <a href="https://9292.nl/" target="_blank">9292.nl</a>',
        shuttle: 'Shuttlebus',
        shuttleText: 'Vanaf Utrecht Centraal kun je onze gratis shuttlebus richting het festivalterrein pakken. Je vindt deze bus op het centraal station aan de Mineurslaan. Volg de witte bordjes met zwarte pijlen én \'❤️U Festival\'.<br>De bus rijdt tussen 12:00 uur & 9:00 uur richting het festival en vanaf 21:00 uur kun je weer instappen om richting het station te gaan.',
        taxi: 'Taxi + Kiss & Ride',
        taxiText: 'Navigeer naar Strijkviertel, De Meern (Utrecht). Volg de borden "Kiss & Ride ❤️U Festival", zodra je in de buurt bent van het festivalterrein.',
        lockers: 'Lockers',
        lockersText: 'Op het festivalterrein zijn kluisjes aanwezig waar je je spullen veilig kunt opbergen!<br>Hier passen 3 à 4 jassen in. Goed om te weten: je kunt je kluisje gedurende de hele dag openen en sluiten zo vaak je wilt.<br>Het is niet mogelijk om online een kluisje te reserveren.',
        faq: 'FAQ',
        faqMeds: 'Ik gebruik medicatie. Wat nu?',
        faqMedsAns: 'Het is toegestaan om medicijnen mee te nemen in een dosis die je maximaal nodig hebt op 1 dag. Een doktersverklaring/medicatiepaspoort is noodzakelijk.<br>De beveiliging zal jouw documentatie beoordelen en de medicijnen controleren. Het kan zijn dat de EHBO jouw medicijnen in bewaring neemt.',
        faqLeave: 'Mag ik het festivalterrein tussentijds verlaten?',
        faqLeaveAns: 'Nee, helaas is dat niet mogelijk. Om de veiligheid van alle bezoekers te kunnen waarborgen, kunnen we het niet toestaan dat het festivalterrein tussentijds verlaten wordt.',
        faqLockers: 'Zijn er lockers?',
        faqLockersAns: 'Yes, deze zijn er! Op het terrein kun je medium & grote lockers huren.',
        goldenGlu: 'Golden-GLU',
        goldenGluText: 'Studenten van het GLU hebben tijdens het festival speciale privileges en zijn herkenbaar aan een gouden armbandje.<br>Met dit gouden armbandje kunnen ze tijdens het festival gebruik maken van de gouden toiletten en met goud gemarkeerde bestelpunten aan de bars zonder in een rij te hoeven staan.',
        legend: 'Legenda',
        zoomIn: 'Inzoomen',
        zoomOut: 'Uitzoomen',
        gps: 'Centreer op mijn locatie',
        mapError: 'Kaartafbeelding kon niet laden.',
        artistInfo: 'Artiest Info',
        close: 'Sluiten',
        newsContent1: '🏅 Golden-GLU armbandjes ophalen',
        newsDesc1: 'GLU-studenten kunnen hun gouden armbandje ophalen bij de informatiebalie vanaf 11:00 op festivaldag. Vergeet je studentenpas niet!',
        newsContent2: '🚌 Shuttlebus schema bijgewerkt',
        newsDesc2: 'De gratis shuttlebus rijdt nu ook vanaf station Leidsche Rijn. Vertrek elke 15 minuten tussen 11:00 en 19:00.',
        newsContent3: '🎪 Nieuw podium aangekondigd!',
        newsDesc3: 'The Hangar is officieel toegevoegd aan het festivalterrein! Non-stop house, techno en dance van 10:00 tot middernacht.',
        welcome: 'Het ❤️U Festival is voor (nieuwe) studenten in de regio Utrecht en is een aanvulling op UIT.'
    },
    en: {
        home: 'Acts',
        info: 'Information',
        schedule: 'Schedule',
        map: 'Festival Map',
        back: 'Back',
        navHome: 'Home',
        navInfo: 'Info',
        navSchedule: 'Schedule',
        navMap: 'Map',
        daySat: 'Saturday',
        daySun: 'Sunday',
        location: 'Location',
        time: 'Time',
        news: 'News',
        discoverArtists: 'Discover our artists. Click on an act for more info, biography and video.',
        qrTitle: 'Scan QR Code',
        qrSubtitle: 'Scan with your phone to open the app',
        generalContact: 'General & Contact',
        address: 'Address',
        addressText: 'Location: Strijkviertel, Utrecht<br>Navigation address: Strijkviertelweg, Utrecht',
        dateHours: 'Date & Opening Hours',
        dateText: 'Saturday September 5, 2026 - 12:00 PM to 11:00 PM',
        accessibility: 'Accessibility',
        bike: 'Bike',
        bikeText: 'There is a large free bike parking available where you can park your bike all day.',
        car: 'Car',
        carText: 'You can purchase a parking ticket. Parking is available at P+R Papendorp, follow the signs \'P online ticket\'. Don\'t have a ticket in advance? You can purchase one at the parking attendant on site (PIN ONLY). Note: FULL=FULL',
        public: 'Public Transport',
        publicText: 'Coming by public transport? Plan your trip via <a href="https://9292.nl/" target="_blank">9292.nl</a>',
        shuttle: 'Shuttle Bus',
        shuttleText: 'From Utrecht Central you can take our free shuttle bus to the festival grounds. You\'ll find this bus at the central station on Mineurslaan. Follow the white signs with black arrows and \'❤️U Festival\'.<br>The bus runs from 12:00 PM & 9:00 PM to the festival and from 9:00 PM you can board again towards the station.',
        taxi: 'Taxi + Kiss & Ride',
        taxiText: 'Navigate to Strijkviertel, De Meern (Utrecht). Follow the signs "Kiss & Ride ❤️U Festival" once you\'re near the festival grounds.',
        lockers: 'Lockers',
        lockersText: 'There are lockers on the festival grounds where you can safely store your belongings!<br>3 to 4 jackets fit inside. Good to know: you can open and close your locker as many times as you want throughout the day.<br>It is not possible to reserve a locker online.',
        faq: 'FAQ',
        faqMeds: 'I use medication. What now?',
        faqMedsAns: 'It is allowed to bring medication in a dose that you need maximum for 1 day. A doctor\'s certificate/medication passport is required.<br>Security will review your documentation and check the medication. The medical staff may take your medication into custody.',
        faqLeave: 'Can I leave the festival grounds during the event?',
        faqLeaveAns: 'No, unfortunately that is not possible. In order to safeguard the safety of all visitors, we cannot allow the festival grounds to be left during the event.',
        faqLockers: 'Are there lockers?',
        faqLockersAns: 'Yes, there are! You can rent medium & large lockers on site.',
        goldenGlu: 'Golden-GLU',
        goldenGluText: 'GLU students have special privileges during the festival and are recognized by a golden wristband.<br>With this golden wristband, they can use the golden toilets and golden marked ordering points at the bars without having to stand in line.',
        legend: 'Legend',
        zoomIn: 'Zoom In',
        zoomOut: 'Zoom Out',
        gps: 'Center on my location',
        mapError: 'Map image could not load.',
        artistInfo: 'Artist Info',
        close: 'Close',
        newsContent1: '🏅 Pick up your Golden-GLU wristband',
        newsDesc1: 'GLU students can pick up their golden wristband at the information desk from 11:00 on festival day. Don\'t forget your student ID!',
        newsContent2: '🚌 Shuttle bus schedule updated',
        newsDesc2: 'The free shuttle bus now also runs from station Leidsche Rijn. Departures every 15 minutes between 11:00 and 19:00.',
        newsContent3: '🎪 New stage announced!',
        newsDesc3: 'The Hangar has officially been added to the festival grounds! Non-stop house, techno and dance from 10:00 to midnight.',
        welcome: 'The ❤️U Festival is for (new) students in the Utrecht region and is an addition to the UIT.'
    }
};

function updateLanguage() {
    const flag = document.getElementById('lang-flag');
    if (currentLang === 'nl') {
        flag.src = 'fotos/Flag_of_the_Netherlands.png';
        flag.alt = 'Nederlands';
    } else {
        flag.src = 'fotos/uk-flag-1444045.jpg';
        flag.alt = 'Engels';
    }

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;

    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    // Update news items
    for (let i = 1; i <= 3; i++) {
        const contentEl = document.getElementById(`news-content-${i}`);
        const descEl = document.getElementById(`news-desc-${i}`);
        if (contentEl) contentEl.innerHTML = translations[currentLang][`newsContent${i}`];
        if (descEl) descEl.textContent = translations[currentLang][`newsDesc${i}`];
    }

    // Update Info page specific items
    const infoPs = document.querySelectorAll('#page-info .acc-content p');
    infoPs.forEach(p => {
        if (p.id === 'info-p-address') p.innerHTML = translations[currentLang].addressText;
        else if (p.id === 'info-p-date') p.innerHTML = translations[currentLang].dateText;
        else if (p.id === 'info-p-fiets') p.innerHTML = translations[currentLang].bikeText;
        else if (p.id === 'info-p-auto') p.innerHTML = translations[currentLang].carText;
        else if (p.id === 'info-p-ov') p.innerHTML = translations[currentLang].publicText;
        else if (p.id === 'info-p-shuttle') p.innerHTML = translations[currentLang].shuttleText;
        else if (p.id === 'info-p-taxi') p.innerHTML = translations[currentLang].taxiText;
        else if (p.id === 'info-p-lockers') p.innerHTML = translations[currentLang].lockersText;
        else if (p.id === 'info-p-faq-meds') p.innerHTML = translations[currentLang].faqMedsAns;
        else if (p.id === 'info-p-faq-leave') p.innerHTML = translations[currentLang].faqLeaveAns;
        else if (p.id === 'info-p-faq-lockers-ans') p.innerHTML = translations[currentLang].faqLockersAns;
        else if (p.id === 'info-p-golden-glu-1') p.innerHTML = translations[currentLang].goldenGluText.split('<br>')[0];
        else if (p.id === 'info-p-golden-glu-2') p.innerHTML = translations[currentLang].goldenGluText.split('<br>')[1] || '';
    });

    const mapZoomLabels = document.querySelectorAll('#map-zoom-in, #map-zoom-out');
    mapZoomLabels.forEach(btn => {
        btn.setAttribute('aria-label', btn.id === 'map-zoom-in' ? translations[currentLang].zoomIn : translations[currentLang].zoomOut);
    });

    const mapGpsBtn = document.getElementById('map-gps-btn');
    if (mapGpsBtn) mapGpsBtn.setAttribute('aria-label', translations[currentLang].gps);

    const mapError = document.getElementById('map-load-error');
    if (mapError) mapError.textContent = translations[currentLang].mapError;

    const mapInfoClose = document.getElementById('map-info-close');
    if (mapInfoClose) mapInfoClose.setAttribute('aria-label', translations[currentLang].close);

    renderArtistList();
    renderArtistDetail();
    if (document.getElementById('btn-schedule')?.checked) {
        initScheduleGrid();
    }
}

langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'nl' ? 'en' : 'nl';
    updateLanguage();
});

// 4. GitHub-style festival map (interactive panel + zoom)
const mapMarkers = [
    { id: 'poton', title: { nl: 'Pôton', en: 'Pôton' }, subtitle: { nl: 'Hoofdpodium', en: 'Main Stage' }, icon: 'https://raw.githubusercontent.com/LarsM04/8.1---Module---U-Festival-App/main/assets/map/icons/marker_stage1_ponton.svg', x: 60, y: 32, desc: { nl: 'Belangrijkste hoofdstage met de grootste acts van het festival.', en: 'Main stage with the biggest acts of the festival.' } },
    { id: 'lake', title: { nl: 'The Lake', en: 'The Lake' }, subtitle: { nl: 'Talent & chill', en: 'Talent & chill' }, icon: 'https://raw.githubusercontent.com/LarsM04/8.1---Module---U-Festival-App/main/assets/map/icons/marker_stage1_ponton.svg', x: 26, y: 52, desc: { nl: 'Rustige locatie voor talent, talks en gezellige feestjes.', en: 'Relaxed location for talent, talks and cozy parties.' } },
    { id: 'food', title: { nl: 'Food & Drinks', en: 'Food & Drinks' }, subtitle: { nl: 'Eten & drank', en: 'Food & Drinks' }, icon: 'https://raw.githubusercontent.com/LarsM04/8.1---Module---U-Festival-App/main/assets/map/icons/marker_food.svg', x: 72, y: 68, desc: { nl: 'Diverse foodtrucks en drankstanden verspreid over het terrein.', en: 'Various food trucks and drink stands across the grounds.' } },
    { id: 'toilet', title: { nl: 'Toiletten', en: 'Toilets' }, subtitle: { nl: 'Toilet & EHBO', en: 'Toilet & First Aid' }, icon: 'https://raw.githubusercontent.com/LarsM04/8.1---Module---U-Festival-App/main/assets/map/icons/marker_toilet.svg', x: 46, y: 78, desc: { nl: 'Toiletten en EHBO-punten op korte loopafstand.', en: 'Toilets and first aid points within walking distance.' } }
];

let mapScale = 1;
let mapDrag = { active: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 };

function updateMapTransform() {
    const content = document.getElementById('map-content');
    if (!content) return;
    content.style.transform = `translate(${mapDrag.offsetX}px, ${mapDrag.offsetY}px) scale(${mapScale})`;
}

function openMapInfo(marker) {
    const panel = document.getElementById('map-info-panel');
    const title = document.getElementById('map-info-title');
    const subtitle = document.getElementById('map-info-subtitle');
    const body = document.getElementById('map-info-body');
    if (!panel || !title || !subtitle || !body) return;
    title.textContent = typeof marker.title === 'object' ? marker.title[currentLang] : marker.title;
    subtitle.textContent = typeof marker.subtitle === 'object' ? marker.subtitle[currentLang] : marker.subtitle;
    body.textContent = typeof marker.desc === 'object' ? marker.desc[currentLang] : marker.desc;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
}

function closeMapInfo() {
    const panel = document.getElementById('map-info-panel');
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
}

function initFestivalMapLite() {
    const content = document.getElementById('map-content');
    const legend = document.getElementById('map-legend-items');
    if (!content || !legend) return;

    content.querySelectorAll('.map-marker').forEach(el => el.remove());
    legend.innerHTML = '';

    // Add image load/error handling
    const mapImage = document.getElementById('map-image');
    if (mapImage) {
        mapImage.addEventListener('error', () => {
            document.getElementById('map-load-error')?.classList.add('visible');
        });
        mapImage.addEventListener('load', () => {
            document.getElementById('map-load-error')?.classList.remove('visible');
        });
    }

    mapMarkers.forEach((marker) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'map-marker';
        btn.style.left = `${marker.x}%`;
        btn.style.top = `${marker.y}%`;
        const t = typeof marker.title === 'object' ? marker.title[currentLang] : marker.title;
        btn.setAttribute('aria-label', t);
        btn.innerHTML = `<img src="${marker.icon}" alt="" />`;
        btn.addEventListener('click', () => openMapInfo(marker));
        content.appendChild(btn);

        const item = document.createElement('div');
        item.className = 'map-legend-item';
        item.innerHTML = `<img src="${marker.icon}" alt="" /><span>${t}</span>`;
        legend.appendChild(item);
    });

    document.getElementById('map-legend-toggle')?.addEventListener('click', () => {
        document.getElementById('map-legend')?.classList.toggle('expanded');
    });

    document.getElementById('map-info-close')?.addEventListener('click', closeMapInfo);
     document.getElementById('map-zoom-in')?.addEventListener('click', () => {
         mapScale = Math.min(3.0, mapScale + 0.15);
         updateMapTransform();
     });
     document.getElementById('map-zoom-out')?.addEventListener('click', () => {
         mapScale = Math.max(0.3, mapScale - 0.15);
         updateMapTransform();
     });

    const dragSurface = document.getElementById('map-drag-surface');
    const viewport = document.getElementById('map-viewport');
    if (dragSurface && viewport) {
        dragSurface.addEventListener('pointerdown', (e) => {
            mapDrag.active = true;
            mapDrag.startX = e.clientX;
            mapDrag.startY = e.clientY;
            viewport.classList.add('is-dragging');
        });
        dragSurface.addEventListener('pointermove', (e) => {
            if (!mapDrag.active) return;
            mapDrag.offsetX += e.clientX - mapDrag.startX;
            mapDrag.offsetY += e.clientY - mapDrag.startY;
            mapDrag.startX = e.clientX;
            mapDrag.startY = e.clientY;
            updateMapTransform();
        });
        const stopDrag = () => {
            mapDrag.active = false;
            viewport.classList.remove('is-dragging');
        };
        dragSurface.addEventListener('pointerup', stopDrag);
        dragSurface.addEventListener('pointercancel', stopDrag);
        dragSurface.addEventListener('pointerleave', stopDrag);
    }
}

const mapToggle = document.getElementById('btn-map');
if (mapToggle) {
    mapToggle.addEventListener('change', () => {
        if (mapToggle.checked) {
            setTimeout(initFestivalMapLite, 150);
        }
    });
}

// 5. News Detail Click Handler
const artistsData = {
    armin: {
        title: 'Armin van Buuren',
        img: 'fotos/image.png',
        video: 'https://www.youtube.com/embed/TxvpctgU_s8',
        tagline: {
            nl: 'Trance-icoon',
            en: 'Trance icon'
        },
        bio: {
            nl: 'Vijf keer “World’s No. 1 DJ” en trance-icoon, Armin levert euforische, energieke sets die festivals als Tomorrowland en Ultra headlinen. Zijn opbeurende melodieën en perfecte mixen houden de menigte urenlang dansend.',
            en: 'Five-time “World’s No. 1 DJ” and trance icon, Armin delivers euphoric, high-energy sets that have headlined festivals from Tomorrowland to Ultra. His uplifting melodies and impeccable mixing keep crowds dancing for hours.'
        }
    },
    martin: {
        title: 'Martin Garrix',
        img: 'fotos/image (1).png',
        video: 'https://www.youtube.com/embed/Zv1QV6lrc_Y',
        tagline: {
            nl: 'EDM-superster',
            en: 'EDM superstar'
        },
        bio: {
            nl: 'Doorbrak als tiener met “Animals” en groeide uit tot een van de grootste namen in EDM. Zijn anthemic big-room tracks en stadionwaardige drops maken hem een festivalfavoriet in heel Europa.',
            en: 'Broke through as a teenager with “Animals,” Martin Garrix has become one of the biggest names in EDM. His anthemic big-room tracks and stadium-sized drops make him a festival favorite across Europe.'
        }
    },
    kensington: {
        title: 'Kensington',
        img: 'fotos/image (2).png',
        video: 'https://www.youtube.com/embed/IH77eOyV95o',
        tagline: {
            nl: 'Indie rock anthems',
            en: 'Indie rock anthems'
        },
        bio: {
            nl: 'Rotterdamse indie rock quintet bekend om hun opzwepende refreinen en gierende gitaarpartijen. Hits als “Streets” en “Riddles” tonen hun talent voor arena-ready hooks en emotioneel geladen teksten.',
            en: 'Rotterdam-born indie rock quintet known for soaring choruses and driving guitar riffs. Hits like “Streets” and “Riddles” showcase their knack for arena-ready hooks and emotionally charged lyricism.'
        }
    },
    within: {
        title: 'Within Temptation',
        img: 'fotos/image (3).png',
        video: 'https://www.youtube.com/embed/iQVei5C2N4E',
        tagline: {
            nl: 'Symfonische metal pioniers',
            en: 'Symphonic metal pioneers'
        },
        bio: {
            nl: 'Symfonische metalpioniers onder leiding van Sharon den Adel. Hun filmische soundscapes en operatische vocals leveren dramatische, visueel indrukwekkende festivalshows op.',
            en: 'Symphonic metal pioneers fronted by Sharon den Adel. Their cinematic soundscapes and operatic vocals translate into dramatic, visually stunning festival performances.'
        }
    },
    destaat: {
        title: 'De Staat',
        img: 'fotos/image (4).png',
        video: 'https://www.youtube.com/embed/0ttGgIQpAUc',
        tagline: {
            nl: 'Experimentele rock innovators',
            en: 'Experimental rock innovators'
        },
        bio: {
            nl: 'Experimentele rockband uit Nijmegen, die funky grooves combineert met hoekige gitaarlijnen en theatrale podiumkunst. Tracks als “Witch Doctor” en “Down Town” benadrukken hun genre-brekkende stijl en aanstekelijke energie.',
            en: 'Experimental rock outfit from Nijmegen, blending funky grooves with angular guitar work and theatrical stagecraft. Tracks like “Witch Doctor” and “Down Town” highlight their genre-bending approach and infectious energy.'
        }
    },
    chefsspecial: {
        title: 'Chef’Special',
        img: 'fotos/image (5).png',
        video: 'https://www.youtube.com/embed/l3jRIr44lss',
        tagline: {
            nl: 'Genre-buigend funk-pop',
            en: 'Genre-blending funk-pop'
        },
        bio: {
            nl: 'Een viertal uit Haarlem dat funk, pop, rock en hiphop mixt. Hun vrolijke, genre-fluid sound op nummers als “Amigo” en “In Your Arms” zorgt voor een feestelijke sfeer en dansvloerplezier.',
            en: 'A four-piece from Haarlem mixing funk, pop, rock and hip-hop. Their upbeat, genre-fluid sound on songs like “Amigo” and “In Your Arms” makes for joyous, dance-floor-friendly live shows.'
        }
    },
    navarone: {
        title: 'Navarone',
        img: 'fotos/image (6).png',
        video: 'https://www.youtube.com/embed/EvLpaCSnc4k',
        tagline: {
            nl: 'Hard rock viermanschap',
            en: 'Hard-hitting rock four-piece'
        },
        bio: {
            nl: 'Utrechtse hard rock viermanschap met stevige riffs en dynamische vocalen. Met hun reputatie voor intense live shows passen ze perfect op het late-night hoofdpodium.',
            en: 'Utrecht’s hard-hitting rock four-piece, delivering riff-driven anthems and dynamic vocals. With a live reputation for raw intensity, they’re tailor-made for late-night main stages.'
        }
    },
    dotan: {
        title: 'Dotan',
        img: 'fotos/image (7).png',
        video: 'https://www.youtube.com/embed/FZEuqzW16Nw',
        tagline: {
            nl: 'Folk-pop singer-songwriter',
            en: 'Folk-pop singer-songwriter'
        },
        bio: {
            nl: 'Folk-pop singer-songwriter wiens intieme stem en akoestische arrangementen hem platinum verkopen en uitverkochte shows opleverden. Zijn oprechte storytelling raakt diep tijdens festivalacoustic sets.',
            en: 'Folk-pop singer-songwriter whose intimate voice and acoustic arrangements have earned him platinum sales and sell-out shows. His heartfelt storytelling connects deeply on festival acoustic stages.'
        }
    },
    eefje: {
        title: 'Eefje de Visser',
        img: 'fotos/image (8).png',
        video: 'https://www.youtube.com/embed/6IlLJNmLDMg',
        tagline: {
            nl: 'Sfeervolle indie-pop',
            en: 'Atmospheric indie-pop'
        },
        bio: {
            nl: 'Indie-pop artieste met atmosferische, elektronisch getinte songs. Haar hypnotiserende vocals en weelderige productie creëren een droomachtige sfeer die perfect is voor het schemerfestival.',
            en: 'Indie-pop artist crafting atmospheric, electronic-tinged songs. Her hypnotic vocals and lush production create a dreamlike vibe perfect for twilight festival slots.'
        }
    },
    froukje: {
        title: 'Froukje',
        img: 'fotos/image (9).png',
        video: 'https://www.youtube.com/embed/g4PlReX9e-E',
        tagline: {
            nl: 'Oprechte popsongwriter',
            en: 'Candid pop songwriter'
        },
        bio: {
            nl: 'Doorbraakpopzangeres Froukje Veenstra combineert openhartige teksten met catchy, synthgedreven hooks. Sinds haar 2021-debuut is ze een stem voor haar generatie.',
            en: 'Breakthrough pop singer Froukje combines candid lyrics with catchy, synth-driven hooks. Since her 2021 debut, she’s become a voice of her generation—ideal for mid-day festival stages.'
        }
    },
    spinvis: {
        title: 'Spinvis',
        img: 'fotos/image (10).png',
        video: 'https://www.youtube.com/embed/F3ZTrGWSLf4',
        tagline: {
            nl: 'Poëtische lo-fi surrealist in popvorm',
            en: 'Poetic lo-fi surrealist in pop form'
        },
        bio: {
            nl: 'Erik de Jong treedt op als Spinvis en maakt poëtische collage-achtige songs die gesproken woord, lo-fi elektronica en weemoedige pop mengen. Zijn liveshows transformeren dagelijkse observaties in gedeelde, droomachtige ervaringen.',
            en: 'Erik de Jong performs under the moniker Spinvis, crafting poetic, collage-like songs that blend spoken-word snippets, lo-fi electronics and wistful pop. His live shows turn everyday observations into shared, dreamlike experiences.'
        }
    }
};

let currentArtistKey = null;

function getArtistText(artist, field) {
    return artist[field] && artist[field][currentLang] ? artist[field][currentLang] : '';
}

function renderArtistList() {
    const list = document.getElementById('artist-list');
    if (!list) return;
    list.innerHTML = '';

    Object.keys(artistsData).forEach((artistKey) => {
        const artist = artistsData[artistKey];
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'artist-card clickable-artist';
        button.dataset.artist = artistKey;

        const img = document.createElement('img');
        img.src = artist.img;
        img.alt = artist.title;
        img.className = 'artist-card-img';

        const info = document.createElement('div');
        info.className = 'news-content';

        const title = document.createElement('h3');
        title.textContent = artist.title;

        const tagline = document.createElement('p');
        tagline.textContent = getArtistText(artist, 'tagline');

        info.appendChild(title);
        info.appendChild(tagline);
        button.appendChild(img);
        button.appendChild(info);
        list.appendChild(button);
    });

    document.querySelectorAll('.clickable-artist').forEach(item => {
        item.addEventListener('click', (e) => {
            const artistKey = e.currentTarget.getAttribute('data-artist');
            showArtistDetail(artistKey);
        });
    });
}

function renderArtistDetail() {
    if (!currentArtistKey) return;
    const artist = artistsData[currentArtistKey];
    if (!artist) return;

    document.getElementById('artist-detail-title').textContent = artist.title;
    document.getElementById('artist-detail-img').src = artist.img;
    document.getElementById('artist-detail-img').alt = artist.title;
    document.getElementById('artist-detail-tagline').textContent = getArtistText(artist, 'tagline');
    document.getElementById('artist-detail-bio').textContent = getArtistText(artist, 'bio');
    document.getElementById('artist-detail-video').src = artist.video;
}

function showArtistDetail(artistKey) {
    currentArtistKey = artistKey;

    document.getElementById('page-home').style.display = 'none';
    document.getElementById('page-artist-detail').style.display = 'block';

    setTimeout(() => renderArtistDetail(), 50);
}

updateLanguage();

document.getElementById('back-to-schedule').addEventListener('click', () => {
    const videoEl = document.getElementById('artist-info-video');
    if (videoEl) videoEl.src = '';
    document.getElementById('page-artist-info').style.display = 'none';
    document.getElementById('page-schedule').style.display = 'block';
});

document.getElementById('back-to-home').addEventListener('click', () => {
    document.getElementById('artist-detail-video').src = '';
    document.getElementById('page-artist-detail').style.display = 'none';
    document.getElementById('page-home').style.display = 'block';
});

// 6. Schedule Grid Data (Gekoppeld aan de afbeelding)
const scheduleData = {
    zaterdag: [
        { start: '10:00', end: '11:00', artist: 'Armin van Buuren', stage: 'Pôton' },
        { start: '12:00', end: '13:00', artist: 'Kensington', stage: 'Pôton' },
        { start: '14:00', end: '15:00', artist: 'De Staat', stage: 'Pôton' },
        { start: '17:45', end: '19:00', artist: 'Navarone', stage: 'Pôton' },
        { start: '19:15', end: '20:45', artist: 'Dotan', stage: 'Pôton' },
        { start: '22:15', end: '23:45', artist: 'Froukje', stage: 'Pôton' },
        
        { start: '10:00', end: '11:00', artist: 'Talent set 1', stage: 'The Lake' },
        { start: '11:15', end: '12:15', artist: 'Talent set 2', stage: 'The Lake' },
        { start: '12:45', end: '13:45', artist: 'Talent set 3', stage: 'The Lake' },
        { start: '14:30', end: '15:30', artist: 'Talent set 4', stage: 'The Lake' },
        { start: '16:00', end: '17:00', artist: 'Talent set 5', stage: 'The Lake' },
        { start: '18:00', end: '19:00', artist: 'Talent set 6', stage: 'The Lake' },
        { start: '21:00', end: '22:00', artist: 'Talent set 7', stage: 'The Lake' },
        
        { start: '10:30', end: '11:30', artist: 'Comedy', stage: 'The Club' },
        { start: '12:00', end: '13:00', artist: 'Lecture', stage: 'The Club' },
        { start: '13:45', end: '14:45', artist: 'Theater', stage: 'The Club' },
        { start: '15:15', end: '16:15', artist: 'Movie', stage: 'The Club' },
        { start: '20:00', end: '21:30', artist: 'Performance', stage: 'The Club' },
        { start: '22:15', end: '23:45', artist: 'Illusionist', stage: 'The Club' },
        
        { start: '10:00', end: '11:45', artist: 'DJ set 1', stage: 'Hanggar' },
        { start: '11:45', end: '13:30', artist: 'DJ set 2', stage: 'Hanggar' },
        { start: '13:30', end: '15:15', artist: 'DJ set 3', stage: 'Hanggar' },
        { start: '15:15', end: '17:00', artist: 'DJ set 4', stage: 'Hanggar' },
        { start: '17:00', end: '18:45', artist: 'DJ set 5', stage: 'Hanggar' },
        { start: '18:45', end: '20:30', artist: 'DJ set 6', stage: 'Hanggar' },
        { start: '20:30', end: '22:15', artist: 'DJ set 7', stage: 'Hanggar' },
        { start: '22:15', end: '23:45', artist: 'DJ set 8', stage: 'Hanggar' }
    ],
    zondag: [
        { start: '11:00', end: '13:00', artist: 'Martin Garrix', stage: 'Pôton' },
        { start: '14:00', end: '15:30', artist: 'Within Temptation', stage: 'Pôton' },
        { start: '16:15', end: '17:30', artist: 'Chef\'Special', stage: 'Pôton' },
        { start: '18:45', end: '20:15', artist: 'Eefje de Visser', stage: 'Pôton' },
        { start: '21:30', end: '23:45', artist: 'Spinvis', stage: 'Pôton' },
        
        { start: '10:00', end: '11:00', artist: 'Talent set 1', stage: 'The Lake' },
        { start: '11:15', end: '12:15', artist: 'Talent set 2', stage: 'The Lake' },
        { start: '12:45', end: '13:45', artist: 'Talent set 3', stage: 'The Lake' },
        { start: '14:15', end: '15:15', artist: 'Talent set 4', stage: 'The Lake' },
        { start: '16:00', end: '17:00', artist: 'Talent set 5', stage: 'The Lake' },
        { start: '18:00', end: '19:00', artist: 'Talent set 6', stage: 'The Lake' },
        
        { start: '11:00', end: '12:00', artist: 'Comedy', stage: 'The Club' },
        { start: '12:30', end: '13:30', artist: 'Lecture', stage: 'The Club' },
        { start: '14:00', end: '15:00', artist: 'Theater', stage: 'The Club' },
        { start: '16:00', end: '17:00', artist: 'Movie', stage: 'The Club' },
        { start: '19:00', end: '20:30', artist: 'Magic Show', stage: 'The Club' },
        
        { start: '10:00', end: '11:45', artist: 'DJ set 1', stage: 'Hanggar' },
        { start: '11:45', end: '13:30', artist: 'DJ set 2', stage: 'Hanggar' },
        { start: '13:30', end: '15:15', artist: 'DJ set 3', stage: 'Hanggar' },
        { start: '15:15', end: '17:00', artist: 'DJ set 4', stage: 'Hanggar' },
        { start: '17:00', end: '18:45', artist: 'DJ set 5', stage: 'Hanggar' },
        { start: '18:45', end: '20:30', artist: 'DJ set 6', stage: 'Hanggar' },
        { start: '20:30', end: '22:15', artist: 'DJ set 7', stage: 'Hanggar' },
        { start: '22:15', end: '23:45', artist: 'DJ set 8', stage: 'Hanggar' }
    ]
};

function generateTimeSlots() {
    const slots = [];
    let hour = 10;
    let min = 0;
    
    while (hour < 23 || (hour === 23 && min <= 45)) {
        let hStr = hour.toString().padStart(2, '0');
        let mStr = min.toString().padStart(2, '0');
        slots.push(`${hStr}:${mStr}`);
        
        min += 15;
        if (min === 60) {
            min = 0;
            hour += 1;
        }
    }
    return slots;
}

function timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

const artistDetails = {
    'Armin van Buuren': { 
        img: 'fotos/image.png', 
        desc: {
            nl: 'Wereldberoemde DJ en producent, bekend om zijn energieke sets en epische trance tracks.',
            en: 'World-famous DJ and producer, known for his energy sets and epic trance tracks.'
        }
    },
    'Kensington': { 
        img: 'fotos/image (2).png', 
        desc: {
            nl: 'Nederlandse rockband die met hun emotionele nummers en krachtige optredens het publiek meesleuren.',
            en: 'Dutch rock band that sweep the audience away with their emotional songs and powerful performances.'
        }
    },
    'De Staat': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Indrukwekkende rockband met energieke shows en een herkenbare sound.',
            en: 'Impressive rock band with energetic shows and a recognizable sound.'
        }
    },
    'Navarone': { 
        img: 'fotos/image (6).png', 
        desc: {
            nl: 'Nederlands rockensemble met een unieke mix van alternatieve rock en melodische hooks.',
            en: 'Dutch rock ensemble with a unique mix of alternative rock and melodic hooks.'
        }
    },
    'Dotan': { 
        img: 'fotos/image (7).png', 
        desc: {
            nl: 'Singer-songwriter bekend om zijn warme, meeslepende pop-folk nummers.',
            en: 'Singer-songwriter known for his warm, immersive pop-folk songs.'
        }
    },
    'Froukje': { 
        img: 'fotos/image (9).png', 
        desc: {
            nl: 'Popartieste met frisse energie en Nederlandstalige hits.',
            en: 'Pop artist with fresh energy and Dutch-language hits.'
        }
    },
    'Martin Garrix': { 
        img: 'fotos/image (1).png', 
        desc: {
            nl: 'Internationale top-DJ met grote dancehits en spectaculaire liveshows.',
            en: 'International top DJ with major dance hits and spectacular live shows.'
        }
    },
    'Within Temptation': { 
        img: 'fotos/image (3).png', 
        desc: {
            nl: 'Symfonische metalband die grote podia weet te vullen met emotie en drama.',
            en: 'Symphonic metal band that knows how to fill large stages with emotion and drama.'
        }
    },
    'Chef\'Special': { 
        img: 'fotos/image (5).png', 
        desc: {
            nl: 'Verrassende live band met een mix van pop, rock, hiphop en reggae.',
            en: 'Surprising live band with a mix of pop, rock, hip hop and reggae.'
        }
    },
    'Eefje de Visser': { 
        img: 'fotos/image (8).png', 
        desc: {
            nl: 'Nederlands singer-songwriter met sfeervolle, gevoelige popmuziek.',
            en: 'Dutch singer-songwriter with atmospheric, sensitive pop music.'
        }
    },
    'Spinvis': { 
        img: 'fotos/image (10).png', 
        desc: {
            nl: 'Poëtische singer-songwriter met unieke, verhalende songs.',
            en: 'Poetic singer-songwriter with unique, narrative songs.'
        }
    },
    'Talent set 1': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Opkomend talent met een frisse geluid en passie voor live optreden.',
            en: 'Emerging talent with a fresh sound and passion for live performance.'
        }
    },
    'Talent set 2': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Opkomend talent met een frisse geluid en passie voor live optreden.',
            en: 'Emerging talent with a fresh sound and passion for live performance.'
        }
    },
    'Talent set 3': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Opkomend talent met een frisse geluid en passie voor live optreden.',
            en: 'Emerging talent with a fresh sound and passion for live performance.'
        }
    },
    'Talent set 4': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Opkomend talent met een frisse geluid en passie voor live optreden.',
            en: 'Emerging talent with a fresh sound and passion for live performance.'
        }
    },
    'Talent set 5': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Opkomend talent met een frisse geluid en passie voor live optreden.',
            en: 'Emerging talent with a fresh sound and passion for live performance.'
        }
    },
    'Talent set 6': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Opkomend talent met een frisse geluid en passie voor live optreden.',
            en: 'Emerging talent with a fresh sound and passion for live performance.'
        }
    },
    'Talent set 7': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Opkomend talent met een frisse geluid en passie voor live optreden.',
            en: 'Emerging talent with a fresh sound and passion for live performance.'
        }
    },
    'Comedy': { 
        img: 'fotos/image (5).png', 
        desc: {
            nl: 'Lachgarantie met een scherpe blik op het leven en onvergetelijke sketches.',
            en: 'Guaranteed laughs with a sharp look at life and unforgettable sketches.'
        }
    },
    'Lecture': { 
        img: 'fotos/image (5).png', 
        desc: {
            nl: 'Inspirerende spreker die diepe gedachten deelt over actuele onderwerpen.',
            en: 'Inspiring speaker sharing deep thoughts on current topics.'
        }
    },
    'Theater': { 
        img: 'fotos/image (5).png', 
        desc: {
            nl: 'Indrukwekkend theater dat je meeneemt naar een wereld van verbeelding en emotie.',
            en: 'Impressive theater that takes you to a world of imagination and emotion.'
        }
    },
    'Movie': { 
        img: 'fotos/image (5).png', 
        desc: {
            nl: 'Een filmvertoning op het festival met een speciale sfeer en grote scherm.',
            en: 'A film screening at the festival with a special atmosphere and large screen.'
        }
    },
    'Performance': { 
        img: 'fotos/image (5).png', 
        desc: {
            nl: 'Een unieke podiumshow met artiesten en verrassende acts.',
            en: 'A unique stage show with artists and surprising acts.'
        }
    },
    'Illusionist': { 
        img: 'fotos/image (5).png', 
        desc: {
            nl: 'Magic en illusie die je blijven verbazen.',
            en: 'Magic and illusion that will keep you amazed.'
        }
    },
    'Magic Show': { 
        img: 'fotos/image (5).png', 
        desc: {
            nl: 'Een magische show vol illusionisme en theater.',
            en: 'A magical show full of illusionism and theater.'
        }
    },
    'DJ set 1': { 
        img: 'fotos/image (1).png', 
        desc: {
            nl: 'Een energieke DJ-set met verschillende hits en beats.',
            en: 'An energetic DJ set with various hits and beats.'
        }
    },
    'DJ set 2': { 
        img: 'fotos/image (2).png', 
        desc: {
            nl: 'Een DJ-set met dynamische festivalmuziek en dansbare klanken.',
            en: 'A DJ set with dynamic festival music and danceable sounds.'
        }
    },
    'DJ set 3': { 
        img: 'fotos/image (3).png', 
        desc: {
            nl: 'Een DJ-set vol house, techno en feelgood vibes.',
            en: 'A DJ set full of house, techno and feel-good vibes.'
        }
    },
    'DJ set 4': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Een DJ-set met sfeervolle beats voor de avond.',
            en: 'A DJ set with atmospheric beats for the evening.'
        }
    },
    'DJ set 5': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Een DJ-set met energie en dansmuziek.',
            en: 'A DJ set with energy and dance music.'
        }
    },
    'DJ set 6': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Een DJ-set met clubklassiekers en moderne tracks.',
            en: 'A DJ set with club classics and modern tracks.'
        }
    },
    'DJ set 7': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Een DJ-set met euforische festivalhits.',
            en: 'A DJ set with euphoric festival hits.'
        }
    },
    'DJ set 8': { 
        img: 'fotos/image (4).png', 
        desc: {
            nl: 'Een DJ-set die de avond afsluit met knallende muziek.',
            en: 'A DJ set that closes the evening with banging music.'
        }
    }
};

let activeDay = 'zaterdag';
let map = null;
let userMarker = null;
let mapInitialized = false;

function initScheduleGrid() {
    const grid = document.getElementById('schedule-grid');
    grid.innerHTML = '';
    
    const timeSlots = generateTimeSlots();
    const stages = ['Pôton', 'The Lake', 'The Club', 'Hanggar'];
    const schedule = scheduleData[activeDay];
    
    grid.style.gridTemplateColumns = `90px repeat(${timeSlots.length}, 60px)`;
    grid.style.gridTemplateRows = `40px repeat(${stages.length}, 70px)`;
    
    const corner = document.createElement('div');
    corner.className = 'stage-header corner-sticky';
    corner.textContent = translations[currentLang].location;
    grid.appendChild(corner);
    
    timeSlots.forEach(time => {
        const div = document.createElement('div');
        div.className = 'time-header';
        div.textContent = time;
        grid.appendChild(div);
    });
    
    stages.forEach((stage, stageIndex) => {
        const gridRow = stageIndex + 2;
        const stageDiv = document.createElement('div');
        stageDiv.className = 'stage-header stage-sticky';
        stageDiv.style.gridRow = gridRow;
        stageDiv.style.gridColumn = 1;
        stageDiv.textContent = stage;
        grid.appendChild(stageDiv);
        
        const stageActs = schedule.filter(a => a.stage === stage);
        
        stageActs.forEach(act => {
            const startMin = timeToMinutes(act.start);
            const endMin = timeToMinutes(act.end);
            const baseMin = timeToMinutes('10:00');
            const colStart = ((startMin - baseMin) / 15) + 2;
            const colSpan = (endMin - startMin) / 15;
            
            const block = document.createElement('div');
            block.className = 'schedule-block';
            block.style.gridRow = gridRow;
            block.style.gridColumn = `${colStart} / span ${colSpan}`;
            
            block.innerHTML = `
                <div class="artist-name">${act.artist}</div>
                <div class="artist-time">${act.start} - ${act.end}</div>
            `;
            
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            if (favorites.includes(act.artist)) {
                block.classList.add('favorite');
            }
            
            const favBtn = document.createElement('button');
            favBtn.className = 'fav-btn';
            favBtn.textContent = favorites.includes(act.artist) ? '⭐' : '☆';
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(block, act.artist);
                favBtn.textContent = JSON.parse(localStorage.getItem('favorites') || '[]').includes(act.artist) ? '⭐' : '☆';
            });
            block.appendChild(favBtn);
            
            block.addEventListener('click', () => {
                const details = artistDetails[act.artist];
                if (details) {
                    document.getElementById('artist-name-display').textContent = act.artist;
                    document.getElementById('artist-stage').textContent = `${translations[currentLang].location}: ${act.stage}`;
                    document.getElementById('artist-time').textContent = `${translations[currentLang].time}: ${act.start} - ${act.end}`;
                    document.getElementById('artist-desc').textContent = typeof details.desc === 'object' ? details.desc[currentLang] : details.desc;
                    document.getElementById('artist-img').src = details.img;
                    
                    // Zoek of we een video hebben in de hoofd artistsData
                    let vid = '';
                    const mainArtistKey = Object.keys(artistsData).find(k => artistsData[k].title === act.artist);
                    if (mainArtistKey && artistsData[mainArtistKey].video) {
                        vid = artistsData[mainArtistKey].video;
                    }
                    
                    const videoContainer = document.getElementById('artist-info-video-container');
                    const videoEl = document.getElementById('artist-info-video');
                    if (videoContainer && videoEl) {
                        if (vid) {
                            videoEl.src = vid;
                            videoContainer.style.display = 'block';
                        } else {
                            videoEl.src = '';
                            videoContainer.style.display = 'none';
                        }
                    }
                }
                document.getElementById('page-schedule').style.display = 'none';
                document.getElementById('page-artist-info').style.display = 'block';
            });
            grid.appendChild(block);
        });
        
        timeSlots.forEach((time, slotIndex) => {
            const colIndex = slotIndex + 2;
            const isOccupied = stageActs.some(act => {
                const sIdx = ((timeToMinutes(act.start) - timeToMinutes('10:00')) / 15) + 2;
                const eIdx = sIdx + ((timeToMinutes(act.end) - timeToMinutes(act.start)) / 15);
                return colIndex >= sIdx && colIndex < eIdx;
            });
            
            if (!isOccupied) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'grid-empty-cell';
                emptyCell.style.gridRow = gridRow;
                emptyCell.style.gridColumn = colIndex;
                grid.appendChild(emptyCell);
            }
        });
    });
}

function toggleFavorite(element, artist) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFav = favorites.includes(artist);
    
    if (isFav) {
        element.classList.remove('favorite');
        favorites = favorites.filter(f => f !== artist);
    } else {
        element.classList.add('favorite');
        favorites.push(artist);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

document.querySelectorAll('.day-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        activeDay = button.dataset.day;
        initScheduleGrid();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    initScheduleGrid();
});