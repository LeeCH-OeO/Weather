import {
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  YAxis,
} from "recharts";
import React from 'react'

function Chart({ data }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data.hourly}>
          <YAxis />
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
export default Chart;
