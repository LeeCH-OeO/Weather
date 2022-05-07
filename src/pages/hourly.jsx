import {
  Card,
  CardContent,
  CardActionArea,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import styled from "styled-components";
import HourlyChart from "../components/hourlyChart";

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const convertDate = (date, offset) => {
  const d = new Date((date + offset) * 1000);
  return d.toISOString().substring(11, 16);
};
const MainContainer = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;
function Hourly({ data }) {
  const temp = [];
  const [clicked, setClicked] = useState(false);
  {
    data &&
      data.hourly.map((result) => {
        result.date = convertDate(result.dt, data.timezone_offset);
        temp.push(result);
      });
  }
  return (
    <MainContainer>
      <Card variant="outlined">
        <CardActionArea onClick={() => setClicked(!clicked)}>
          <CardContent>
            <Title>
              <Typography variant="h6">Hourly Forecast</Typography>
            </Title>
            <HourlyChart data={temp} />
            {clicked && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell align="right">Weather</TableCell>
                      <TableCell align="right">Temperture</TableCell>
                      <TableCell align="right">Feels like</TableCell>
                      <TableCell align="right">Precipitation</TableCell>
                      <TableCell align="right">Humidity</TableCell>
                      <TableCell align="right">Wind Speed</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.hourly.map((result) => {
                      return (
                        <TableRow key={result.dt}>
                          <TableCell>{result.date}</TableCell>
                          <TableCell align="right">
                            {result.weather[0].description}{" "}
                          </TableCell>
                          <TableCell align="right">{result.temp}℃</TableCell>
                          <TableCell align="right">
                            {result.feels_like}℃
                          </TableCell>
                          <TableCell align="right">{result.pop}</TableCell>
                          <TableCell align="right">
                            {result.humidity}%
                          </TableCell>
                          <TableCell align="right">
                            {result.wind_speed} m/h
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </MainContainer>
  );
}

export default Hourly;
