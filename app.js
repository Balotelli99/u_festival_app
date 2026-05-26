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
langBtn.addEventListener('click', () => {
    const isNL = langBtn.textContent === '🇳🇱';
    langBtn.textContent = isNL ? '🇬🇧' : '🇳🇱';
    
    // Titels simpel aanpassen
    document.getElementById('t-home').textContent = isNL ? 'News' : 'Nieuws';
    document.getElementById('t-info').textContent = isNL ? 'Information' : 'Informatie';
    document.getElementById('t-sched').textContent = isNL ? 'Schedule' : 'Programma';
    document.getElementById('t-map').textContent = isNL ? 'Festival Map' : 'Plattegrond';
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