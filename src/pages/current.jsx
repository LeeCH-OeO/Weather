import { Card, ListGroup, Image } from "react-bootstrap";
import styled from "styled-components";
const convertDate = (date, offset) => {
  const d = new Date((date + offset) * 1000);
  console.log(d.toISOString());
  return d.toISOString();
};
const Description = styled.p`
  font-weight: bold;
  display: inline;
`;
const CityTitle = styled.h1`
  font-size: 1.5em;
  color: palevioletred;
  user-select: none;
`;
function Current({ data, city }) {
  return (
    <>
      {city && data && (
        <Card className="text-center">
          <Card.Body>
            <Card.Header>
              <CityTitle>
                {city.data.display_name} @{" "}
                {convertDate(data.current.dt, data.timezone_offset)}{" "}
              </CityTitle>
            </Card.Header>
            <Card.Title>
              <Description>
                {data.current.temp}℃{" "}
                {data.current.weather[0].description.toUpperCase()}
              </Description>
              <Image
                alt="weather icon"
                src={`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`}
              />
            </Card.Title>
            <Card.Body>
              <ListGroup horizontal className="text-center">
                <ListGroup.Item>
                  Feels like: {data.current.feels_like}°C
                </ListGroup.Item>
                <ListGroup.Item>
                  Humidity: {data.current.humidity}%
                </ListGroup.Item>
                <ListGroup.Item>
                  Visibility: {data.current.visibility}m
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export default Current;
