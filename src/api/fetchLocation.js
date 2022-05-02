import axios from "axios";
const URL = "https://nominatim.openstreetmap.org/reverse";
async function FetchLocation(latitude, longitude) {
  const data = await axios.get(URL, {
    params: {
      lat: latitude,
      lon: longitude,
      zoom: "14",
      format: "json",
    },
  });
  return data;
}
export default FetchLocation;
