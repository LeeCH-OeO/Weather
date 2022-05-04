import React from "react";
import { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import styled from "styled-components";
import Current from "./pages/current";
import Hourly from "./pages/hourly";
import Daily from "./pages/daily";
import FetchData from "./api/fetchData";
import FetchLocation from "./api/fetchLocation";
import FetchGeo from "./api/fetchGeo";
const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
  text-decoration: none;
  margin: auto;
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
    } else {
      console.log("location not found");
    }
  };

  return (
    <Container>
      <Navbar bg="light" sticky="top">
        <Nav>
          <Nav.Link
            onClick={() =>
              currentRef.current.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Current
          </Nav.Link>
          <Nav.Link
            onClick={() =>
              hourlyRef.current.scrollIntoView({ behavior: "smooth" })
            }
          >
            Hourly
          </Nav.Link>
          <Nav.Link
            onClick={() =>
              dailyRef.current.scrollIntoView({ behavior: "smooth" })
            }
          >
            Daily
          </Nav.Link>
        </Nav>
      </Navbar>
      <input
        placeholder="search"
        type="text"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
        }}
      ></input>
      <p>地點: {location} </p>
      <button onClick={handleClick}>search</button>
      <div ref={currentRef}>
        <Current data={weatherData} city={cityName} />
      </div>
      <div ref={hourlyRef}>
        <Hourly data={weatherData} city={cityName} />
      </div>
      <div ref={dailyRef}>
        <Daily data={weatherData} city={cityName} />
      </div>

      <Footer>
        <a
          href="https://github.com/LeeCH-OeO/Weather"
          style={{ textDecoration: "none" }}
        >
          Copyright © ChiHsuan-Lee
        </a>
      </Footer>
    </Container>
  );
}

export default App;
