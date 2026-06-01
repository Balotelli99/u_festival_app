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

// 3. Taalwissel (NL / EN)
const langBtn = document.getElementById('lang-btn');
let currentLang = 'nl';

const translations = {
    nl: {
        home: 'Acts',
        info: 'Informatie',
        schedule: 'Programma',
        map: 'Plattegrond',
        back: 'Terug'
    },
    en: {
        home: 'Acts',
        info: 'Information',
        schedule: 'Schedule',
        map: 'Festival Map',
        back: 'Back'
    }
};

function updateLanguage() {
    langBtn.textContent = currentLang === 'nl' ? '🇳🇱' : '🇬🇧';
    document.getElementById('t-home').textContent = translations[currentLang].home;
    document.getElementById('t-info').textContent = translations[currentLang].info;
    document.getElementById('t-sched').textContent = translations[currentLang].schedule;
    document.getElementById('t-map').textContent = translations[currentLang].map;
    document.getElementById('back-to-schedule').textContent = translations[currentLang].back;
    document.getElementById('back-to-home').textContent = translations[currentLang].back;
    renderArtistList();
    renderArtistDetail();
}

langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'nl' ? 'en' : 'nl';
    updateLanguage();
});

// 4. Geolocation API (GPS)
document.getElementById('btn-map').addEventListener('change', () => {
    // Initialize map if not already initialized
    if (!mapInitialized) {
        const mapContainer = document.getElementById('festival-map');
        if (mapContainer) {
            map = L.map('festival-map').setView([52.09, 5.12], 13); // Utrecht coordinates
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            setTimeout(() => {
                if (map) {
                    map.invalidateSize();
                }
            }, 250);
        }
        mapInitialized = true;
    } else if (map) {
        // If map already exists, invalidate size when tab is shown to ensure proper rendering
        setTimeout(() => {
            map.invalidateSize();
        }, 250);
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            document.getElementById('gps-status').textContent = 
                `📍 Jouw locatie: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

            if (map) {
                map.setView([lat, lng], 15);
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                userMarker = L.marker([lat, lng]).addTo(map)
                    .bindPopup('Jouw huidige locatie')
                    .openPopup();
            }
        }, () => {
            document.getElementById('gps-status').textContent = "GPS toegang geweigerd.";
            // If we denied, we still want to show the map (at default view) but without user marker
            if (map && !userMarker) {
                // Optionally, we can set the view to Utrecht again? But we already set it initially.
                // We'll leave it as is.
            }
        });
    } else {
        document.getElementById('gps-status').textContent = "Geolocatie wordt niet ondersteund door deze browser.";
    }
});

// 5. News Detail Click Handler
const artistsData = {
    armin: {
        title: 'Armin van Buuren',
        img: 'fotos/image (1).png',
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
        img: 'fotos/image (2).png',
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
        img: 'fotos/image (3).png',
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
        img: 'fotos/image (4).png',
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
        img: 'fotos/image (5).png',
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
        img: 'fotos/image (1).png',
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
        img: 'fotos/image (2).png',
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
        img: 'fotos/image (3).png',
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
        img: 'fotos/image (4).png',
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
        img: 'fotos/image (5).png',
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
        img: 'fotos/image (1).png',
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
    renderArtistDetail();

    document.getElementById('page-home').style.display = 'none';
    document.getElementById('page-artist-detail').style.display = 'block';
}

updateLanguage();

document.getElementById('back-to-schedule').addEventListener('click', () => {
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
    'Armin van Buuren': { img: 'fotos/image (1).png', desc: 'Wereldberoemde DJ en producent, bekend om zijn energieke sets en epische trance tracks.' },
    'Kensington': { img: 'fotos/image (2).png', desc: 'Nederlandse rockband die met hun emotionele nummers en krachtige optredens het publiek meesleuren.' },
    'De Staat': { img: 'fotos/image (3).png', desc: 'Indrukwekkende rockband met energieke shows en een herkenbare sound.' },
    'Navarone': { img: 'fotos/image (3).png', desc: 'Nederlands rockensemble met een unieke mix van alternatieve rock en melodische hooks.' },
    'Dotan': { img: 'fotos/image (4).png', desc: 'Singer-songwriter bekend om zijn warme, meeslepende pop-folk nummers.' },
    'Froukje': { img: 'fotos/image (4).png', desc: 'Popartieste met frisse energie en Nederlandstalige hits.' },
    'Martin Garrix': { img: 'fotos/image (1).png', desc: 'Internationale top-DJ met grote dancehits en spectaculaire liveshows.' },
    'Within Temptation': { img: 'fotos/image (2).png', desc: 'Symfonische metalband die grote podia weet te vullen met emotie en drama.' },
    'Chef\'Special': { img: 'fotos/image (5).png', desc: 'Verrassende live band met een mix van pop, rock, hiphop en reggae.' },
    'Eefje de Visser': { img: 'fotos/image (5).png', desc: 'Nederlands singer-songwriter met sfeervolle, gevoelige popmuziek.' },
    'Spinvis': { img: 'fotos/image (5).png', desc: 'Poëtische singer-songwriter met unieke, verhalende songs.' },
    'Talent set 1': { img: 'fotos/image (4).png', desc: 'Opkomend talent met een frisse geluid en passie voor live optreden.' },
    'Talent set 2': { img: 'fotos/image (4).png', desc: 'Opkomend talent met een frisse geluid en passie voor live optreden.' },
    'Talent set 3': { img: 'fotos/image (4).png', desc: 'Opkomend talent met een frisse geluid en passie voor live optreden.' },
    'Talent set 4': { img: 'fotos/image (4).png', desc: 'Opkomend talent met een frisse geluid en passie voor live optreden.' },
    'Talent set 5': { img: 'fotos/image (4).png', desc: 'Opkomend talent met een frisse geluid en passie voor live optreden.' },
    'Talent set 6': { img: 'fotos/image (4).png', desc: 'Opkomend talent met een frisse geluid en passie voor live optreden.' },
    'Talent set 7': { img: 'fotos/image (4).png', desc: 'Opkomend talent met een frisse geluid en passie voor live optreden.' },
    'Comedy': { img: 'fotos/image (5).png', desc: 'Lachgarantie met een scherpe blik op het leven en onvergetelijke sketches.' },
    'Lecture': { img: 'fotos/image (5).png', desc: 'Inspirerende spreker die diepe gedachten deelt over actuele onderwerpen.' },
    'Theater': { img: 'fotos/image (5).png', desc: 'Indrukwekkend theater dat je meeneemt naar een wereld van verbeelding en emotie.' },
    'Movie': { img: 'fotos/image (5).png', desc: 'Een filmvertoning op het festival met een speciale sfeer en grote scherm.' },
    'Performance': { img: 'fotos/image (5).png', desc: 'Een unieke podiumshow met artiesten en verrassende acts.' },
    'Illusionist': { img: 'fotos/image (5).png', desc: 'Magic en illusie die je blijven verbazen.' },
    'Magic Show': { img: 'fotos/image (5).png', desc: 'Een magische show vol illusionisme en theater.' },
    'DJ set 1': { img: 'fotos/image (1).png', desc: 'Een energieke DJ-set met verschillende hits en beats.' },
    'DJ set 2': { img: 'fotos/image (2).png', desc: 'Een DJ-set met dynamische festivalmuziek en dansbare klanken.' },
    'DJ set 3': { img: 'fotos/image (3).png', desc: 'Een DJ-set vol house, techno en feelgood vibes.' },
    'DJ set 4': { img: 'fotos/image (4).png', desc: 'Een DJ-set met sfeervolle beats voor de avond.' },
    'DJ set 5': { img: 'fotos/image (4).png', desc: 'Een DJ-set met energie en dansmuziek.' },
    'DJ set 6': { img: 'fotos/image (4).png', desc: 'Een DJ-set met clubklassiekers en moderne tracks.' },
    'DJ set 7': { img: 'fotos/image (4).png', desc: 'Een DJ-set met euforische festivalhits.' },
    'DJ set 8': { img: 'fotos/image (4).png', desc: 'Een DJ-set die de avond afsluit met knallende muziek.' }
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
    corner.textContent = 'Locatie';
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
                    document.getElementById('artist-stage').textContent = `Locatie: ${act.stage}`;
                    document.getElementById('artist-time').textContent = `Tijd: ${act.start} - ${act.end}`;
                    document.getElementById('artist-desc').textContent = details.desc;
                    document.getElementById('artist-img').src = details.img;
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
        activeDay = button.textContent.trim().toLowerCase();
        initScheduleGrid();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    initScheduleGrid();
});