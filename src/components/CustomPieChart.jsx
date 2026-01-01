import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomPieChart = ({ data, colors, label, totalAmount }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-gray-400">
        No data available
      </div>
    );
  }

  // Default colors for pie slices
  const COLORS = colors || [
    '#4F46E5', // purple
    '#10b981', // green
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-medium text-gray-800">{data.name}</p>
          <p className="text-sm font-semibold text-blue-600">
            ${data.payload.amount?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Center label component
  const CenterLabel = ({ viewBox }) => {
    const { cx, cy } = viewBox;
    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-medium fill-gray-600"
        >
          {label || "Total"}
        </text>
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold fill-gray-900"
        >
          ${totalAmount || '0'}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={80}
          outerRadius={120}
          fill="#8884d8"
          dataKey="amount"
          isAnimationActive={true}
          strokeWidth={2}
          stroke="#fff"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          wrapperStyle={{ paddingTop: '20px' }}
        />
        {/* Center label */}
        <text x="50%" y="40%" textAnchor="middle" dominantBaseline="middle">
          <tspan x="50%" dy="-10" className="text-sm font-medium fill-gray-600">
            {label || "Total"}
          </tspan>
          <tspan x="50%" dy="30" className="text-2xl font-bold fill-gray-900">
            ${totalAmount || '0'}
          </tspan>
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
