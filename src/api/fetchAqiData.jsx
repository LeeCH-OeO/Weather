import axios from "axios";
import { AqiKey } from "./ApiKey";
const URL = "http://api.waqi.info/feed/geo";
const api = AqiKey;
const FetchAqiData = async (latitude, longitude) => {
  const { data } = await axios.get(
    `${URL}:${latitude};${longitude}/?token=${api}`
  );
  if (data.data.aqi > 300) {
    data.data.description = "Hazardous";
  } else if (data.data.aqi > 200) {
    data.data.description = "Very Unhealthy";
  } else if (data.data.aqi > 150) {
    data.data.description = "Unhealthy";
  } else if (data.data.aqi > 100) {
    data.data.description = "Unhealthy for Sensitive Groups";
  } else if (data.data.aqi > 50) {
    data.data.description = "Moderate";
  } else {
    data.data.description = "Good";
  }
  return data;
};
export default FetchAqiData;
