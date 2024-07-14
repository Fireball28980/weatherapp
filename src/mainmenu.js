import { rootEl } from "../main";
import { getForecastWeather } from "./api";
import { loadCityView } from "./cityView";
import { loadSpinner } from "./spinner";
import { getConditionImagePath } from "./conditions";
import { formatTemperature } from "./utils";

export async function loadMainMenu() {
  rootEl.classList.remove("show-background");
  loadSpinner();
  await renderMainMenu();
}

async function renderMainMenu() {
  rootEl.innerHTML = `
    <div class="main-menu">${getMenuHeaderHtml()}${await getCityListHtml()}</div>
  `;

  registerEventListeners();
}

function getMenuHeaderHtml() {
  return `
    <div class="main-menu__heading">
      Wetter <button class="main-menu__edit">Bearbeiten</button>
    </div>
    <div class="main-menu__searchbar">
      <input
        type="text"
        class="main-menu__searchinput"
        placeholder="Nach Stadt suchen..."
      />
    </div>
  `;
}

async function getCityListHtml() {
  const favoriteCities = ["Hamburg", "London", "Mannheim", "Bremen"];

  const favoriteCitiesEl = [];

  for (let city of favoriteCities) {
    const weatherData = await getForecastWeather(city, 1);

    const { location, current, forecast } = weatherData;
    const currentDay = forecast.forecastday[0];

    const conditionImage = getConditionImagePath(
      current.condition.code,
      current.is_day !== 1
    );

    const cityHtml = `
      <div class="city-wrapper">
        <div class="city" data-city-name="${city}" style="--condition-image: url(${conditionImage})">
          <div class="city__left-colum">
            <h2 class="city__name">${location.name}</h2>
            <div class="city__country">${location.country}</div>
            <div class="city__condition">${current.condition.text}</div>
          </div>
          <div class="city__right-colum">
            <div class="city__temperature">${formatTemperature(
              current.temp_c
            )}°</div>
            <div class="city__minmax-temperature">H:${formatTemperature(
              currentDay.day.maxtemp_c
            )}° T:${formatTemperature(currentDay.day.mintemp_c)}°</div>
          </div>
        </div>
      </div>
    `;

    favoriteCitiesEl.push(cityHtml);
  }

  const favoriteCitiesHtml = favoriteCitiesEl.join("");

  return `
    <div class="main-menu__cityList">
      ${favoriteCitiesHtml}
    </div>
  `;
}

function registerEventListeners() {
  const cities = document.querySelectorAll(".city");

  cities.forEach((city) => {
    city.addEventListener("click", () => {
      const cityName = city.getAttribute("data-city-name");

      loadCityView(cityName);
    });
  });
}
