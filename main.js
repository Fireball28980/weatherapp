import { loadCityView } from "./src/cityView";
import { loadMainMenu } from "./src/mainmenu";
import { loadSpinner } from "./src/spinner";
import "./styles/main.scss";

export const rootEl = document.getElementById("app");

//loadCityView("Hamburg");
loadMainMenu();
