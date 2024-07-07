import { rootEl } from "../main";
import { getForecastWeather } from "./api";
import { loadSpinner } from "./spinner";
import {
  formatHourlyTime,
  formatTemperature,
  get24HoursForecastFromNow,
  getDayOfWeek,
} from "./utils";

export async function loadCityView() {
  loadSpinner();
  const weatherData = await getForecastWeather("Hamburg");
  renderCityView(weatherData);
}

function renderCityView(weatherData) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];

  rootEl.innerHTML =
    getHeadingBox(
      location.name,
      location.country,
      formatTemperature(current.temp_c),
      current.condition.text,
      formatTemperature(currentDay.day.maxtemp_c),
      formatTemperature(currentDay.day.mintemp_c)
    ) +
    getForecastCard(
      currentDay.day.condition.text,
      currentDay.day.maxwind_kph,
      forecast.forecastday,
      current.last_updated_epoch
    ) +
    getForecastBox(forecast.forecastday);
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
        <h1 class="current-weather__current-temperature">${currentTemp}°</h1>
        <p class="current-weather__condition">${condition}</p>
        <div class="current-weather__day-temperatures">
          <span class="current-weather__max-temperature">H:${maxTemp}°</span>
          <span class="current-weather__min-temperature">T:${minTemp}°</span>
        </div>
      </div>
    `;
}

function getForecastCard(condition, maxWind, forecastdays, lastUpdatedEpoch) {
  const hourlyForecastEl = get24HoursForecastFromNow(
    forecastdays,
    lastUpdatedEpoch
  )
    .filter((el) => el !== undefined)
    .map(
      (hour, i) => `
    <div class="hourly-forecast">
      <div class="hourly-forecast__time">${
        i === 0 ? "Jetzt" : formatHourlyTime(hour.time) + " Uhr"
      }</div>
        <img
          src="http:${hour.condition.icon}"
          alt=""
          class="hourly-forecast__icon"
        />
        <div class="hourly-forecast__temperature">${formatTemperature(
          hour.temp_c
        )}°</div>
    </div> 
  `
    );

  const hourlyForecastCard = hourlyForecastEl.join("");

  return `
       <div class="today-forecast">
        <div class="today-forecast__conditions"> Heute
          ${condition}. Wind bis zu ${maxWind} km/h
        </div>
        <div class="today-forecast__hours">
           ${hourlyForecastCard}
        </div>
      </div>
      `;
}

function getForecastBox(forecast) {
  const forecastEl = forecast.map(
    (forecastday, i) => `
        <div class="forecast-day">
         <div class="forecast-day__day">${
           i === 0 ? "Heute" : getDayOfWeek(forecastday.date)
         }</div>
           <img
            src="https:${forecastday.day.condition.icon}"
            alt=""
            class="forecast-day__icon"
          />
          <div class="forecast-day__max-temp">H:${formatTemperature(
            forecastday.day.maxtemp_c
          )}°</div>
          <div class="forecast-day__min-temp">T:${formatTemperature(
            forecastday.day.mintemp_c
          )}°</div>
          <div class="forecast-day__wind">wind: ${
            forecastday.day.maxwind_kph
          }km/h</div>
        </div>
    `
  );

  const forecastBox = forecastEl.join("");

  return `
      <div class="forecast">
        <div class="forecast__title">Vorhersage für die nächsten 3 Tage:</div>
        <div class="forecast__days">
          ${forecastBox}
      </div>
    `;
}
