import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const DEFAULT_COLORS = ['#22c55e', '#f97316', '#3b82f6', '#a855f7', '#14b8a6', '#eab308']
const RADIAN = Math.PI / 180

function renderPercentLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.04) return null
  const radius = innerRadius + (outerRadius - innerRadius) / 2
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function EDADonutChart({ data, nameKey, valueKey = 'count', colors = DEFAULT_COLORS }) {
  const total = data.reduce((sum, d) => sum + d[valueKey], 0)

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius={48}
          outerRadius={78}
          paddingAngle={2}
          label={renderPercentLabel}
          labelLine={false}
        >
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => `${v.toLocaleString()} (${((v / total) * 100).toFixed(1)}%)`} />
        <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
