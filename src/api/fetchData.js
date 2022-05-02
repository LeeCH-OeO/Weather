import axios from "axios";
import { ApiKey } from "./ApiKey";
const URL = "https://api.openweathermap.org/data/2.5/onecall";
const api = ApiKey;
const FetchData = async (latitude, longitude) => {
  const { data } = await axios.get(URL, {
    params: {
      lat: latitude,
      lon: longitude,
      APPID: api,
      units: "metric",
    },
  });
  console.log(data);
  return data;
};
export default FetchData;
