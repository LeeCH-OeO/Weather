// import { Card, ListGroup, Image } from "react-bootstrap";
import React, { useState } from "react";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const convertDate = (date, offset) => {
  const d = new Date((date + offset) * 1000);
  return d.toISOString().substring(11, 16);
};
const Description = styled.p`
  user-select: none;
  font-size: 2em;
  display: inline;
  user-select: none;
`;
const CityTitle = styled.h1`
  font-size: 1.5em;
  color: palevioletred;
  user-select: none;
`;
function Current({ data, city }) {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      {city && data && (
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <CityTitle>
              Current Weather{" "}
              {convertDate(data.current.dt, data.timezone_offset)}
            </CityTitle>
            <Description>{data.current.temp}℃</Description>
            <img
              src={`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`}
            />
            <br /> {data.current.weather[0].description}
            {clicked && (
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Humidity</TableCell>
                      <TableCell align="right">
                        {data.current.humidity}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Feels like</TableCell>
                      <TableCell align="right">
                        {data.current.feels_like}℃
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cloudiness</TableCell>
                      <TableCell align="right">
                        {data.current.clouds}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Visibility</TableCell>
                      <TableCell align="right">
                        {data.current.visibility} m
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Wind speed</TableCell>
                      <TableCell align="right">
                        {data.current.wind_speed} m/h
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
          <CardActions>
            <Button onClick={() => setClicked(!clicked)}>
              {clicked ? "close" : "details"}
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
}

export default Current;
