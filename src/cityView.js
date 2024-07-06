import { rootEl } from "../main";

export function loadCityView() {
  renderCityView();
}

function renderCityView() {
  rootEl.innerHTML = getHeadingBox();
}

function getHeadingBox() {
  return `
    <div class="current-weather">
        <h2 class="current-weather__location">Hamburg</h2>
        <h4 class="current-weather__country">Deutschland</h4>
        <h1 class="cureent-weather__current-temperature">20°</h1>
        <p class="current-weather__condition">Sonnig</p>
        <div class="current-weather__day-temperatures">
          <span class="current-weather__max-temperature">H25°</span>
          <span class="current-weather__min-temperature">T19°</span>
        </div>
      </div>
    `;
}
