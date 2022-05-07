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
            stroke="#002884"
            unit="℃"
            dot={false}
          />
          <Line
            name="night temperature(℃)"
            type="monotone"
            dataKey="night"
            stroke="#ba000d"
            unit="℃"
            dot={false}
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
export default DailyChart;
