import axios from "axios";

const URL = "https://geocoding-api.open-meteo.com/v1/search";

async function FetchGeo(input) {
  const { data } = await axios.get(URL, {
    params: {
      name: input,
      count: 5,
      language: "en",
      format: "json",
    },
  });

  const mapped = (data?.results || []).map((result) => ({
    lat: result.latitude,
    lon: result.longitude,
    display_name: [result.name, result.admin1, result.country]
      .filter(Boolean)
      .join(", "),
  }));

  return { data: mapped };
}
export default FetchGeo;
