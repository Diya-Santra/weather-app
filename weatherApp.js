const defaultWeather = document.querySelector(".weather-card");
const defaultCity = document.querySelector("#cityName");
const defaultTemp = document.querySelector("#temperature");
const defaultHUm = document.querySelector("#humidity");
const defaultWind = document.querySelector("#wind");
const defaultPress = document.querySelector("#pressure");
const defaultDes = document.querySelector("#description");
const defaultIcon = document.querySelector("#defaultIcon");

const searchedWeather = document.querySelector("#searchResult");
const searchedCity = document.querySelector("#searchCity");
const searchedTemp = document.querySelector("#searchTemp");
const searchedHum = document.querySelector("#searchHum");
const searchedPres = document.querySelector("#searchPress");
const searchedDes = document.querySelector("#searchDesc");
const searchedWind = document.querySelector("#searchWind");

const cityInp = document.querySelector("#inputCity");
const searchBtn = document.querySelector("#submit");

const closeButton = document.querySelector("#closeBtn");
const homeIcon = document.querySelector("#homeIcon");
const searchIcon = document.querySelector("#searchIcon");

document.addEventListener("DOMContentLoaded", () => {
  getLocation();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

async function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=2f82f7220538dedc2047328f47ac0229`
  );
  const body = await res.json();
  defaultCity.innerHTML = `${body.name}`;
  defaultTemp.innerHTML = `${(body.main.temp - 273.15).toFixed(2)} °C`;
  defaultHUm.innerHTML = `<div style="text-align:center">
    <img src="assetsWeather/humidity.svg"/>
    <p>${body.main.humidity}%</p>
  </div>`;
  defaultWind.innerHTML = `<div style="text-align:center">
    <img src="assetsWeather/wind.svg"/>
    <p>${body.wind.speed} m/s</p>
  </div>
`;
  defaultPress.innerHTML = `<div style="text-align:center">
    <img src="assetsWeather/pressure.png"/>
    <p>${body.main.pressure} hPa</p>
  </div>
`;
  defaultDes.innerHTML = `${body.weather[0].description}`;

  const iconPath = getWeatherIcon(body.weather[0].main);
  homeIcon.src = iconPath;
}
function error() {
  alert("Sorry, no position available.");
}

searchBtn.addEventListener("click", () => {
  const city = cityInp.value.trim();
  if (city !== "") {
    getByCity(city);
    searchedWeather.style.display = "block";
    defaultWeather.style.display = "none";
  }
});

cityInp.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    const city = cityInp.value.trim();
    if (city !== "") {
      getByCity(city);
      searchedWeather.style.display = "block";
      defaultWeather.style.display = "none";
    }
  }
});

async function getByCity(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2f82f7220538dedc2047328f47ac0229`
  );
  const body = await res.json();
  searchedCity.innerHTML = `${body.name}`;
  searchedTemp.innerHTML = `${(body.main.temp - 273.15).toFixed(2)}°C`;
  searchedHum.innerHTML = `<div style="text-align:center">
    <img src="assetsWeather/humidity.svg"/>
    <p>${body.main.humidity}%</p>
  </div>`;
  searchedWind.innerHTML = `<div style="text-align:center">
    <img src="assetsWeather/wind.svg"/>
    <p>${body.wind.speed} m/s</p>
  </div>
`;
  searchedPres.innerHTML = `<div style="text-align:center">
    <img src="assetsWeather/pressure.png"/>
    <p>${body.main.pressure} hPa</p>
  </div>
`;
  searchedDes.innerHTML = `${body.weather[0].description}`;

  const iconPath = getWeatherIcon(body.weather[0].main);
  searchIcon.src = iconPath;
}
function getWeatherIcon(condition) {
  switch (condition) {
    case "Clouds":
      return "assetsWeather/cloudy.svg";
    case "Clear":
      return "assetsWeather/clear-day.svg";
    case "Rain":
      return "assetsWeather/rain.svg";
    case "Drizzle":
      return "assetsWeather/drizzle.svg";
    case "Mist":
      return "assetsWeather/mist.svg";
    default:
      return "assetsWeather/default.svg";
  }
}

document.getElementById("backBtn").addEventListener("click", () => {
  document.getElementById("searchResult").style.display = "none";
  defaultWeather.style.display = "block";
  cityInp.value = "";
});


