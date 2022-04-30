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
const Location = styled.h2`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;
function App() {
  const [weatherData, setWeatherData] = useState("");
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    getLocation();
  }, []);
  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(locationData);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  const locationData = async (position) => {
    const data = await FetchData(position);
    const location = await FetchLocation(position);
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
          <Route path="/Hourly" element={<Hourly data={weatherData} />} />
          <Route path="/Daily" element={<Daily data={weatherData} />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
