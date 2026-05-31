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
        home: 'Nieuws',
        info: 'Informatie',
        schedule: 'Programma',
        map: 'Plattegrond',
        back: 'Terug'
    },
    en: {
        home: 'News',
        info: 'Information',
        schedule: 'Schedule',
        map: 'Festival Map',
        back: 'Back'
    }
};

langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'nl' ? 'en' : 'nl';
    langBtn.textContent = currentLang === 'nl' ? '🇳🇱' : '🇬🇧';
    
    document.getElementById('t-home').textContent = translations[currentLang].home;
    document.getElementById('t-info').textContent = translations[currentLang].info;
    document.getElementById('t-sched').textContent = translations[currentLang].schedule;
    document.getElementById('t-map').textContent = translations[currentLang].map;
    document.getElementById('back-to-schedule').textContent = translations[currentLang].back;
    document.getElementById('back-to-home').textContent = translations[currentLang].back;
});

// 4. Geolocation API (GPS)
document.getElementById('btn-map').addEventListener('change', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            document.getElementById('gps-status').textContent = 
                `📍 Jouw locatie: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
        }, () => {
            document.getElementById('gps-status').textContent = "GPS toegang geweigerd.";
        });
    }
});

// 5. News Detail Click Handler
const newsData = {
    welcome: { title: "Welkom bij ❤️U!", img: "fotos/image (1).png", content: "De eerste meldingen verschijnen hier tijdens het festival. Welkom op het ❤️U Festival app!" },
    lineup: { title: "Line-up 2026", img: "fotos/image (2).png", content: "Topartiesten als Armin van Buuren, Kensington en De Staat staan op het programma." },
    location: { title: "Locatie Strijkviertel", img: "fotos/image (3).png", content: "Het festival vindt plaats op het mooie Strijkviertel in Utrecht. Een prachtig park met diverse podia." },
    tickets: { title: "Tickets Nu Beschikbaar", img: "fotos/image (4).png", content: "Koop nu je tickets voor een onvergetelijke dag! Early bird prijzen zijn nu online beschikbaar." },
    food: { title: "Food & Drinks", img: "fotos/image (5).png", content: "Er zijn veel verschillende foodtrucks en bars aanwezig. Van friet tot vegan, voor ieder wat wils!" }
};

document.querySelectorAll('.clickable-news').forEach(item => {
    item.addEventListener('click', (e) => {
        const newsKey = e.currentTarget.getAttribute('data-news');
        const news = newsData[newsKey];
        document.getElementById('news-detail-title').textContent = news.title;
        document.getElementById('news-detail-img').src = news.img;
        document.getElementById('news-detail-content').textContent = news.content;
        document.getElementById('page-home').style.display = 'none';
        document.getElementById('page-news-detail').style.display = 'block';
    });
});

document.getElementById('back-to-schedule').addEventListener('click', () => {
    document.getElementById('page-artist-info').style.display = 'none';
    document.getElementById('page-schedule').style.display = 'block';
});

document.getElementById('back-to-home').addEventListener('click', () => {
    document.getElementById('page-news-detail').style.display = 'none';
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