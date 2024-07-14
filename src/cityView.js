import { rootEl } from "../main";
import { getForecastWeather } from "./api";
import { loadSpinner } from "./spinner";
import { getConditionImagePath } from "./conditions";
import {
  formatHourlyTime,
  formatTemperature,
  formatUSTime,
  get24HoursForecastFromNow,
  getDayOfWeek,
} from "./utils";
import { loadMainMenu } from "./mainmenu";

export async function loadCityView(cityName) {
  loadSpinner("Lade Wetter für " + cityName + " ...");
  const weatherData = await getForecastWeather(cityName);
  renderCityView(weatherData);
  registerEventListeners();
}

function renderCityView(weatherData) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];

  const conditionImage = getConditionImagePath(
    current.condition.code,
    current.is_day !== 1
  );

  if (conditionImage) {
    rootEl.style = `--detail-condition-image: url(${conditionImage})`;
    rootEl.classList.add("show-background");
  }

  rootEl.innerHTML =
    getActionBarIcon() +
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
    getForecastBox(forecast.forecastday) +
    getministatscard(
      current.humidity,
      current.feelslike_c,
      currentDay.astro.sunrise,
      currentDay.astro.sunset,
      current.precip_mm,
      current.uv
    );
}

function getActionBarIcon() {
  const backIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
`;

  return `
      <div class"actionbar">
        <div class="actionbar__back">${backIcon}</div>

      </div>
  `;
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
      </div>
    `;
}

function getministatscard(
  humidity,
  feelsLike,
  sunrise,
  sunset,
  precip,
  uvindex
) {
  return `
      <div class="ministats">
        <div class="ministat">
          <div class="ministat__heading">Feuchtigkeit</div>
          <div class="ministat__value">${humidity}%</div>
        </div>
        <div class="ministat">
          <div class="ministat__heading">Gefühlt</div>
          <div class="ministat__value">${feelsLike}°</div>
        </div>
        <div class="ministat">
          <div class="ministat__heading">Sonnenaufgang</div>
          <div class="ministat__value">${formatUSTime(sunrise)} Uhr</div>
        </div>
        <div class="ministat">
          <div class="ministat__heading">Sonnenuntergang</div>
          <div class="ministat__value">${formatUSTime(sunset)} Uhr</div>
        </div>
        <div class="ministat">
          <div class="ministat__heading">Niederschlag</div>
          <div class="ministat__value">${precip} mm</div>
        </div>
        <div class="ministat">
          <div class="ministat__heading">UV-Index</div>
          <div class="ministat__value">${uvindex}</div>
        </div>
      </div>
  `;
}
function registerEventListeners() {
  const backButton = document.querySelector(".actionbar__back");

  backButton.addEventListener("click", () => {
    loadMainMenu();
  });
}
