import axios from "axios";
const URL = "https://nominatim.openstreetmap.org/search";
async function FetchGeo(input) {
  const data = await axios.get(URL, {
    params: {
      q: input,
      format: "json",
    },
  });

  return data;
}
export default FetchGeo;
