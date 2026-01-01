import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-gray-400">
        No data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-medium text-gray-800">{data.date}</p>
          <p className="text-sm font-semibold text-green-600">
            Total: ${data.total?.toLocaleString()}
          </p>
          {data.details && (
            <div className="text-xs text-gray-600 mt-2">
              {Object.entries(data.details).map(([key, value]) => (
                <p key={key}>
                  {key}: ${value?.toLocaleString()}
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
          fill="#e0e7ff"
          isAnimationActive={true}
          name="Total Amount"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
