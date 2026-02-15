import axios from "axios";

const URL = "https://nominatim.openstreetmap.org/search";

async function FetchGeo(input) {
  const { data } = await axios.get(URL, {
    params: {
      q: input,
      format: "jsonv2",
      addressdetails: 1,
      limit: 5,
      "accept-language": "en",
    },
  });

  const mapped = (data || []).map((result) => ({
    lat: Number(result.lat),
    lon: Number(result.lon),
    display_name: result.display_name,
  }));

  return { data: mapped };
}
export default FetchGeo;
