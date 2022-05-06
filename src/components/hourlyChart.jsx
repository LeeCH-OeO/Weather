import {
  ResponsiveContainer,
  Legend,
  YAxis,
  XAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import React from "react";

function HourlyChart({ data }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <YAxis />
          <XAxis dataKey="date" />
          <Tooltip />
          <Legend verticalAlign="top" height={25} />
          <Line
            name="temperature(℃)"
            type="monotone"
            dataKey="temp"
            stroke="#8884d8"
            unit="℃"
          />
          <Line
            name="feels like(℃)"
            type="monotone"
            dataKey="feels_like"
            stroke="#f3601c"
            unit="℃"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
export default HourlyChart;
