import { useState } from "react";
import React from 'react'
import { ListGroup } from "react-bootstrap";
import styled from "styled-components";
const CityTitle = styled.h1`
  font-size: 1.5em;
  color: palevioletred;
  user-select: none;
`;
const WeatherData = styled.h1`
  user-select: none;
  font-size: 1.2em;
`;
const convertDate = (date, offset) => {
  const d = new Date((date + offset) * 1000);
  return d.toISOString().substring(0, 10);
};
function Daily({ data, city }) {
  return (
    <>
      {city && <CityTitle> {city.data.display_name} </CityTitle>}
      {data && (
        <ListGroup>
          {data.daily.map((result) => {
            const [clicked, setClicked] = useState(false);
            return (
              <ListGroup.Item
                key={result.dt}
                onClick={() => {
                  setClicked(!clicked);
                }}
              >
                <ListGroup horizontal>
                  <ListGroup.Item>
                    <WeatherData>
                      {convertDate(result.dt, data.timezone_offset)}
                    </WeatherData>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {" "}
                    <WeatherData>
                      Day: {result.temp.day}℃ Night: {result.temp.night}{" "}
                    </WeatherData>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <WeatherData>{result.weather[0].description}</WeatherData>
                  </ListGroup.Item>
                </ListGroup>
                {clicked ? (
                  <WeatherData>Humidity: {result.humidity}%</WeatherData>
                ) : (
                  ""
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </>
  );
}

export default Daily;
