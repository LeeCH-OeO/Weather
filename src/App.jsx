import React from "react";
import { useState, useEffect, useRef } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LinearProgress from "@mui/material/LinearProgress";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SaveIcon from "@mui/icons-material/Save";

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
  const [inputLocation, setInputLocation] = useState("");
  const [currrentGeo, setCurrentGeo] = useState({
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    defaultlocation();
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
    setCurrentGeo((currrentGeo) => ({
      ...currrentGeo,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }));
  };
  const defaultlocation = async () => {
    if (JSON.parse(localStorage.getItem("location")) != null) {
      const data = await FetchData(
        JSON.parse(localStorage.getItem("location")).latitude,
        JSON.parse(localStorage.getItem("location")).longitude
      );
      const location = await FetchLocation(
        JSON.parse(localStorage.getItem("location")).latitude,
        JSON.parse(localStorage.getItem("location")).longitude
      );
      setWeatherData(data);
      setCityName(location);
    } else {
      const data = await FetchData(25.009172597250643, 121.52027756547784);
      const location = await FetchLocation(
        25.009172597250643,
        121.52027756547784
      );
      setWeatherData(data);
      setCityName(location);
    }
  };
  const handleClick = () => {
    if (inputLocation) {
      getGeoByInput(inputLocation);
      setInputLocation("");
    } else {
      alert("請輸入");
    }
  };
  const getGeoByInput = async (input) => {
    const res = await FetchGeo(input);
    try {
      const data = await FetchData(res.data[0].lat, res.data[0].lon);
      const location = await FetchLocation(res.data[0].lat, res.data[0].lon);
      setWeatherData(data);
      setCityName(location);
      setCurrentGeo((currrentGeo) => ({
        ...currrentGeo,
        latitude: res.data[0].lat,
        longitude: res.data[0].lon,
      }));
    } catch (error) {
      console.log(error);
      alert("location not found!");
    }
  };

  return (
    <>
      {weatherData && cityName ? (
        <Container>
          {cityName && (
            <>
              <Title>
                <Typography variant="h5">
                  {cityName.data.display_name}
                </Typography>
              </Title>
              <Title>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={inputLocation}
                  size="small"
                  onChange={(e) => {
                    setInputLocation(e.target.value);
                  }}
                />
                <IconButton onClick={handleClick} color="primary">
                  <SearchOutlinedIcon />
                </IconButton>
                <IconButton onClick={getLocation} color="secondary">
                  <LocationOnIcon />
                </IconButton>
                <IconButton
                  color="info"
                  onClick={() => {
                    if (currrentGeo.latitude && currrentGeo) {
                      localStorage.setItem(
                        "location",
                        JSON.stringify(currrentGeo)
                      );
                      alert(
                        "Set " +
                          cityName.data.display_name +
                          " as default location!"
                      );
                    } else {
                      alert("error");
                    }
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </Title>
            </>
          )}

          <Current data={weatherData} />

          <Hourly data={weatherData} />

          <Daily data={weatherData} />

          <Footer />
        </Container>
      ) : (
        <LinearProgress />
      )}
    </>
  );
}

export default App;
