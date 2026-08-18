const searchForm = document.querySelector("#searchForm");
const cityInput = document.querySelector("#cityInput");
const searchButton = document.querySelector("#searchButton");

const statusMessage = document.querySelector("#status");
const errorMessage = document.querySelector("#error");
const dashboard = document.querySelector("#weatherDashboard");

const locationName = document.querySelector("#locationName");
const locationDetails = document.querySelector("#locationDetails");
const weatherIcon = document.querySelector("#weatherIcon");
const temperature = document.querySelector("#temperature");
const condition = document.querySelector("#condition");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");
const feelsLike = document.querySelector("#feelsLike");
const forecastContainer = document.querySelector("#forecast");

const GEOCODING_API =
  "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
  "https://api.open-meteo.com/v1/forecast";


const weatherDescriptions = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  48: ["Rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  53: ["Moderate drizzle", "🌦️"],
  55: ["Dense drizzle", "🌧️"],
  61: ["Slight rain", "🌦️"],
  63: ["Moderate rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],
  71: ["Slight snow", "🌨️"],
  73: ["Moderate snow", "🌨️"],
  75: ["Heavy snow", "❄️"],
  80: ["Rain showers", "🌦️"],
  81: ["Moderate rain showers", "🌧️"],
  82: ["Heavy rain showers", "⛈️"],
  85: ["Snow showers", "🌨️"],
  86: ["Heavy snow showers", "❄️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with hail", "⛈️"],
  99: ["Heavy thunderstorm with hail", "⛈️"]
};


function getWeatherDescription(code) {
  return weatherDescriptions[code] || [
    "Unknown conditions",
    "🌡️"
  ];
}


function formatDate(dateString) {
  return new Date(
    `${dateString}T00:00:00`
  ).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}


function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}


function clearError() {
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}


function setLoading(isLoading) {
  searchButton.disabled = isLoading;

  searchButton.textContent =
    isLoading ? "Loading..." : "Search";
}


async function fetchJson(url) {

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}.`
    );
  }

  return response.json();
}


async function findCity(city) {

  const params = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json"
  });

  const data = await fetchJson(
    `${GEOCODING_API}?${params}`
  );

  if (!data.results || data.results.length === 0) {
    throw new Error(
      `No city found for "${city}". Try another city name.`
    );
  }

  return data.results[0];
}


async function fetchWeather(latitude, longitude) {

  const params = new URLSearchParams({
    latitude: latitude,
    longitude: longitude,

    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",

    daily:
      "weather_code,temperature_2m_max,temperature_2m_min",

    forecast_days: "5",

    timezone: "auto",

    temperature_unit: "celsius",

    wind_speed_unit: "kmh"
  });

  return fetchJson(
    `${WEATHER_API}?${params}`
  );
}


function renderCurrentWeather(city, weather) {

  const current = weather.current;

  const units = weather.current_units;

  const [description, icon] =
    getWeatherDescription(
      current.weather_code
    );


  locationName.textContent = city.name;


  const regionParts = [
    city.admin1,
    city.country
  ].filter(Boolean);


  locationDetails.textContent =
    `${regionParts.join(", ")} • Updated ${new Date(
      current.time
    ).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    })}`;


  weatherIcon.textContent = icon;


  temperature.textContent =
    `${Math.round(current.temperature_2m)}${units.temperature_2m}`;


  condition.textContent = description;


  humidity.textContent =
    `${current.relative_humidity_2m}${units.relative_humidity_2m}`;


  windSpeed.textContent =
    `${Math.round(current.wind_speed_10m)} ${units.wind_speed_10m}`;


  feelsLike.textContent =
    `${Math.round(current.apparent_temperature)}${units.apparent_temperature}`;
}


function renderForecast(weather) {

  const daily = weather.daily;


  const cards = daily.time.map(
    (date, index) => {

      const [
        description,
        icon
      ] = getWeatherDescription(
        daily.weather_code[index]
      );


      return `
        <article class="forecast-card">

          <div class="day">
            ${formatDate(date)}
          </div>

          <div class="icon">
            ${icon}
          </div>

          <div class="condition">
            ${description}
          </div>

          <div class="temps">

            <span class="high">
              ${Math.round(
                daily.temperature_2m_max[index]
              )}°
            </span>

            <span class="low">
              ${Math.round(
                daily.temperature_2m_min[index]
              )}°
            </span>

          </div>

        </article>
      `;
    }
  );


  forecastContainer.innerHTML =
    cards.join("");
}


async function searchWeather(city) {

  clearError();

  dashboard.hidden = true;

  statusMessage.textContent =
    `Searching for ${city}...`;

  setLoading(true);


  try {

    // Convert city name into latitude and longitude
    const location =
      await findCity(city);


    statusMessage.textContent =
      `Getting live weather for ${location.name}...`;


    // Get weather using the coordinates
    const weather =
      await fetchWeather(
        location.latitude,
        location.longitude
      );


    renderCurrentWeather(
      location,
      weather
    );


    renderForecast(weather);


    dashboard.hidden = false;


    statusMessage.textContent =
      "Weather updated successfully.";

  }

  catch (error) {

    console.error(
      "Weather dashboard error:",
      error
    );


    if (error instanceof TypeError) {

      showError(
        "Network error. Check your internet connection and try again."
      );

    } else {

      showError(error.message);

    }


    statusMessage.textContent = "";

  }

  finally {

    setLoading(false);

  }
}


searchForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const city =
      cityInput.value.trim();


    if (!city) {

      showError(
        "Please enter a city name."
      );

      cityInput.focus();

      return;
    }


    await searchWeather(city);

  }
);


// Load a default city when the page opens
searchWeather("Bengaluru");
