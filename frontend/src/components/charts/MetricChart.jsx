import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MetricChart({
  title,
  data,
  dataKey,
  unit = "%",
  stroke = "#2563eb",
}) {
  return (
    <section className="chart-card">
      <div className="chart-heading">
        <h3>{title}</h3>
        <span>Last {data.length} samples</span>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              minTickGap={30}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              unit={unit}
            />

            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(2)}${unit}`,
                title,
              ]}
            />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default MetricChart;
