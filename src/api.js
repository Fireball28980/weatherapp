const API_Origin = "http://api.weatherapi.com/v1";
const API_KEY = "2c51c79b9184416fa91201604240507";
const API_Lang = "de";

export async function getcurrentWeather(location) {
  const res = await fetch(
    `${API_Origin}/current.json?key=${API_KEY}&q=${location}&lang=${API_Lang}`
  );

  const weatherdata = await res.json();

  console.log(weatherdata);

  return weatherdata;
}
