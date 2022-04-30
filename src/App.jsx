import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import Current from "./pages/current";
import Hourly from "./pages/hourly";
import Daily from "./pages/daily";
function App() {
  const [weatherData, setWeatherData] = useState("");
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    getLocation();
  }, []);
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((val) => {
        fetchData(val);
        fetchCity(val);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  const fetchData = async (position) => {
    await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=ca20b15c0e2800058d1de6ba9abe60f6&units=metric&lang=zh_tw`
    ).then((res) =>
      res.json().then((data) => {
        setWeatherData(data);
        console.log(data);
      })
    );
  };
  const fetchCity = async (position) => {
    await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&zoom=14`
    ).then((res) =>
      res.json().then((cityData) => {
        setCityName(`${cityData.display_name}  `);
      })
    );
  };
  return (
    <Container>
      <p>位置: {cityName} </p>
      <Navbar bg="light">
        <Navbar.Brand>天氣</Navbar.Brand>
        <Nav>
          <Nav.Link href="/">Current</Nav.Link>
          <Nav.Link href="/Hourly">Hourly</Nav.Link>
          <Nav.Link href="/Daily">Daily</Nav.Link>
        </Nav>
      </Navbar>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Current data={weatherData} />} />
          <Route path="/Hourly" element={<Hourly data={weatherData} />} />
          <Route path="/Daily" element={<Daily data={weatherData} />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
