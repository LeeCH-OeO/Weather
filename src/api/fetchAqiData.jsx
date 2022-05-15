import axios from "axios";
import { AqiKey } from "./ApiKey";
const URL = "http://api.waqi.info/feed/geo";
const api = AqiKey;
const FetchAqiData = async (latitude, longitude) => {
  const { data } = await axios.get(
    `${URL}:${latitude};${longitude}/?token=${api}`
  );

  return data;
};
export default FetchAqiData;
