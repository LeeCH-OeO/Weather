// import { Card, ListGroup, Image } from "react-bootstrap";
import React, { useState } from "react";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActions, Typography, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const Description = styled.p`
  user-select: none;
  font-size: 2.5rem;
  display: inline;
  user-select: none;
  font-family: "Roboto";
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
`;
const MainContainer = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Alerts = styled.div`
  color: red;
  cursor: pointer;
`;
function Current({ data, aqi }) {
  const [clicked, setClicked] = useState(false);
  const [alertClicked, setAlertClicked] = useState(false);

  return (
    <MainContainer>
      <Card variant="outlined">
        <CardContent>
          <Description>
            {data.current.temp.toFixed(2)}℃
            <img
              src={`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`}
              alt={data.current.weather[0].description}
            />
          </Description>

          <br />
          <Typography variant="subtitle1">
            {data.current.weather[0].description}
          </Typography>
          {data.alerts &&
            data.alerts.map((result) => {
              return (
                <Alerts onClick={() => setAlertClicked(!alertClicked)}>
                  <Typography variant="h6">⚠️{result.event}</Typography>
                  <Typography variant="h6">
                    {alertClicked &&
                      `${result.description} – Issued by ${result.sender_name}`}
                  </Typography>
                </Alerts>
              );
            })}

          <CardActions>
            <Button onClick={() => setClicked(!clicked)}>
              {clicked ? "close" : "detail"}
            </Button>
          </CardActions>
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
                      {data.current.feels_like.toFixed(2)}℃
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
                  <TableRow>
                    <TableCell>Air Quality </TableCell>
                    <TableCell align="right">
                      {aqi.data.description} ({aqi.data.aqi})
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </MainContainer>
  );
}

export default Current;
