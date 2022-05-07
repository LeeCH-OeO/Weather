import React from "react";
import { useState, useEffect, useRef } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LinearProgress from "@mui/material/LinearProgress";
import styled from "styled-components";
import Current from "./pages/current";
import Hourly from "./pages/hourly";
import Daily from "./pages/daily";
import FetchData from "./api/fetchData";
import FetchLocation from "./api/fetchLocation";
import FetchGeo from "./api/fetchGeo";
import Footer from "./pages/footer";

const Title = styled.div`
  color: #3f51b5;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
`;
const Search = styled.div`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`;

function App() {
  const [weatherData, setWeatherData] = useState("");
  const [cityName, setCityName] = useState("");
  const [location, setLocation] = useState("");

  const currentRef = useRef();
  const hourlyRef = useRef();
  const dailyRef = useRef();

  useEffect(() => {
    getLocation();
  }, []);
  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(locationData, defaultlocation);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  const locationData = async (position) => {
    const data = await FetchData(
      position.coords.latitude,
      position.coords.longitude
    );
    const location = await FetchLocation(
      position.coords.latitude,
      position.coords.longitude
    );
    setWeatherData(data);
    setCityName(location);
  };
  const defaultlocation = async () => {
    const data = await FetchData(25.009172597250643, 121.52027756547784);
    const location = await FetchLocation(
      25.009172597250643,
      121.52027756547784
    );
    setWeatherData(data);
    setCityName(location);
  };
  const handleClick = () => {
    if (location) {
      getGeoByInput(location);
      setLocation("");
    } else {
      alert("請輸入");
    }
  };
  const getGeoByInput = async (input) => {
    const res = await FetchGeo(input);
    if (res.data[0]) {
      const data = await FetchData(res.data[0].lat, res.data[0].lon);
      const location = await FetchLocation(res.data[0].lat, res.data[0].lon);
      setWeatherData(data);
      setCityName(location);
    }
  };

  return (
    <>
      {weatherData && cityName ? (
        <Container>
          {cityName && (
            <Title>
              <Typography variant="h5">{cityName.data.display_name}</Typography>
              <Search>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={location}
                  size="small"
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
                <IconButton onClick={handleClick} color="primary">
                  <SearchOutlinedIcon />
                </IconButton>
              </Search>
            </Title>
          )}

          <div ref={currentRef}>
            <Current data={weatherData} />
          </div>
          <div ref={hourlyRef}>
            <Hourly data={weatherData} />
          </div>
          <div ref={dailyRef}>
            <Daily data={weatherData} />
          </div>

          <Footer />
        </Container>
      ) : (
        <LinearProgress />
      )}
    </>
  );
}

export default App;
