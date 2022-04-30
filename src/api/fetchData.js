import axios from "axios";
const URL = "https://api.openweathermap.org/data/2.5/onecall";
const api = "ca20b15c0e2800058d1de6ba9abe60f6";
const FetchData = async (position) => {
  const { data } = await axios.get(URL, {
    params: {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      APPID: api,
      units: "metric",
    },
  });
  console.log(data);
  return data;
};
export default FetchData;
