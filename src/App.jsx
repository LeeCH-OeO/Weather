import React from "react";
import { useState, useEffect } from "react";
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
  const handleOnchange = (e) => {
    setLocation(e.target.value);
  };
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
    getGeoByInput(location);
    setLocation("");
  };
  const getGeoByInput = async (input) => {
    const res = await FetchGeo(input);
    console.log(res.data[0].lat, res.data[0].lon);
    const data = await FetchData(res.data[0].lat, res.data[0].lon);
    const location = await FetchLocation(res.data[0].lat, res.data[0].lon);
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
      <input
        placeholder="search"
        type="text"
        value={location}
        onChange={handleOnchange}
      ></input>
      <p>地點: {location} </p>
      <button onClick={handleClick}>search</button>
      <Current data={weatherData} city={cityName} />
      <Hourly data={weatherData} city={cityName} />
      <Daily data={weatherData} city={cityName} />

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
