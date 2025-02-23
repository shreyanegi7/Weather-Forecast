const apiKey = "9019e42591e2474a97094215252202"; 

function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const weatherDiv = document.getElementById("weatherResult");

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Invalid city name. Please enter a valid city.");
            } else {
                displayWeather(data);
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Network error. Please try again.");
        });
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5&aqi=no&alerts=no`;

                fetch(url)
                    .then(response => response.json())
                    .then(data => displayWeather(data))
                    .catch(error => {
                        console.error("Error fetching data:", error);
                        alert("Network error. Please try again.");
                    });
            },
            () => {
                alert("Location access denied. Please enter a city manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

function displayWeather(data) {
    const weatherDiv = document.getElementById("weatherResult");

    let weatherHTML = `
        <div class="mt-4 bg-gray-100 p-4 rounded-lg text-center shadow">
            <h2 class="text-xl font-bold">${data.location.name}, ${data.location.country}</h2>
            <p class="text-lg">${data.current.temp_c}°C | ${data.current.condition.text}</p>
            <img src="https:${data.current.condition.icon}" alt="Weather Icon" class="mx-auto">
            <p>Wind: ${data.current.wind_kph} KPH</p>
            <p>Humidity: ${data.current.humidity}%</p>
        </div>
        
        <h3 class="text-lg font-semibold mt-4">5-Day Forecast</h3>
        <div class="forecast-container flex overflow-x-auto mt-2 gap-4">
    `;

    data.forecast.forecastday.forEach(day => {
        weatherHTML += `
            <div class="bg-white p-4 rounded-lg shadow text-center w-40">
                <p class="font-bold">${day.date}</p>
                <p>${day.day.avgtemp_c}°C</p>
                <img src="https:${day.day.condition.icon}" alt="Weather Icon" class="mx-auto">
                <p>${day.day.condition.text}</p>
                <p>Wind: ${day.day.maxwind_kph} KPH</p>
                <p>Humidity: ${day.day.avghumidity}%</p>
            </div>
        `;
    });

    weatherHTML += `</div>`;

    weatherDiv.innerHTML = weatherHTML;
}
