import {
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  YAxis,
  XAxis,
  Tooltip,
} from "recharts";
import React from "react";

function HourlyChart({ data }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <YAxis />
          <XAxis dataKey="date" />
          <Tooltip />
          <Legend verticalAlign="top" height={25} />
          <Area
            name="temperature"
            type="monotone"
            dataKey="temp"
            stroke="#8884d8"
            activeDot={{ r: 3 }}
          />
          <CartesianGrid stroke="#ccc" />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
export default HourlyChart;
