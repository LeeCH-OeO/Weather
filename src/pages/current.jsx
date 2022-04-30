import { Card } from "react-bootstrap";
import styled from "styled-components";

const Description = styled.p`
  font-weight: bold;
  display: inline;
`;
function Current({ data, city }) {
  return (
    <>
      {city && data && (
        <Card className="text-center" bg="info">
          <Card.Body>
            <Card.Header>{city.data.display_name}</Card.Header>
            <Card.Title>
              <Description>
                {data.current.temp}℃{" "}
                {data.current.weather[0].description.toUpperCase()}
              </Description>
            </Card.Title>
            <Card.Body>
              Feels like: {data.current.feels_like}°C
              <br />
              Humidity: {data.current.humidity}%
            </Card.Body>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export default Current;
