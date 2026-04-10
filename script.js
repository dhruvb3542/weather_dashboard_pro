const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const errorMsg = document.getElementById('error-msg');
const fxContainer = document.getElementById('weather-background-fx');

// Main Function to Fetch Weather
async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    // Reset UI for loading
    errorMsg.style.display = 'none';
    searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    try {
        const response = await fetch('/get_weather', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city: city })
        });

        const data = await response.json();

        if (response.ok) {
            updateUI(data);
        } else {
            errorMsg.style.display = 'block';
            searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
        }
    } catch (err) {
        console.error("Error fetching data:", err);
        searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    }
}

// Function to Update Dashboard and Animations
function updateUI(data) {
    const card = document.getElementById('weatherCard');
    const weatherMain = data.weather[0].main; 

    // 1. Clear previous background animations
    fxContainer.innerHTML = '';
    
    // 2. Trigger Advanced Background Effects
    if (weatherMain === "Rain" || weatherMain === "Drizzle" || weatherMain === "Thunderstorm") {
        createRain();
        document.body.style.background = "linear-gradient(to bottom, #203a43, #2c5364)";
    } else if (weatherMain === "Clear") {
        createSun();
        document.body.style.background = "linear-gradient(to bottom, #4facfe, #00f2fe)";
    } else if (weatherMain === "Clouds") {
        document.body.style.background = "linear-gradient(to bottom, #bdc3c7, #2c3e50)";
    } else {
        document.body.style.background = "linear-gradient(-45deg, #1e3c72, #2a5298, #0f2027)";
    }

    // 3. Smooth UI Update Animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    setTimeout(() => {
        // Update Text Info
        document.getElementById('cityName').innerText = `${data.name}, ${data.sys.country}`;
        document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
        document.getElementById('description').innerText = data.weather[0].description;
        document.getElementById('humidity').innerText = `${data.main.humidity}%`;
        document.getElementById('wind').innerText = `${data.wind.speed} m/s`;
        document.getElementById('pressure').innerText = `${data.main.pressure} hPa`;
        
        // Update Weather Icon
        const iconCode = data.weather[0].icon;
        document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        
        // Update Date
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        document.getElementById('dateTime').innerText = now.toLocaleDateString('en-US', options);

        // Fade back in
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    }, 300);
}

// --- ANIMATION HELPER FUNCTIONS ---

function createRain() {
    for (let i = 0; i < 120; i++) {
        const drop = document.createElement('div');
        drop.className = 'drop';
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = Math.random() * 0.5 + 0.5 + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        fxContainer.appendChild(drop);
    }
}

function createSun() {
    const sun = document.createElement('div');
    sun.className = 'sunny-glow';
    fxContainer.appendChild(sun);
}

// --- EVENT LISTENERS ---

searchBtn.addEventListener('click', getWeather);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Load a default city on startup (Optional)
window.onload = () => {
    cityInput.value = 'Delhi';
    getWeather();
};