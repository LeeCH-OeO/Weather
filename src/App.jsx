import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import styled, { css } from "styled-components";

import Current from "./pages/current";
import Hourly from "./pages/hourly";
import Daily from "./pages/daily";
import FetchData from "./api/fetchData";
import FetchLocation from "./api/fetchLocation";
const Footer = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
  text-decoration: none;
`;
function App() {
  const [weatherData, setWeatherData] = useState("");
  const [cityName, setCityName] = useState("");

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

  return (
    <Container>
      <Navbar bg="light">
        <Nav>
          <Nav.Link href="/">Current</Nav.Link>
          <Nav.Link href="/Hourly">Hourly</Nav.Link>
          <Nav.Link href="/Daily">Daily</Nav.Link>
        </Nav>
      </Navbar>

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Current data={weatherData} city={cityName} />}
          />
          <Route
            path="/Hourly"
            element={<Hourly data={weatherData} city={cityName} />}
          />
          <Route
            path="/Daily"
            element={<Daily data={weatherData} city={cityName} />}
          />
        </Routes>
      </BrowserRouter>
      <Footer href="https://github.com/LeeCH-OeO/Weather">
        Copyright © ChiHsuan-Lee
      </Footer>
    </Container>
  );
}

export default App;
