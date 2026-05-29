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

document.getElementById('back-to-home').addEventListener('click', () => {
    document.getElementById('page-news-detail').style.display = 'none';
    document.getElementById('page-home').style.display = 'block';
});

// 6. Schedule Grid Data (Gekoppeld aan de afbeelding)
const scheduleData = [
    { start: '10:00', end: '11:00', artist: 'Armin van Buuren', stage: 'Pôton' },
    { start: '12:00', end: '13:00', artist: 'Kensington', stage: 'Pôton' },
    { start: '14:00', end: '15:00', artist: 'De Staat', stage: 'Pôton' },
    
    { start: '10:00', end: '11:00', artist: 'Talent set 1', stage: 'The Lake' },
    { start: '11:00', end: '12:00', artist: 'Talent set 2', stage: 'The Lake' },
    { start: '12:30', end: '13:30', artist: 'Talent set 3', stage: 'The Lake' },
    { start: '14:00', end: '15:00', artist: 'Talent set 4', stage: 'The Lake' },
    
    { start: '10:30', end: '11:30', artist: 'Comedy', stage: 'The Club' },
    { start: '12:00', end: '13:00', artist: 'Lecture', stage: 'The Club' },
    { start: '13:45', end: '14:45', artist: 'Theater', stage: 'The Club' }
];

// Tijdsblokken genereren per 15 minuten (10:00 t/m 15:00)
function generateTimeSlots() {
    const slots = [];
    let hour = 10;
    let min = 0;
    
    while (hour < 15 || (hour === 15 && min === 0)) {
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

function initScheduleGrid() {
    const grid = document.getElementById('schedule-grid');
    grid.innerHTML = '';
    
    const timeSlots = generateTimeSlots();
    const stages = ['Pôton', 'The Lake', 'The Club'];
    
    // Grid-indeling configureren
    grid.style.gridTemplateColumns = `100px repeat(${timeSlots.length}, 85px)`;
    grid.style.gridTemplateRows = `45px repeat(${stages.length}, 90px)`;
    
    // Links-boven cel: "Locatie"
    const corner = document.createElement('div');
    corner.className = 'stage-header corner-sticky';
    corner.textContent = 'Locatie';
    grid.appendChild(corner);
    
    // Tijd headers aanmaken
    timeSlots.forEach(time => {
        const div = document.createElement('div');
        div.className = 'time-header';
        div.textContent = time;
        grid.appendChild(div);
    });
    
    // Rijen bouwen per stage
    stages.forEach((stage, stageIndex) => {
        const gridRow = stageIndex + 2; 
        
        // Stage naam (Sticky links)
        const stageDiv = document.createElement('div');
        stageDiv.className = 'stage-header stage-sticky';
        stageDiv.style.gridRow = gridRow;
        stageDiv.style.gridColumn = 1;
        stageDiv.textContent = stage;
        grid.appendChild(stageDiv);
        
        const stageActs = scheduleData.filter(a => a.stage === stage);
        
        // Blokken plaatsen
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
            
            block.addEventListener('click', () => toggleFavorite(block, act.artist));
            grid.appendChild(block);
        });
        
        // Achtergrond gridlijnen vullen voor lege vakken
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

document.addEventListener('DOMContentLoaded', () => {
    initScheduleGrid();
});