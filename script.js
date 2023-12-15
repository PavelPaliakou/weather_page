const API = "fc64772cf5eaa5ce9a95538e6776eef1";
let latitude = 0;
let longitude = 0;
let searchCity = "";
let searchRequest = "";

//Errors elements
const errorContainerElement = document.getElementById("error-container");
const errorMessageElement = document.getElementById("error-message");

//Browser geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    fetchData();
  });
} else {
  errorContainerElement.style.display = "flex";
  errorMessageElement.innerText = "Geolocation is not supported by this browser.";
}

//Search
const searchInputElement = document.getElementById("search-input");
searchInputElement.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    searchCity = e.target.value;
    searchRequest = `http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&limit=1&appid=${API}`
    fetchData();
  }
});

async function fetchData() {
  //Search
  if (searchRequest) {
    const searchResponse = await fetch(searchRequest);
    const searchData = await searchResponse.json();

    if (!searchData[0]) {
      errorContainerElement.style.display = "flex";
      errorMessageElement.innerText = "City " + searchCity + " not found";
    } else {
      errorContainerElement.style.display = "none";
      latitude = searchData[0].lat;
      longitude = searchData[0].lon;
    }
  }

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${API}`);
  const data = await response.json();
  
  const airResponse = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API}`);
  const airData = await airResponse.json();


  //header
  let city = data.name;
  document.getElementById("header-city").innerText = city;

  let currentTemperature = data.main.temp;
  document.getElementById("header-temperature").innerText = currentTemperature + "°C";

  let icon = data.weather[0].icon;
  document.getElementById("header-weather-icon").setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");

  let weather = data.weather[0].main;
  document.getElementById("header-weather").innerText = weather;


  //main
  //Location
  document.getElementById("city").innerText = city;

  let countryCode = data.sys.country;
  document.getElementById("country").innerText = countryCode;

  let timezone = data.timezone;
  let timezoneGTM = "";
  if (timezone === 0) {
    timezoneGTM = " GMT+00:00";
  }
  if (timezone > 0) {
    timezoneGTM = " GMT+" + timezone / 3600 + ":00";
  }
  if (timezone < 0) {
    timezoneGTM = " GMT" + timezone / 3600 + ":00";
  }
  document.getElementById("timezone").innerText = timezoneGTM;

  let currentRawTime = data.dt * 1000;
  let currentDate = new Date(currentRawTime);
  let currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();
  document.getElementById("current-time").innerText = currentTime;

  latitude = data.coord.lat;
  document.getElementById("latitude").innerText = latitude;

  longitude = data.coord.lon;
  document.getElementById("longitude").innerText = longitude;


  //Weather
  document.getElementById("weather").innerText = weather;

  document.getElementById("weather-icon").setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");

  let elementC = `°<span class="text-lg -ml-5">c</span>`
  document.getElementById("current-temperature").innerHTML = currentTemperature + elementC;

  let feelsLike = data.main.feels_like;
  document.getElementById("feel-like-temperature").innerText = "Feels Like: " + feelsLike + "°C";

  let pressure = data.main.pressure;
  document.getElementById("pressure").innerText = pressure + " hPa";

  let humidity = data.main.humidity;
  document.getElementById("humidity").innerText = humidity + "%";

  let visibility = data.visibility;
  document.getElementById("visibility").innerText = visibility + " m";

  let clouds = data.clouds.all;
  document.getElementById("cloud").innerText = clouds + "%";

  let description = data.weather[0].description;
  document.getElementById("description").innerText = description;


  //wind
  let windDirection = data.wind.deg;
  let windDirectionIcon = document.getElementById("wind-direction-icon")
  windDirectionIcon.style.transform = "rotate(" + (windDirection - 180) + "deg)";
  let direction = "";
  if ((windDirection >= 0 && windDirection <= 23) || (windDirection >= 337 && windDirection <= 360)) {
    direction = "North";
  }
  if (windDirection >= 24 && windDirection <= 68) {
    direction = "Northeast";
  }
  if (windDirection >= 69 && windDirection <= 113) {
    direction = "East";
  }
  if (windDirection >= 114 && windDirection <= 158) {
    direction = "Southeast";
  }
  if (windDirection >= 159 && windDirection <= 203) {
    direction = "South";
  }
  if (windDirection >= 204 && windDirection <= 248) {
    direction = "Southwest";
  }
  if (windDirection >= 249 && windDirection <= 293) {
    direction = "West";
  }
  if (windDirection >= 294 && windDirection <= 336) {
    direction = "Northwest";
  }
  document.getElementById("wind-direction").innerText = direction;

  let windSpeed = data.wind.speed;
  document.getElementById("wind-speed").innerText = windSpeed + " m/s";

  let windGust = data.wind.gust;
  document.getElementById("wind-gust").innerText = windGust + " m/s";


  //air
  let aqi = airData.list[0].main.aqi;
  const airQualityElement = document.getElementById("air-quality");
  const airQualityIcon = document.getElementById("air-quality-icon");
  let airQuality = "";
  if (aqi === 1) {
    airQuality = "Good";
    airQualityElement.classList.add("text-green-500");
    airQualityIcon.classList.add("fill-neutral-100");
  }
  if (aqi === 2) {
    airQuality = "Fair";
    airQualityElement.classList.add("text-teal-500");
    airQualityIcon.classList.add("fill-neutral-200/50");
  }
  if (aqi === 3) {
    airQuality = "Moderate";
    airQualityElement.classList.add("text-yellow-500");
    airQualityIcon.classList.add("fill-neutral-300/50");
  }
  if (aqi === 4) {
    airQuality = "Poor";
    airQualityElement.classList.add("text-orange-500");
    airQualityIcon.classList.add("fill-neutral-400/50");
  }
  if (aqi === 5) {
    airQuality = "Very Poor";
    airQualityElement.classList.add("text-red-500");
    airQualityIcon.classList.add("fill-neutral-500/50");
  }
  airQualityElement.innerText = airQuality;

  const components = document.getElementById("components");
  const componentsList = Object.entries(airData.list[0].components);
  componentsList.forEach((comp) => {
    let div = document.createElement("div");
    div.classList.add("flex", "justify-between", "border-b-4");
    div.innerHTML = `<span>${comp[0]}</span> <span>${comp[1]}</span>`
    components.appendChild(div);
  })


  //sunrise/sunset
  currentRawTime = data.dt * 1000;
  let sunriseRawTime = data.sys.sunrise * 1000;
  let sunsetRawTime = data.sys.sunset * 1000;

  let sunrise = new Date(sunriseRawTime);
  let sunriseTime = sunrise.getHours() + ":" + sunrise.getMinutes();
  document.getElementById("sunrise").innerText = sunriseTime;

  let sunset = new Date(sunsetRawTime);
  let sunsetTime = sunset.getHours() + ":" + sunset.getMinutes();
  document.getElementById("sunset").innerText = sunsetTime;

  let dayNightIcon = document.getElementById("day-night-icon");
  if (currentRawTime >= sunriseRawTime && currentRawTime < sunsetRawTime) {
    dayNightIcon.setAttribute("src", "./favicon-32x32.png");
  } else {
    dayNightIcon.setAttribute("src", "./icons8-moon-64.png");
  }

  let sunriseIn;
  let sunsetIn;
  const day = 24 * 60 * 60 * 1000;
  if (currentRawTime < sunriseRawTime) {
    sunriseIn = new Date(sunriseRawTime - currentRawTime);
    sunsetIn = new Date(sunsetRawTime - currentRawTime);
  }
  if (currentRawTime >= sunriseRawTime && currentRawTime < sunsetRawTime) {
    sunriseIn = new Date(day - currentRawTime + sunriseRawTime);
    sunsetIn = new Date(sunsetRawTime - currentRawTime);
  }
  if (currentRawTime >= sunsetRawTime) {
    sunriseIn = new Date(day - currentRawTime + sunriseRawTime);
    sunsetIn = new Date(day - currentRawTime + sunsetRawTime);
  }

  document.getElementById("sunrise-in").innerText = sunriseIn.getHours() + ":" + sunriseIn.getMinutes();
  document.getElementById("sunset-in").innerText = sunsetIn.getHours() + ":" + sunsetIn.getMinutes();
}