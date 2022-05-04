import React from "react";
import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import styled from "styled-components";
import HourlyChart from "../components/hourlyChart";
const CityTitle = styled.h1`
  font-size: 1.5em;
  color: palevioletred;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const WeatherData = styled.h1`
  user-select: none;
  font-size: 1.2em;
`;

const convertDate = (date, offset) => {
  const d = new Date((date + offset) * 1000);
  return d.toISOString().substring(11, 16);
};

function Hourly({ data, city }) {
  const temp = [];
  {
    data &&
      data.hourly.map((result) => {
        result.date = convertDate(result.dt, data.timezone_offset);
        temp.push(result);
      });
  }
  return (
    <>
      {city && (
        <>
          <CityTitle>{city.data.display_name}</CityTitle>
          <CityTitle>Hourly forecast</CityTitle>
        </>
      )}
      {data && <HourlyChart data={temp} />}
      {data && (
        <ListGroup>
          {data.hourly.map((result) => {
            const [clicked, setClicked] = useState(false);
            return (
              <ListGroup.Item
                key={result.dt}
                onClick={() => {
                  setClicked(!clicked);
                }}
              >
                <ListGroup horizontal="sm">
                  <ListGroup.Item>
                    <WeatherData>
                      {convertDate(result.dt, data.timezone_offset)}
                    </WeatherData>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {" "}
                    <WeatherData>
                      {result.temp}℃ {result.weather[0].description}
                    </WeatherData>{" "}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <WeatherData>Precipitation: {result.pop}</WeatherData>
                  </ListGroup.Item>
                </ListGroup>
                {clicked && (
                  <WeatherData>Humidity: {result.humidity}%</WeatherData>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </>
  );
}

export default Hourly;
