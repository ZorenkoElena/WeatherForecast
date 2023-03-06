const today = new Date();

const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Suturday'];

const dayOfWeekContracted = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut'];

function showTime(time) {
  const currentHours = ('0' + time.getHours()).slice(-2);
  const currentMinute = ('0' + time.getMinutes()).slice(-2);

  return `${currentHours}:${currentMinute}`;
}

function formatDate(timestamp) {
  const currentDayOfWeek = timestamp.getDay();
  return `${dayOfWeek[currentDayOfWeek]}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);

  const dayOfWeek = date.getDay();
  return `${dayOfWeekContracted[dayOfWeek]}`;
}

const backgroundVideo = {
  '01d': 'sun-shining',
  '01n': 'clear-sky-night',
  '02d': 'cloudy-sky',
  '02n': 'cloudy-sky',
  '03d': 'cloudy-sky',
  '03n': 'cloudy-sky',
  '04d': 'cloudy-sky',
  '04n': 'cloudy-sky',
  '09d': 'rain',
  '09n': 'rain',
  '10d': 'rain',
  '10n': 'rain',
  '11d': 'rain',
  '11n': 'rain',
  '13d': 'snow',
  '13n': 'snow',
  '50d': 'misty-forest',
  '50n': 'misty-forest',
};

document.querySelector('#dayAndTime').innerHTML = `${formatDate(today)}
  ${showTime(today)}`;

let apiKey = 'd74cc05cdf52565f559ffa4ab891cb08';

function showForecast(response) {
  let forecast = response.data.daily;
  let forecastOnWeekColums = `<div class="row">`;
  let forecastOnWeekRows = `<div class="col d-grid gap-2">`;

  forecast.forEach(function (forecastday, index) {
    if (index > 0 && index < 7) {
      forecastOnWeekColums =
        forecastOnWeekColums +
        `<div class="col m-1 weather-card">
            <div>${formatDay(forecastday.dt)}</div>
            <div class="mt-3 mb-2">
            <img src="img/icons/${forecastday.weather[0].icon}.png" alt="${forecastday.weather[0].main}"
            class="icon" />
            </div>
            <div>${Math.round(forecastday.temp.max)}°<span class="min"> / ${Math.round(forecastday.temp.min)}°</span>
          </div>
        </div>`;

      forecastOnWeekRows =
        forecastOnWeekRows +
        `<div class="row align-items-center weather-card">

            <div class="col-4">${formatDay(forecastday.dt)}</div>
            <div class="col-3">
            <img src="img/icons/${forecastday.weather[0].icon}.png" alt="${forecastday.weather[0].main}"
            class="icon" />
            </div>
            <div class="col-5">Max: ${Math.round(forecastday.temp.max)}°<span class="min">...Min:${Math.round(forecastday.temp.min)}°</span>

          </div>
        </div>`;
    }
  });

  forecastOnWeekColums = forecastOnWeekColums + `</div>`;
  forecastOnWeekRows = forecastOnWeekRows + `</div>`;

  document.querySelector('#weather-forecast-colums').innerHTML = forecastOnWeekColums;
  document.querySelector('#weather-forecast-rows').innerHTML = forecastOnWeekRows;
}

function getForecast(coordinates) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}`;
  // eslint-disable-next-line no-undef
  axios.get(url).then(showForecast);
}

function showRelevantWeather(response) {
  document.querySelector('#city').innerHTML = response.data.name;

  document.querySelector('#description').innerHTML = response.data.weather[0].main;

  document.querySelector('#pressure').innerHTML = response.data.main.pressure;

  document.querySelector('#humidity').innerHTML = response.data.main.humidity;

  document.querySelector('#wind').innerHTML = response.data.wind.speed;

  document.querySelector('#temperature').innerHTML = Math.round(response.data.main.temp);

  // let weatherIcon = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
  let typeOfIcon = response.data.weather[0].icon;

  document.querySelector('#icon').setAttribute('src', `img/icons/${typeOfIcon}.png`);

  let typeOfVideo = backgroundVideo[response.data.weather[0].icon];

  document.querySelector('#background-video').setAttribute('src', `video/${typeOfVideo}.mp4`);

  document.querySelector('#icon').setAttribute('alt', response.data.weather[0].main);

  document.querySelector('#maxTemp').innerHTML = Math.round(response.data.main.temp_max);

  document.querySelector('#minTemp').innerHTML = Math.round(response.data.main.temp_min);

  let sunrise = new Date(response.data.sys.sunrise * 1000);
  let sundown = new Date(response.data.sys.sunset * 1000);
  document.querySelector('#sunrise').innerHTML = showTime(sunrise);
  document.querySelector('#sunset').innerHTML = showTime(sundown);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  // eslint-disable-next-line no-undef
  axios.get(url).then(showRelevantWeather);
}

function showDesiredPlace(event) {
  event.preventDefault();
  let city = document.querySelector('#cityInForm').value;
  searchCity(city);
}

function showCurrentPlace(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=
${long}&units=metric&appid=${apiKey}`;

  // eslint-disable-next-line no-undef
  axios.get(url).then(showRelevantWeather);
}

function findCurrentPlace(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentPlace);
}

document.querySelector('#search-form').addEventListener('submit', showDesiredPlace);

document.querySelector('#current-location-button').addEventListener('click', findCurrentPlace);

searchCity('Kyiv');
