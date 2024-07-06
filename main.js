import { getcurrentWeather } from "./src/api";
import { loadCityView } from "./src/cityView";
import { loadSpinner } from "./src/spinner";
import "./styles/main.scss";

export const rootEl = document.getElementById("app");

//getcurrentWeather("Hamburg");
//loadCityView();
loadSpinner();
