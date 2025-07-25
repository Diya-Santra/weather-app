// DOM Elements for the default weather card (initial display)
const homeWeatherCard = document.getElementById("homeWeatherCard");
const homeWeatherIcon = document.getElementById("homeWeatherIcon");
const homeCityName = document.getElementById("homeCityName");
const homeTemperature = document.getElementById("homeTemperature");
const homeDescription = document.getElementById("homeDescription");

// Select the specific span elements within the info boxes for default card
const homeHumidityValue = document.querySelector("#homeHumidity .info-value");
const homeWindValue = document.querySelector("#homeWind .info-value");
const homePressureValue = document.querySelector("#homePressure .info-value");

// DOM Elements for the search result weather card
const searchWeatherCard = document.getElementById("searchWeatherCard");
const searchWeatherIcon = document.getElementById("searchWeatherIcon");
const searchCityName = document.getElementById("searchCityName");
const searchTemperature = document.getElementById("searchTemperature");
const searchDescription = document.getElementById("searchDescription");

// Select the specific span elements within the info boxes for search card
const searchHumidityValue = document.querySelector("#searchHumidity .info-value");
const searchWindValue = document.querySelector("#searchWind .info-value");
const searchPressureValue = document.querySelector("#searchPressure .info-value");

// Input and Button Elements
const cityInput = document.getElementById("inputCity");
const submitButton = document.getElementById("submitBtn"); // Corrected ID from 'submit'

// Back Button for search result card
const backButton = document.getElementById("backBtn");

// Event listener to get user's location on page load
document.addEventListener("DOMContentLoaded", () => {
    getLocation();
});

// Function to get user's geographical location
function getLocation() {
    if (navigator.geolocation) {
        const options = {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes cache
        };
        navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
        console.log("Geolocation is not supported by this browser.");
        // Fallback to a default city if geolocation is not supported
        getByCity("howrah", 'default'); // Set your default city here
    }
}

// Callback function for successful geolocation
async function success(position) {
    try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const apiKey = "24fc44f361822bee693445fac7a763d6"; // Your OpenWeatherMap API Key
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const weatherData = await response.json();
        displayWeatherData(weatherData, 'default');
    } catch (error) {
        console.error('Error fetching weather data based on location:', error);
        alert('Could not fetch weather for your location. Showing weather for a default city.');
        // Fallback to a default city if location-based weather fails
        getByCity("Berhampore", 'default'); // Set your default city here
    }
}

// Function to display weather data on the UI
function displayWeatherData(data, cardType) {
    const isDefaultCard = cardType === 'default';

    // Select the correct set of elements based on the cardType
    const iconElement = isDefaultCard ? homeWeatherIcon : searchWeatherIcon;
    const cityNameElement = isDefaultCard ? homeCityName : searchCityName;
    const temperatureElement = isDefaultCard ? homeTemperature : searchTemperature;
    const descriptionElement = isDefaultCard ? homeDescription : searchDescription;
    const humidityValueElement = isDefaultCard ? homeHumidityValue : searchHumidityValue;
    const windValueElement = isDefaultCard ? homeWindValue : searchWindValue;
    const pressureValueElement = isDefaultCard ? homePressureValue : searchPressureValue;

    // Populate the elements with data
    cityNameElement.textContent = data.name;
    temperatureElement.textContent = `${(data.main.temp - 273.15).toFixed(1)}°C`; // Convert Kelvin to Celsius, one decimal place
    descriptionElement.textContent = data.weather[0].description;
    humidityValueElement.textContent = `${data.main.humidity}%`;
    windValueElement.textContent = `${data.wind.speed.toFixed(1)} m/s`; // One decimal for wind speed
    pressureValueElement.textContent = `${data.main.pressure} hPa`;

    // Set weather icon
    const iconPath = getWeatherIcon(data.weather[0].main);
    iconElement.src = iconPath;
    iconElement.alt = data.weather[0].description + " icon"; // Add meaningful alt text
}

// Callback function for geolocation errors
function error(geoError) {
    console.error('Geolocation error:', geoError);
    let errorMessage = "Unable to get your location. ";

    switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
            errorMessage += "Location access denied by user.";
            break;
        case geoError.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
        case geoError.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
        default:
            errorMessage += "An unknown error occurred.";
            break;
    }

    console.log(errorMessage + " Showing weather for Berhampore instead.");
    alert(errorMessage + " Showing weather for Berhampore instead.");
    // Fallback to a default city
    getByCity("Berhampore", 'default'); // Set your default city here
}

// Event listener for the search button click
submitButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getByCity(city, 'search');
    } else {
        alert("Please enter a city name.");
    }
});

// Event listener for Enter key in the city input
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { // Use event.key for better readability
        event.preventDefault(); // Prevent form submission
        const city = cityInput.value.trim();
        if (city) {
            getByCity(city, 'search');
        } else {
            alert("Please enter a city name.");
        }
    }
});

// Function to fetch weather data by city name
async function getByCity(city, cardType) {
    try {
        const apiKey = "24fc44f361822bee693445fac7a763d6"; // Your OpenWeatherMap API Key
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );

        if (!response.ok) {
            let errorMsg = `Error fetching weather data for ${city}: `;
            if (response.status === 404) {
                errorMsg += "City not found. Please check the spelling.";
            } else if (response.status === 401) {
                errorMsg += "Invalid API key or unauthorized request.";
            } else if (response.status === 429) {
                errorMsg += "Too many requests. Please try again later.";
            } else {
                errorMsg += `HTTP error! Status: ${response.status}`;
            }
            throw new Error(errorMsg);
        }

        const weatherData = await response.json();
        displayWeatherData(weatherData, cardType);

        // Manage card visibility based on success and cardType
        if (cardType === 'search') {
            homeWeatherCard.style.display = "none";
            searchWeatherCard.style.display = "block";
        } else {
            // If it's the default card, ensure it's visible and search card is hidden
            homeWeatherCard.style.display = "block";
            searchWeatherCard.style.display = "none";
        }

    } catch (error) {
        console.error(error);
        alert(`Failed to get weather data: ${error.message}`);
        // Ensure default card is visible if search fails and it wasn't already default
        if (cardType === 'search' && homeWeatherCard.style.display === "none") {
             homeWeatherCard.style.display = "block";
             searchWeatherCard.style.display = "none";
        }
    }
}

// Function to determine weather icon based on weather condition
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
        case "Fog":
        case "Haze":
        case "Smoke":
        case "Sand":
        case "Dust":
        case "Ash":
            return "assetsWeather/mist.svg"; // Group similar conditions to mist
        case "Snow":
            return "assetsWeather/snow.svg";
        case "Thunderstorm":
            return "assetsWeather/thunderstorms.svg";
        default:
            return "assetsWeather/default.svg"; // A generic default icon
    }
}

// Event listener for the back button on the search result card
backButton.addEventListener("click", () => {
    searchWeatherCard.style.display = "none";
    homeWeatherCard.style.display = "block";
    cityInput.value = ""; // Clear the input field
});