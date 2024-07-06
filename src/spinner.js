import { rootEl } from "../main";

export function loadSpinner() {
  renderSpinner();
}

function renderSpinner() {
  rootEl.innerHTML = createSpinner();
}

export function createSpinner() {
  return `
     <div class="loader">
        <p class="loader__text">Loading</p>
        <div class="loader__spinner">
          <div class="loader__circle-1"></div>
          <div class="loader__circle-2"></div>
          <div class="loader__circle-3"></div>
        </div>
      </div>
      `;
}
