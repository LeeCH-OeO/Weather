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
`;
const MainContainer = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
function Current({ data }) {
  const [clicked, setClicked] = useState(false);
  return (
    <MainContainer>
      <Card sx={{ maxWidth: 345 }} variant="outlined">
        <CardContent>
          <Typography variant="h6">Current Weather</Typography>
          <Description>{data.current.temp}℃</Description>
          <img
            src={`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`}
          />
          <br />
          <Typography variant="subtitle1">
            {data.current.weather[0].description}
          </Typography>
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
            {clicked ? "close" : "detail"}
          </Button>
        </CardActions>
      </Card>
    </MainContainer>
  );
}

export default Current;
