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

function DailyChart({ data }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <YAxis />
          <XAxis dataKey="date" />
          <Legend verticalAlign="top" height={25} />
          <Line
            name="day temperature(℃)"
            type="monotone"
            dataKey="day"
            stroke="#8884d8"
            unit="℃"
          />
          <Line
            name="night temperature(℃)"
            type="monotone"
            dataKey="night"
            stroke="#f54453"
            unit="℃"
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
export default DailyChart;
