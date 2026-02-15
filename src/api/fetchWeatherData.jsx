import axios from "axios";

const URL = "https://api.open-meteo.com/v1/forecast";

const getWeatherInfo = (code, isDay = 1) => {
  if (code === 0)
    return { description: "Clear sky", icon: isDay ? "☀️" : "🌙" };
  if (code === 1)
    return { description: "Mainly clear", icon: isDay ? "🌤️" : "🌙" };
  if (code === 2)
    return { description: "Partly cloudy", icon: isDay ? "⛅" : "☁️" };
  if (code === 3) return { description: "Overcast", icon: "☁️" };
  if (code === 45 || code === 48) return { description: "Fog", icon: "🌫️" };
  if ([51, 53, 55, 56, 57].includes(code))
    return { description: "Drizzle", icon: "🌦️" };
  if ([61, 63, 65, 66, 67].includes(code))
    return { description: "Rain", icon: "🌧️" };
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return { description: "Snow", icon: "❄️" };
  if ([80, 81, 82].includes(code))
    return { description: "Rain showers", icon: "🌧️" };
  if ([95, 96, 99].includes(code))
    return { description: "Thunderstorm", icon: "⛈️" };

  return { description: "Unknown", icon: "🌡️" };
};

const FetchWeatherData = async (latitude, longitude) => {
  const { data } = await axios.get(URL, {
    params: {
      latitude,
      longitude,
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,is_day,cloud_cover,precipitation,dew_point_2m",
      hourly:
        "temperature_2m,apparent_temperature,precipitation_probability,precipitation,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover,dew_point_2m,weather_code,is_day",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant,sunrise,sunset,uv_index_max",
      temperature_unit: "celsius",
      wind_speed_unit: "ms",
      timezone: "auto",
      timeformat: "unixtime",
    },
  });

  const timezoneOffset = data.utc_offset_seconds || 0;
  const currentWeather = getWeatherInfo(
    data.current.weather_code,
    data.current.is_day,
  );

  const hourly = data.hourly.time.map((dt, idx) => {
    const weather = getWeatherInfo(
      data.hourly.weather_code[idx],
      data.hourly.is_day[idx],
    );
    return {
      dt,
      temp: data.hourly.temperature_2m[idx],
      feels_like: data.hourly.apparent_temperature[idx],
      pop: (data.hourly.precipitation_probability[idx] || 0) / 100,
      precip: data.hourly.precipitation[idx] || 0,
      humidity: data.hourly.relative_humidity_2m[idx],
      wind_speed: data.hourly.wind_speed_10m[idx],
      wind_direction: data.hourly.wind_direction_10m[idx],
      pressure: data.hourly.surface_pressure[idx],
      cloud_cover: data.hourly.cloud_cover[idx],
      dew_point: data.hourly.dew_point_2m[idx],
      weather: [weather],
    };
  });

  const daily = data.daily.time.map((dt, idx) => {
    const weather = getWeatherInfo(data.daily.weather_code[idx], 1);
    return {
      dt,
      temp: {
        day: data.daily.temperature_2m_max[idx],
        night: data.daily.temperature_2m_min[idx],
      },
      feels_like: {
        day: data.daily.apparent_temperature_max[idx],
        night: data.daily.apparent_temperature_min[idx],
      },
      pop: (data.daily.precipitation_probability_max[idx] || 0) / 100,
      precip_sum: data.daily.precipitation_sum[idx] || 0,
      humidity: 0,
      wind_speed: data.daily.wind_speed_10m_max[idx],
      wind_direction: data.daily.wind_direction_10m_dominant[idx],
      sunrise: data.daily.sunrise[idx],
      sunset: data.daily.sunset[idx],
      uv_index_max: data.daily.uv_index_max[idx],
      weather: [weather],
    };
  });

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone_offset: timezoneOffset,
    timezone: data.timezone,
    current: {
      dt: data.current.time,
      temp: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      dew_point: data.current.dew_point_2m,
      pressure: data.current.surface_pressure,
      cloud_cover: data.current.cloud_cover,
      precipitation: data.current.precipitation,
      visibility: data.current.visibility || 0,
      wind_speed: data.current.wind_speed_10m,
      wind_direction: data.current.wind_direction_10m,
      weather: [currentWeather],
    },
    hourly,
    daily,
    alerts: null,
  };
};
export default FetchWeatherData;
