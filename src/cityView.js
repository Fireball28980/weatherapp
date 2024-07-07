import { rootEl } from "../main";
import { getForecastWeather } from "./api";
import { loadSpinner } from "./spinner";
import { formatTemperature } from "./utils";

export async function loadCityView() {
  loadSpinner();
  const weatherData = await getForecastWeather("Bremen");
  renderCityView(weatherData);
}

function renderCityView(weatherData) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];

  rootEl.innerHTML = getHeadingBox(
    location.name,
    location.country,
    formatTemperature(current.temp_c),
    current.condition.text,
    formatTemperature(currentDay.day.maxtemp_c),
    formatTemperature(currentDay.day.mintemp_c)
  );
}

function getHeadingBox(
  location,
  country,
  currentTemp,
  condition,
  maxTemp,
  minTemp
) {
  return `
    <div class="current-weather">
        <h2 class="current-weather__location">${location}</h2>
        <h4 class="current-weather__country">${country}</h4>
        <h1 class="cureent-weather__current-temperature">${currentTemp}°</h1>
        <p class="current-weather__condition">${condition}</p>
        <div class="current-weather__day-temperatures">
          <span class="current-weather__max-temperature">${maxTemp}°</span>
          <span class="current-weather__min-temperature">${minTemp}°</span>
        </div>
      </div>
    `;
}
