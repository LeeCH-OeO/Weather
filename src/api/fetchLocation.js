import axios from "axios";
const URL = "https://nominatim.openstreetmap.org/reverse";
async function FetchLocation(position) {
  const data = await axios.get(URL, {
    params: {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      zoom: "14",
      format: "json",
    },
  });
  console.log(data);
  return data;
}
export default FetchLocation;
