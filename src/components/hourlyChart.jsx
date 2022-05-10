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
          <XAxis dataKey="date" padding={{ left: 10, right: 10 }} />
          <Tooltip />
          <Legend verticalAlign="top" height={50} />
          <Line
            name="temperature(℃)"
            type="monotone"
            dataKey="temp"
            stroke="#002884"
            unit="℃"
            dot={false}
          />
          <Line
            name="feels like(℃)"
            type="monotone"
            dataKey="feels_like"
            stroke="#ba000d"
            unit="℃"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
export default HourlyChart;
