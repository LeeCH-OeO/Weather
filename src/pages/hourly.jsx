import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import styled from "styled-components";
import Chart from "./chrat";
const CityTitle = styled.h1`
  font-size: 1.5em;
  color: palevioletred;
  user-select: none;
`;
const WeatherData = styled.h1`
  user-select: none;
  font-size: 1.2em;
`;

const convertDate = (date) => {
  const d = new Date(date * 1000);
  return d.getHours() + ":00";
};

function Hourly({ data, city }) {
  return (
    <>
      {city && <CityTitle> {city.data.display_name} </CityTitle>}
      {data && <Chart data={data} />}
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
                <ListGroup horizontal>
                  <ListGroup.Item>
                    <WeatherData>{convertDate(result.dt)}</WeatherData>
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

export default Hourly;
