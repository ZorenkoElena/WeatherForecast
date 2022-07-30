const today = new Date();

const dayOfWeek = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Suturday",
];

const dayOfWeekContracted = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sut"];

function showTime(time) {
	const currentHours = ("0" + time.getHours()).slice(-2);
	const currentMinute = ("0" + time.getMinutes()).slice(-2);

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

document.querySelector("#dayAndTime").innerHTML = `${formatDate(today)}
 ${showTime(today)}`;

let apiKey = "d74cc05cdf52565f559ffa4ab891cb08";

function showForecast(response) {
	let forecast = response.data.daily;
	let forecastOnWeek = `<div class="row">`;

	forecast.forEach(function (forecastday, index) {
		if (index > 0 && index < 7) {
			forecastOnWeek =
				forecastOnWeek +
				`<div class="col-2">
            <div>${formatDay(forecastday.dt)}</div>
            <img src="http://openweathermap.org/img/wn/${
							forecastday.weather[0].icon
						}@2x.png" alt=""
            class="icon" />
            <div>${Math.round(
							forecastday.temp.max
						)}°<span class="min"> ${Math.round(forecastday.temp.min)}°</span>
            </div>
          </div>`;
		}
	});
	forecastOnWeek = forecastOnWeek + `</div>`;

	document.querySelector("#weather-forecast").innerHTML = forecastOnWeek;
}

function getForecast(coordinates) {
	let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}`;
	axios.get(url).then(showForecast);
}

function showRelevantWeather(response) {
	document.querySelector("#city").innerHTML = response.data.name;

	document.querySelector("#description").innerHTML =
		response.data.weather[0].main;

	document.querySelector("#pressure").innerHTML = response.data.main.pressure;

	document.querySelector("#humidity").innerHTML = response.data.main.humidity;

	document.querySelector("#wind").innerHTML = response.data.wind.speed;

	document.querySelector("#temperature").innerHTML = Math.round(
		response.data.main.temp
	);

	let weatherIcon = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
	document.querySelector("#icon").setAttribute("src", weatherIcon);

	document
		.querySelector("#icon")
		.setAttribute("alt", response.data.weather[0].main);

	document.querySelector("#maxTemp").innerHTML = Math.round(
		response.data.main.temp_max
	);

	document.querySelector("#minTemp").innerHTML = Math.round(
		response.data.main.temp_min
	);

	let sunrise = new Date(response.data.sys.sunrise * 1000);
	let sundown = new Date(response.data.sys.sunset * 1000);
	document.querySelector("#sunrise").innerHTML = showTime(sunrise);
	document.querySelector("#sunset").innerHTML = showTime(sundown);

	getForecast(response.data.coord);
}

function searchCity(city) {
	let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
	axios.get(url).then(showRelevantWeather);
}

function showDesiredPlace(event) {
	event.preventDefault();
	let city = document.querySelector("#cityInForm").value;
	searchCity(city);
}

function showCurrentPlace(position) {
	let lat = position.coords.latitude;
	let long = position.coords.longitude;
	let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=
${long}&units=metric&appid=${apiKey}`;

	axios.get(url).then(showRelevantWeather);
}

function findCurrentPlace(event) {
	event.preventDefault();
	navigator.geolocation.getCurrentPosition(showCurrentPlace);
}

document
	.querySelector("#search-form")
	.addEventListener("submit", showDesiredPlace);

document
	.querySelector("#current-location-button")
	.addEventListener("click", findCurrentPlace);

searchCity("Kiev");
