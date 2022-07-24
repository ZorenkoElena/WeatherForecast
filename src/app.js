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

function showTime(time) {
	const currentHours = ("0" + time.getHours()).slice(-2);
	const currentMinute = ("0" + time.getMinutes()).slice(-2);

	return `${currentHours}:${currentMinute}`;
}

function formatDate(time) {
	const currentDayOfWeek = time.getDay();
	return `${dayOfWeek[currentDayOfWeek]}`;
}

document.querySelector("#dayAndTime").innerHTML = `${formatDate(today)}
 ${showTime(today)}`;

let apiKey = "d74cc05cdf52565f559ffa4ab891cb08";

function showRelevantWeather(response) {
	document.querySelector("#city").innerHTML = response.data.name;

	document.querySelector("#description").innerHTML =
		response.data.weather[0].main;

	document.querySelector("#pressure").innerHTML = response.data.main.pressure;

	document.querySelector("#humidity").innerHTML = response.data.main.humidity;

	document.querySelector("#wind").innerHTML = response.data.wind.speed;

	currentTempCelsius = Math.round(response.data.main.temp);
	document.querySelector("#temperature").innerHTML = currentTempCelsius;

	let icon = response.data.weather[0].icon;
	let weatherIcon = `http://openweathermap.org/img/wn/${icon}@2x.png`;
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
let currentTempCelsius;

function convertToCelsius() {
	document.querySelector("#temperature").innerHTML = currentTempCelsius;
	document.querySelector("#farinheit").classList.remove("inactive");
	document.querySelector("#celsius").classList.add("inactive");
}

function convertToFarinheit() {
	let currentTempFarinheit = Math.round((9 / 5) * currentTempCelsius + 32);
	document.querySelector("#temperature").innerHTML = currentTempFarinheit;
	document.querySelector("#farinheit").classList.add("inactive");
	document.querySelector("#celsius").classList.remove("inactive");
}

document
	.querySelector("#search-form")
	.addEventListener("submit", showDesiredPlace);

document
	.querySelector("#current-location-button")
	.addEventListener("click", findCurrentPlace);

document.querySelector("#celsius").addEventListener("click", convertToCelsius);

document
	.querySelector("#farinheit")
	.addEventListener("click", convertToFarinheit);

searchCity("Kiev");
