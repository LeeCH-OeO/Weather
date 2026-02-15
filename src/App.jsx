import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";
import FetchAqiData from "./api/fetchAqiData";
import FetchGeo from "./api/fetchGeo";
import FetchLocation from "./api/fetchLocation";
import FetchNetworkLocation from "./api/fetchNetworkLocation";
import FetchWeatherData from "./api/fetchWeatherData";

const DEFAULT_COORDS = {
  latitude: 25.009172597250643,
  longitude: 121.52027756547784,
};

const toIsoWithOffset = (unix, offsetSec) => {
  const shifted = new Date((unix + offsetSec) * 1000);
  const y = shifted.getUTCFullYear();
  const m = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const d = String(shifted.getUTCDate()).padStart(2, "0");
  const hh = String(shifted.getUTCHours()).padStart(2, "0");
  const mm = String(shifted.getUTCMinutes()).padStart(2, "0");
  const ss = String(shifted.getUTCSeconds()).padStart(2, "0");
  const sign = offsetSec >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetSec);
  const offH = String(Math.floor(absOffset / 3600)).padStart(2, "0");
  const offM = String(Math.floor((absOffset % 3600) / 60)).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}${sign}${offH}:${offM}`;
};

const toIsoLocal = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const tzMin = -date.getTimezoneOffset();
  const sign = tzMin >= 0 ? "+" : "-";
  const offH = String(Math.floor(Math.abs(tzMin) / 60)).padStart(2, "0");
  const offM = String(Math.abs(tzMin) % 60).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}${sign}${offH}:${offM}`;
};
const fmtDate = (unix, offsetSec) => toIsoWithOffset(unix, offsetSec);
const fmtTime = (unix, offsetSec) =>
  toIsoWithOffset(unix, offsetSec).slice(11, 19);

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
  const [showActions, setShowActions] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [themeMode, setThemeMode] = useState("dark");

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

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme_mode");
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeMode(savedTheme);
      return;
    }
    const prefersLight = window.matchMedia?.(
      "(prefers-color-scheme: light)",
    )?.matches;
    setThemeMode(prefersLight ? "light" : "dark");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("theme-light", themeMode === "light");
    localStorage.setItem("theme_mode", themeMode);
  }, [themeMode]);

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
        return `${pad(localTime, 10)} ${pad(`${row.temp.toFixed(1)}C`, 8)} ${pad(
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
        9,
      )} ss:${pad(fmtTime(row.sunset, weatherData.timezone_offset), 9)} ${row.weather[0].description}`;
    }) || [];

  const nowRows =
    weatherData && aqi
      ? [
          [
            "local_time",
            fmtDate(weatherData.current.dt, weatherData.timezone_offset),
          ],
          [
            "temp",
            `${weatherData.current.temp.toFixed(2)} C ${weatherData.current.weather[0].icon}`,
          ],
          ["feels_like", `${weatherData.current.feels_like.toFixed(2)} C`],
          ["humidity", `${weatherData.current.humidity} %`],
          ["dew_point", `${weatherData.current.dew_point.toFixed(2)} C`],
          ["visibility", `${weatherData.current.visibility} m`],
          ["cloud_cover", `${weatherData.current.cloud_cover} %`],
          ["pressure", `${weatherData.current.pressure.toFixed(0)} hPa`],
          ["precip", `${weatherData.current.precipitation.toFixed(2)} mm`],
          ["wind_speed", `${weatherData.current.wind_speed} m/s`],
          ["wind_dir", `${weatherData.current.wind_direction} deg`],
          ["condition", weatherData.current.weather[0].description],
          ["aqi", `${aqi.data.aqi} (${aqi.data.description})`],
        ].map(([k, v]) => `${pad(k, 10)} : ${v}`)
      : [];

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
          <button
            type="button"
            className="theme-btn"
            onClick={() =>
              setThemeMode((prev) => (prev === "dark" ? "light" : "dark"))
            }
            title="Toggle light/dark mode"
            aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
          >
            {themeMode === "dark" ? (
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
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
                <div className="input-shell">
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
                    className="inline-search-btn"
                    onClick={() => void handleSearch()}
                    title="Search weather by city name"
                  >
                    Search
                  </button>
                </div>
                <button
                  type="button"
                  className="desktop-action-btn"
                  onClick={handleDeviceLocation}
                  title="Use your browser/device geolocation for current weather"
                >
                  My Location
                </button>
                <button
                  type="button"
                  className="desktop-action-btn"
                  onClick={handleSaveDefault}
                  title="Save the current location as your default startup location"
                >
                  Save Default
                </button>
              </div>

              {loading || !weatherData || !aqi ? (
                <p className="muted-line">awaiting weather payload...</p>
              ) : (
                <>
                  <motion.section className="block" {...blockMotion}>
                    <h2>[NOW]</h2>
                    <pre>{nowRows.join("\n")}</pre>
                  </motion.section>

                  <motion.section
                    className="block"
                    {...blockMotion}
                    transition={{ ...blockMotion.transition, delay: 0.05 }}
                  >
                    <h2>[HOURLY_24]</h2>
                    <pre>{`time*      temp     feels    rain   precip   hum    wind       pressure   cloud  weather
${hourlyRows.join("\n")}`}</pre>
                  </motion.section>

                  <motion.section
                    className="block"
                    {...blockMotion}
                    transition={{ ...blockMotion.transition, delay: 0.1 }}
                  >
                    <h2>[DAILY_7]</h2>
                    <pre>{`date         day temp  night    rain   sum     uv    sr        ss        weather
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

              <div className="fab-container">
                <AnimatePresence>
                  {showActions ? (
                    <motion.div
                      className="fab-menu"
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <motion.button
                        type="button"
                        className="fab-btn"
                        onClick={() => {
                          setShowSearchModal(true);
                          setShowActions(false);
                        }}
                        title="Open search modal"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 }}
                      >
                        Search City
                      </motion.button>
                      <motion.button
                        type="button"
                        className="fab-btn"
                        onClick={() => {
                          handleDeviceLocation();
                          setShowActions(false);
                        }}
                        title="Use your browser/device geolocation for current weather"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.06 }}
                      >
                        Use My Location
                      </motion.button>
                      <motion.button
                        type="button"
                        className="fab-btn"
                        onClick={() => {
                          handleSaveDefault();
                          setShowActions(false);
                        }}
                        title="Save the current location as your default startup location"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.09 }}
                      >
                        Save As Default
                      </motion.button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <motion.button
                  type="button"
                  className="fab-toggle"
                  onClick={() => setShowActions((prev) => !prev)}
                  whileTap={{ scale: 0.92 }}
                  title="Show or hide actions"
                >
                  {showActions ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
                {showSearchModal ? (
                  <motion.div
                    className="search-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={() => setShowSearchModal(false)}
                  >
                    <motion.div
                      className="search-modal"
                      initial={{ opacity: 0, y: 14, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="search-modal-title">search city</p>
                      <input
                        value={inputLocation}
                        onChange={(e) => setInputLocation(e.target.value)}
                        placeholder="type city name"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            void handleSearch();
                            setShowSearchModal(false);
                          }
                        }}
                      />
                      <div className="search-modal-actions">
                        <button
                          type="button"
                          onClick={() => {
                            setShowSearchModal(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void handleSearch();
                            setShowSearchModal(false);
                          }}
                        >
                          Search
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default App;
