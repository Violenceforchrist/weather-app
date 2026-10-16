    // ---- Generate snow ----
    function generateSnow() {
      const snow = document.getElementById('snow');
      snow.innerHTML = '';
      for (let i = 0; i < 40; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        flake.textContent = '❄';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.animationDuration = (Math.random() * 4 + 3) + 's';
        flake.style.animationDelay = (Math.random() * 5) + 's';
        flake.style.fontSize = (Math.random() * 10 + 8) + 'px';
        snow.appendChild(flake);
      }
    }

    // ---- Generate wind/leaves ----
    function generateWind() {
      const wind = document.getElementById('wind');
      wind.innerHTML = '';
      const items = ['🍃', '🍂', '🍁'];
      for (let i = 0; i < 15; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        leaf.textContent = items[Math.floor(Math.random() * items.length)];
        leaf.style.top = Math.random() * 100 + '%';
        leaf.style.animationDuration = (Math.random() * 4 + 3) + 's';
        leaf.style.animationDelay = (Math.random() * 5) + 's';
        wind.appendChild(leaf);
      }
    }

    // ---- Generate stars ----
    function generateStars() {
      const stars = document.getElementById('stars');
      stars.innerHTML = '';
      for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 60 + '%';
        star.style.animationDuration = (Math.random() * 3 + 1) + 's';
        star.style.animationDelay = (Math.random() * 3) + 's';
        stars.appendChild(star);
      }
    }

    // ---- Clear all effects ----
    function clearEffects() {
      document.getElementById('snow').innerHTML = '';
      document.getElementById('wind').innerHTML = '';
      document.getElementById('stars').innerHTML = '';
      document.body.style.setProperty('--weather-overlay', 'rgba(5, 15, 22, 0.18)');
      document.getElementById('sun').style.display = 'none';
      document.getElementById('lightning').style.animation = 'none';
    }

    // ---- Apply weather effects ----
    function applyWeatherEffects(weatherMain, temp, isNight) {
      clearEffects();
      const body = document.body;
      const w = weatherMain.toLowerCase();

      if (isNight) {
        body.style.setProperty('--weather-overlay', 'rgba(8, 13, 38, 0.42)');
        generateStars();
      }

      if (w.includes('rain') || w.includes('drizzle') || w.includes('thunderstorm')) {
        body.style.setProperty('--weather-overlay', 'rgba(9, 21, 32, 0.43)');
        if (w.includes('thunderstorm')) {
          document.getElementById('lightning').style.animation = 'flash 4s infinite';
        }
      } else if (w.includes('snow')) {
        body.style.setProperty('--weather-overlay', 'rgba(73, 103, 130, 0.28)');
        generateSnow();
      } else if (w.includes('clear') && !isNight) {
        body.style.setProperty('--weather-overlay', 'rgba(229, 154, 66, 0.17)');
        const sun = document.getElementById('sun');
        sun.style.display = 'block';
        // Add sun rays
        sun.innerHTML = '';
        for (let i = 0; i < 12; i++) {
          const ray = document.createElement('div');
          ray.classList.add('sun-ray');
          const angle = i * 30;
          const length = 40 + Math.random() * 10;
          ray.style.cssText = `
            width: 4px; height: ${length}px; border-radius: 2px;
            background: rgba(255,220,50,0.6);
            position: absolute; top: 50%; left: 50%;
            transform-origin: top left;
            transform: rotate(${angle}deg) translateX(-2px);
          `;
          sun.appendChild(ray);
        }
      } else if (w.includes('cloud') || w.includes('mist') || w.includes('fog') || w.includes('haze')) {
        body.style.setProperty('--weather-overlay', 'rgba(49, 54, 58, 0.31)');
      } else if (w.includes('wind')) {
        body.style.setProperty('--weather-overlay', 'rgba(41, 67, 82, 0.28)');
        generateWind();
      }

      // Temperature color
      const tempEl = document.getElementById('temp');
      if (temp <= 0) tempEl.style.color = '#a8d8ea';
      else if (temp <= 15) tempEl.style.color = '#00bcd4';
      else if (temp <= 25) tempEl.style.color = '#4caf50';
      else if (temp <= 35) tempEl.style.color = '#ff9800';
      else tempEl.style.color = '#f44336';
    }

    // ---- Fetch weather ----
    async function getWeather() {
      const city = document.getElementById('cityInput').value.trim();
      const loading = document.getElementById('loading');
      const error = document.getElementById('error');
      if (city === '') {
        error.textContent = 'Please enter a city name.';
        error.classList.add('show');
        return;
      }
      const weatherCard = document.getElementById('weatherCard');
      loading.classList.add('show');
      error.classList.remove('show');
      weatherCard.classList.remove('show');
      try {
        const response = await fetch('/api/weather?city=' + encodeURIComponent(city));
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to fetch weather right now.');

        const temp = Math.round(data.main.temp);
        const weatherMain = data.weather[0].main;
        const sunrise = data.sys.sunrise;
        const sunset = data.sys.sunset;
        const currentTime = data.dt;
        const isNight = currentTime < sunrise || currentTime > sunset;

        document.getElementById('cityName').textContent = data.name;
        document.getElementById('country').textContent = data.sys.country;
        document.getElementById('temp').textContent = temp + '°C';
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like) + '°C';
        document.getElementById('humidity').textContent = data.main.humidity + '%';
        document.getElementById('wind-speed').textContent = data.wind.speed + ' m/s';
        document.getElementById('pressure').textContent = data.main.pressure + ' hPa';

        applyWeatherEffects(weatherMain, temp, isNight);
        weatherCard.classList.add('show');

      } catch (err) {
        error.textContent = err.message || 'Network error. Check your connection.';
        error.classList.add('show');
      } finally {
        loading.classList.remove('show');
      }
    }

    document.getElementById('searchForm').addEventListener('submit', function(event) {
      event.preventDefault();
      getWeather();
    });