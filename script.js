document.addEventListener('DOMContentLoaded', function () {
    const weatherCardsContainer = document.getElementById('weather-cards-container');
    const locationDataContainer = document.getElementById('loc-data-container');
    const searchButton = document.getElementById('search-button');
    const cityInput = document.getElementById('city-input');
    const realtimeCheckbox = document.getElementById('realtime-checkbox');
    const modal = document.getElementById('weather-modal');
    const modalContent = document.getElementById('modal-details');
    const span = document.getElementsByClassName('close')[0];

    // 7 Dana vreme
    function fetchForecast(city) {
        const apiKey = 'adcd72d582b04ee79f794650241405';
        const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&lang=sr`;

        fetchWeatherData(url);
    }

    // Trenutno vreme
    function fetchRealtimeWeather(city) {
        const apiKey = 'adcd72d582b04ee79f794650241405';
        const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=sr`;

        fetchWeatherData(url);
    }


    function fetchWeatherData(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                weatherCardsContainer.innerHTML = ''; // Ciscenje prethodnih rezultata
                locationDataContainer.innerHTML = '';
                const location = data.location;

                renderLocation(location);

                if (realtimeCheckbox.checked) {
                    const weatherData = data.current;
                    renderRealtimeWeather(weatherData);
                } else {
                    const forecast = data.forecast.forecastday;
                    forecast.forEach(day => {
                        const date = new Date(day.date).toDateString();
                        const temperature = day.day.avgtemp_c;
                        const description = day.day.condition.text;
                        const iconUrl = `https:${day.day.condition.icon}`;

                        renderWeatherCard(date, temperature, description, iconUrl, day);

                    });
                }
            })
            .catch(error => {
                weatherCardsContainer.innerHTML = '<p>Greška u učitavanju podataka.</p>';
                console.error('Error fetching weather data:', error);
            });
    }

    // Prikaz kartice za trenutno vreme
    function renderRealtimeWeather(data) {
        const lastUpdated = data.last_updated;
        const temperature = data.temp_c;
        const feelsLike = data.feelslike_c;
        const condition = data.condition.text;
        const conditionIcon = `https:${data.condition.icon}`;
        const windSpeed = data.wind_kph;
        const humidity = data.humidity;
        const uvIndex = data.uv;

        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card-realtime';
        weatherCard.innerHTML = `
            <img class="weather-icon" src="${conditionIcon}" alt="Weather icon">
            <div class="weather-details">
                <p>Poslednja izmena: ${lastUpdated}</p>
                <p>Temperatura: ${temperature}°C</p>
                <p>Oseća se kao: ${feelsLike}°C</p>
                <p>Stanje: ${condition}</p>
                <p>Brzina vetra: ${windSpeed} km/h</p>
                <p>Vlažnost: ${humidity}%</p>
                <p>UV Index: ${uvIndex}</p>
            </div>
        `;
        weatherCardsContainer.appendChild(weatherCard);
    }

        //Prikaz lokacije
    function renderLocation(location) {
        const locationDiv = document.createElement('div');
        locationDiv.innerHTML = `
            <p>${location.name} | ${location.region} | ${location.country}</p>
        `;
        locationDataContainer.appendChild(locationDiv);
    }

    //Prikaz kartice 7 dana
    function renderWeatherCard(date, temperature, description, iconUrl, dayData) {
        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';
        weatherCard.innerHTML = `
            <img class="weather-icon" src="${iconUrl}" alt="Weather icon">
            <div class="weather-details">
                <p>${date}</p>
                <p>Temperatura: ${temperature}°C</p>
                <p>Stanje: ${description}</p>
            </div>
        `;
        weatherCard.addEventListener('click', () => showWeatherDetails(dayData));
        weatherCardsContainer.appendChild(weatherCard);
    }

    // Dodavanje elemenata u modal
    function showWeatherDetails(dayData) {
        const maxTemp = dayData.day.maxtemp_c;
        const avgTemp = dayData.day.avgtemp_c;
        const minTemp = dayData.day.mintemp_c;
        const humidity = dayData.day.avghumidity;
        const uvIndex = dayData.day.uv;
        const chanceOfRain = dayData.day.daily_chance_of_rain;
        const hourlyForecast = dayData.hour.map(hour => {
            const time = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temp = hour.temp_c;
            const condition = hour.condition.text;
            const iconUrl = `https:${hour.condition.icon}`;
            return `<div class="hourly-forecast">
                        <p>${time}</p>
                        <img class="weather-icon-small" src="${iconUrl}" alt="Weather icon">
                        <p>${temp}°C</p>
                        <p>${condition}</p>
                    </div>`;
        }).join('');

        modalContent.innerHTML = `
            <h2>Detaljne informacije o vremenu</h2>
            <p>Maksimalna temperatura: ${maxTemp}°C</p>
            <p>Prosečna temperatura: ${avgTemp}°C</p>
            <p>Minimalna temperatura: ${minTemp}°C</p>
            <p>Vlažnost: ${humidity}%</p>
            <p>UV Index: ${uvIndex}</p>
            <p>Šansa za kišu: ${chanceOfRain}%</p>
            <h3>Prognoza po satima</h3>
            <div class="hourly-forecast-container">${hourlyForecast}</div>
        `;
        modal.style.display = 'block';
    }

    // Modal close
    span.onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Search button, fetch podatke za vreme
    searchButton.addEventListener('click', function () {
        const city = cityInput.value;
        if (city) {
            if (realtimeCheckbox.checked) {
                fetchRealtimeWeather(city);
            } else {
                fetchForecast(city);
            }
        }
    });

    // Checkbox za trenutno vreme
    realtimeCheckbox.addEventListener('change', function () {
        const city = cityInput.value;
        if (city) {
            if (realtimeCheckbox.checked) {
                fetchRealtimeWeather(city);
            } else {
                fetchForecast(city);
            }
        }
    });
});
