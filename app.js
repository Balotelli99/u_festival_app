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

// 5. News Detail Click Handler
const newsData = {
    welcome: { title: "Welkom bij ❤️U!", img: "fotos/image (1).png", content: "De eerste meldingen verschijnen hier tijdens het festival. Welkom op het ❤️U Festival app!" },
    lineup: { title: "Line-up 2024", img: "fotos/image (2).png", content: "Topartiesten als Armin van Buuren, Martin Garrix, Hardwell, Nicky Romero en W&W staan op het programma." },
    location: { title: "Locatie Strijkviertel", img: "fotos/image (3).png", content: "Het festival plaatsvindt op het mooie Strijkviertel in Utrecht. Een prachtig park met diverse podiums." },
    tickets: { title: "Tickets Nu Beschikbaar", img: "fotos/image (4).png", content: "Koop nu je tickets voor een onvergetelijke dag! Early bird prijzen beschikbaar tot 31 december." },
    food: { title: "Food & Drinks", img: "fotos/image (5).png", content: "Haarveel verschillende food trucks en drinks aanwezig. Van friet tot vegan, iets voor iedereen!" }
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