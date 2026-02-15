import axios from "axios";

const URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

const getAqiDescription = (aqi) => {
  if (aqi > 300) return "Hazardous";
  if (aqi > 200) return "Very Unhealthy";
  if (aqi > 150) return "Unhealthy";
  if (aqi > 100) return "Unhealthy for Sensitive Groups";
  if (aqi > 50) return "Moderate";
  return "Good";
};

const FetchAqiData = async (latitude, longitude) => {
  const { data } = await axios.get(URL, {
    params: {
      latitude,
      longitude,
      current: "us_aqi",
      timezone: "auto",
    },
  });

  const aqi = Math.round(data?.current?.us_aqi || 0);
  return {
    data: {
      aqi,
      description: getAqiDescription(aqi),
    },
  };
};
export default FetchAqiData;
