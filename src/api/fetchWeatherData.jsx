import axios from "axios";
const URL = "https://api.openweathermap.org/data/2.5/onecall";
const api = import.meta.env.VITE_WEATHER_API;
const FetchWeatherData = async (latitude, longitude) => {
  const { data } = await axios.get(URL, {
    params: {
      lat: latitude,
      lon: longitude,
      APPID: api,
      units: "metric",
    },
  });

  return data;
};
export default FetchWeatherData;
