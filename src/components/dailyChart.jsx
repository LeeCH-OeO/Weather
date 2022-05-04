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

function DailyChart({ data }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <YAxis />
          <XAxis dataKey="date" />
          <Legend verticalAlign="top" height={25} />
          <Area
            name="day temperature"
            type="monotone"
            dataKey="day"
            stroke="#8884d8"
            fill="#8884d8"
          />
          <Area
            name="night temperature"
            type="monotone"
            dataKey="night"
            stroke="#f54453"
            fill="#f54453"
          />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
export default DailyChart;
