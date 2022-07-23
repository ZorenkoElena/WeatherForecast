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

function formatDate(date) {
	const currentDayOfWeek = today.getDay();
	const currentHours = ("0" + today.getHours()).slice(-2);
	const currentMinute = ("0" + today.getMinutes()).slice(-2);

	return `${dayOfWeek[currentDayOfWeek]} ${currentHours}:${currentMinute}`;
}

document.querySelector("#dayAndTime").innerHTML = formatDate(today);

let apiKey = "d74cc05cdf52565f559ffa4ab891cb08";

function showRelevantWeather(response) {
	let city = document.querySelector("#city");
	city.innerHTML = response.data.name;

	let temperature = document.querySelector("#temperature");
	temperature.innerHTML = Math.round(response.data.main.temp);

	let description = document.querySelector("#description");
	description.innerHTML = response.data.weather[0].main;

	let pressure = document.querySelector("#pressure");
	pressure.innerHTML = response.data.main.pressure;

	let humidity = document.querySelector("#humidity");
	humidity.innerHTML = response.data.main.humidity;

	let wind = document.querySelector("#wind");
	wind.innerHTML = response.data.wind.speed;
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

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", showDesiredPlace);

function showCurrentPlace(position) {
	let lat = position.coords.latitude;
	let long = position.coords.longitude;
	let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=
${long}&units=metric&appid=${apiKey}`;

	axios.get(url).then(showRelevantWeather);
}

function findCurrentPlace() {
	navigator.geolocation.getCurrentPosition(showCurrentPlace);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", findCurrentPlace);

searchCity("Kiev");
