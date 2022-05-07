import { useState } from "react";
import React from "react";

import styled from "styled-components";
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
import DailyChart from "../components/dailyChart";

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const MainContainer = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;
const convertDate = (date, offset) => {
  const d = new Date((date + offset) * 1000);
  return d.toISOString().substring(0, 10);
};
function Daily({ data }) {
  const temp = [];
  const [clicked, setClicked] = useState(false);
  {
    data &&
      data.daily.map((result) => {
        result.temp.date = convertDate(result.dt, data.timezone_offset);
        temp.push(result.temp);
      });
  }
  return (
    <MainContainer>
      <Card variant="outlined">
        <CardActionArea onClick={() => setClicked(!clicked)}>
          <CardContent>
            <Title>
              <Typography variant="h6">Daily Forecast</Typography>
            </Title>
            <DailyChart data={temp} />
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
                    {data.daily.map((result) => {
                      return (
                        <TableRow key={result.dt}>
                          <TableCell>{result.temp.date}</TableCell>
                          <TableCell align="right">
                            {result.weather[0].description}{" "}
                          </TableCell>
                          <TableCell align="right">
                            day: {result.temp.day}℃<br />
                            night: {result.temp.night}℃
                          </TableCell>
                          <TableCell align="right">
                            day: {result.feels_like.day}℃ <br />
                            night: {result.feels_like.night}℃
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

export default Daily;
