import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import FetchWeatherData from "./api/fetchWeatherData";
import FetchLocation from "./api/fetchLocation";
import FetchGeo from "./api/fetchGeo";
import FetchAqiData from "./api/fetchAqiData";
import FetchNetworkLocation from "./api/fetchNetworkLocation";

const DEFAULT_COORDS = {
  latitude: 25.009172597250643,
  longitude: 121.52027756547784,
};

const fmtDate = (unix, offsetSec) =>
  new Date((unix + offsetSec) * 1000)
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");
const fmtTime = (unix, offsetSec) =>
  new Date((unix + offsetSec) * 1000).toISOString().slice(11, 16);

const pad = (v, n) => String(v).padEnd(n, " ");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const blockMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: "easeOut" },
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [inputLocation, setInputLocation] = useState("");
  const [aqi, setAqi] = useState(null);
  const [currentGeo, setCurrentGeo] = useState({ latitude: "", longitude: "" });
  const [saveToast, setSaveToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isBooting, setIsBooting] = useState(true);

  const activeLat =
    currentGeo.latitude !== "" ? currentGeo.latitude : weatherData?.latitude;
  const activeLon =
    currentGeo.longitude !== "" ? currentGeo.longitude : weatherData?.longitude;

  const mapUrl = useMemo(() => {
    if (activeLat === undefined || activeLon === undefined) return "";
    return `https://www.openstreetmap.org/?mlat=${activeLat}&mlon=${activeLon}#map=11/${activeLat}/${activeLon}`;
  }, [activeLat, activeLon]);
  const mapEmbedUrl = useMemo(() => {
    if (activeLat === undefined || activeLon === undefined) return "";
    const lat = Number(activeLat);
    const lon = Number(activeLon);
    const delta = 0.06;
    const left = lon - delta;
    const right = lon + delta;
    const top = lat + delta;
    const bottom = lat - delta;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
  }, [activeLat, activeLon]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      await Promise.all([loadDefaultLocation(), sleep(1600)]);
      if (mounted) {
        setIsBooting(false);
      }
    };
    void init();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchBundle = async (
    latitude,
    longitude,
    shouldMarkCurrent = false,
  ) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [data, location, air] = await Promise.all([
        FetchWeatherData(latitude, longitude),
        FetchLocation(latitude, longitude),
        FetchAqiData(latitude, longitude),
      ]);
      setWeatherData(data);
      setCityName(location);
      setAqi(air);
      if (shouldMarkCurrent) {
        setCurrentGeo({ latitude, longitude });
      }
    } catch (error) {
      setErrorMsg("network_error: failed to fetch weather bundle");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultLocation = async () => {
    const saved = JSON.parse(localStorage.getItem("location"));
    if (saved && saved.latitude && saved.longitude) {
      await fetchBundle(saved.latitude, saved.longitude);
      return;
    }
    try {
      const networkLocation = await FetchNetworkLocation();
      if (networkLocation?.latitude && networkLocation?.longitude) {
        await fetchBundle(
          networkLocation.latitude,
          networkLocation.longitude,
          true,
        );
        return;
      }
    } catch (error) {
      // Silent fallback to built-in default coordinates.
    }
    await fetchBundle(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude, true);
  };

  const handleDeviceLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("geolocation_error: browser does not support geolocation");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetchBundle(
          position.coords.latitude,
          position.coords.longitude,
          true,
        );
      },
      () => {
        setErrorMsg("geolocation_error: permission denied or unavailable");
      },
    );
  };

  const handleSearch = async () => {
    if (!inputLocation.trim()) {
      setErrorMsg("input_error: please type a location");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await FetchGeo(inputLocation.trim());
      if (!res.data?.length) {
        setErrorMsg("search_error: location not found");
        setLoading(false);
        return;
      }
      const target = res.data[0];
      await fetchBundle(target.lat, target.lon, true);
      setInputLocation("");
    } catch (error) {
      setErrorMsg("search_error: failed to resolve location");
      console.log(error);
      setLoading(false);
    }
  };

  const handleSaveDefault = () => {
    if (!(currentGeo.latitude && currentGeo.longitude)) {
      setErrorMsg("save_error: no current geolocation to save");
      return;
    }
    localStorage.setItem("location", JSON.stringify(currentGeo));
    setSaveToast(
      `saved_default: ${cityName?.data?.display_name || "current location"}`,
    );
    setTimeout(() => setSaveToast(""), 2500);
  };

  const hourlyRows =
    weatherData?.hourly
      ?.slice(
        Math.max(
          0,
          weatherData.hourly.findIndex(
            (row) => row.dt >= weatherData.current.dt,
          ),
        ),
        Math.max(
          0,
          weatherData.hourly.findIndex(
            (row) => row.dt >= weatherData.current.dt,
          ),
        ) + 24,
      )
      .map((row, idx) => {
        const t = fmtTime(row.dt, weatherData.timezone_offset);
        const localTime = idx === 0 ? `${t}*` : t;
        return `${pad(localTime, 7)} ${pad(`${row.temp.toFixed(1)}C`, 8)} ${pad(
          `${row.feels_like.toFixed(1)}C`,
          8,
        )} ${pad(`${Math.round(row.pop * 100)}%`, 6)} ${pad(`${row.precip.toFixed(1)}mm`, 8)} ${pad(
          `${row.humidity}%`,
          6,
        )} ${pad(`${row.wind_speed.toFixed(1)}m/s`, 10)} ${pad(
          `${row.pressure.toFixed(0)}hPa`,
          10,
        )} ${pad(`${row.cloud_cover}%`, 6)} ${row.weather[0].description}`;
      }) || [];

  const dailyRows =
    weatherData?.daily?.slice(0, 7).map((row) => {
      const d = fmtDate(row.dt, weatherData.timezone_offset).slice(0, 10);
      return `${pad(d, 12)} day:${pad(`${row.temp.day.toFixed(1)}C`, 8)} night:${pad(
        `${row.temp.night.toFixed(1)}C`,
        8,
      )} rain:${pad(`${Math.round(row.pop * 100)}%`, 6)} sum:${pad(
        `${row.precip_sum.toFixed(1)}mm`,
        8,
      )} uv:${pad(String(row.uv_index_max ?? "-"), 5)} sr:${pad(
        fmtTime(row.sunrise, weatherData.timezone_offset),
        6,
      )} ss:${pad(fmtTime(row.sunset, weatherData.timezone_offset), 6)} ${row.weather[0].description}`;
    }) || [];

  return (
    <main className="terminal-root">
      <section className="terminal-window">
        <motion.header
          className="terminal-header"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <p className="terminal-title">weather-terminal@local:~</p>
          <motion.span
            className="status-pulse"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          >
            LIVE
          </motion.span>
        </motion.header>

        <div className="terminal-body">
          {isBooting ? (
            <motion.section
              className="boot-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.25 }}
              >
                boot:: weather-terminal v2
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18, duration: 0.25 }}
              >
                init:: resolving network location...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.34, duration: 0.25 }}
              >
                init:: hydrating weather / air-quality streams...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.52, duration: 0.25 }}
              >
                init:: preparing terminal session...
              </motion.p>
              <div className="boot-progress">
                <motion.div
                  className="boot-progress-bar"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.35, ease: "easeInOut" }}
                />
              </div>
              <motion.div
                className="boot-cursor"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 0.9 }}
              />
            </motion.section>
          ) : null}
          {!isBooting ? (
            <>
              <p>
                <span className="prompt">system$</span> boot weather cli
              </p>
              <p>
                <span className="prompt">system$</span> city:{" "}
                {cityName?.data?.display_name || "loading..."}
              </p>
              <p>
                <span className="prompt">system$</span> status:{" "}
                {loading ? "syncing data..." : "ready"}
              </p>
              {errorMsg ? (
                <p className="error-line">error: {errorMsg}</p>
              ) : null}
              {saveToast ? <p className="ok-line">{saveToast}</p> : null}

              <div className="command-row">
                <span className="prompt">query$</span>
                <input
                  value={inputLocation}
                  onChange={(e) => setInputLocation(e.target.value)}
                  placeholder="type city then run"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleSearch();
                  }}
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  title="Search weather by city name"
                >
                  Search City
                </button>
                <button
                  type="button"
                  onClick={handleDeviceLocation}
                  title="Use your browser/device geolocation for current weather"
                >
                  Use My Location
                </button>
                <button
                  type="button"
                  onClick={handleSaveDefault}
                  title="Save the current location as your default startup location"
                >
                  Save As Default
                </button>
              </div>

              {loading || !weatherData || !aqi ? (
                <p className="muted-line">awaiting weather payload...</p>
              ) : (
                <>
                  <motion.section className="block" {...blockMotion}>
                    <h2>[NOW]</h2>
                    <pre>{`temp        : ${weatherData.current.temp.toFixed(2)} C ${weatherData.current.weather[0].icon}
feels_like  : ${weatherData.current.feels_like.toFixed(2)} C
humidity    : ${weatherData.current.humidity} %
dew_point   : ${weatherData.current.dew_point.toFixed(2)} C
visibility  : ${weatherData.current.visibility} m
cloud_cover : ${weatherData.current.cloud_cover} %
pressure    : ${weatherData.current.pressure.toFixed(0)} hPa
precip      : ${weatherData.current.precipitation.toFixed(2)} mm
wind_speed  : ${weatherData.current.wind_speed} m/s
wind_dir    : ${weatherData.current.wind_direction} deg
condition   : ${weatherData.current.weather[0].description}
aqi         : ${aqi.data.aqi} (${aqi.data.description})`}</pre>
                  </motion.section>

                  <motion.section
                    className="block"
                    {...blockMotion}
                    transition={{ ...blockMotion.transition, delay: 0.05 }}
                  >
                    <h2>[HOURLY_24]</h2>
                    <pre>{`time*   temp     feels    rain   precip   hum    wind       pressure   cloud  weather
${hourlyRows.join("\n")}`}</pre>
                  </motion.section>

                  <motion.section
                    className="block"
                    {...blockMotion}
                    transition={{ ...blockMotion.transition, delay: 0.1 }}
                  >
                    <h2>[DAILY_7]</h2>
                    <pre>{`date         day temp  night    rain   sum     uv    sr    ss    weather
${dailyRows.join("\n")}`}</pre>
                  </motion.section>

                  <motion.section
                    className="block"
                    {...blockMotion}
                    transition={{ ...blockMotion.transition, delay: 0.14 }}
                  >
                    <h2>[META]</h2>
                    <pre>{`city         : ${cityName?.data?.display_name || "-"}
timezone     : ${weatherData.timezone}
now_local    : ${fmtDate(weatherData.current.dt, weatherData.timezone_offset)}
lat          : ${activeLat}
lon          : ${activeLon}
openstreetmap: ${mapUrl}`}</pre>
                    {mapEmbedUrl ? (
                      <div className="map-shell">
                        <iframe
                          title="openstreetmap"
                          src={mapEmbedUrl}
                          loading="lazy"
                          className="map-frame"
                        />
                      </div>
                    ) : null}
                    <a href={mapUrl} target="_blank" rel="noreferrer">
                      open map in new tab
                    </a>
                  </motion.section>
                </>
              )}
              <motion.footer
                className="terminal-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.2 }}
              >
                <span>weather-oeo</span>
                <span>{new Date().getFullYear()} terminal mode</span>
                <a
                  href="https://open-meteo.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  data: open-meteo
                </a>
              </motion.footer>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default App;
