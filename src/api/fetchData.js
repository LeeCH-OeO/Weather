import axios from "axios";
import { ApiKey } from "./ApiKey";
const URL = "https://api.openweathermap.org/data/2.5/onecall";
const api = ApiKey;
const FetchData = async (position) => {
  const { data } = await axios.get(URL, {
    params: {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      APPID: api,
      units: "metric",
    },
  });
  return data;
};
export default FetchData;
