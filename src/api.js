const API_Origin = "http://api.weatherapi.com/v1";
const API_KEY = "2c51c79b9184416fa91201604240507";
const API_Lang = "de";
const LOCAL_STORAGE_KEY = "favorite-cities";

export async function getForecastWeather(location, days = 3) {
  const res = await fetch(
    `${API_Origin}/forecast.json?key=${API_KEY}&q=${location}&lang=${API_Lang}&days=${days}`
  );

  const weatherData = await res.json();

  console.log(weatherData);

  return weatherData;
}

export async function searchLocation(q) {
  const response = await fetch(
    `${API_Origin}/search.json?key=${API_KEY}&q=${q}&lang=${API_Lang}`
  );

  const searchResults = await response.json();

  return searchResults;
}

export function getFavoriteCities() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

export function saveCities(city) {
  const favoriteCities = getFavoriteCities();

  if (favoriteCities.includes(city)) {
    alert(city + " wurde bereits zu den Favoriten hinzugefügt!");
    return;
  }

  favoriteCities.push(city);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favoriteCities));
}

export function removeSaveCity(city) {
  const favorite = getFavoriteCities();

  const filterFavorite = favorite.filter((favorite) => favorite !== city);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filterFavorite));
}
