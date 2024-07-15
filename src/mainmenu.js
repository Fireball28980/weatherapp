import { rootEl } from "../main";
import {
  getFavoriteCities,
  getForecastWeather,
  removeSaveCity,
  searchLocation,
} from "./api";
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
    <div class="main-menu">
      ${getMenuHeaderHtml()}
      ${await getCityListHtml()}
    </div>
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

const deleteIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
`;

async function getCityListHtml() {
  const favoriteCities = await getFavoriteCities(); // Ensure to await getFavoriteCities()

  if (favoriteCities.length === 0) {
    return `<div class="main-menu__cityList">Noch keine Favoriten gespeichert.</div>`;
  }

  const favoriteCitiesEl = [];

  for (let city of favoriteCities) {
    try {
      const weatherData = await getForecastWeather(city, 1);
      const { location, current, forecast } = weatherData;
      const currentDay = forecast.forecastday[0];
      const conditionImage = getConditionImagePath(
        current.condition.code,
        current.is_day !== 1
      );

      const cityHtml = `
        <div class="city-wrapper">
          <div class="city-wrapper__delite" data-city-name="${city}">${deleteIcon}</div>
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
    } catch (error) {
      console.error(`Failed to fetch weather data for ${city}:`, error);
    }
  }

  return `<div class="main-menu__cityList">${favoriteCitiesEl.join("")}</div>`;
}

function registerEventListeners() {
  const editButton = document.querySelector(".main-menu__edit");
  const deleteButtons = document.querySelectorAll(".city-wrapper__delite");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      removeSaveCity(btn.getAttribute("data-city-name"));
      btn.parentElement.remove();
    });
  });

  editButton.addEventListener("click", () => {
    const EDIT_ATTRIBUTE = "data-edit-mode";

    if (!editButton.getAttribute(EDIT_ATTRIBUTE)) {
      editButton.setAttribute(EDIT_ATTRIBUTE, "true");
      editButton.textContent = "Fertig";

      deleteButtons.forEach((btn) => {
        btn.classList.add("city-wrapper__delite--show");
      });
    } else {
      editButton.removeAttribute(EDIT_ATTRIBUTE);
      editButton.textContent = "Bearbeiten";

      deleteButtons.forEach((btn) => {
        btn.classList.remove("city-wrapper__delite--show");
      });
    }
  });

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const cityName = event.currentTarget.getAttribute("data-city-name");
      // Implement logic to delete the city or handle the delete action
      console.log(`Deleting city: ${cityName}`);
    });
  });

  const searchBar = document.querySelector(".mainmenu__search-input");

  searchBar.addEventListener("input", async (e) => {
    const q = e.target.value;

    let searchResults = [];

    if (q.length > 1) {
      searchResults = await searchLocation(q);
      console.log(searchResults);
    }
  });

  const cities = document.querySelectorAll(".city");

  cities.forEach((city) => {
    city.addEventListener("click", () => {
      const cityName = city.getAttribute("data-city-name");
      loadCityView(cityName);
    });
  });
}
