import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function FeatureImportanceChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 140, right: 20, top: 4, bottom: 4 }}>
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} width={136} />
        <Tooltip formatter={(v) => v.toLocaleString()} />
        <Bar dataKey="chiSquare" fill="#22c55e" radius={[0, 4, 4, 0]} name="Chi-Square" />
      </BarChart>
    </ResponsiveContainer>
  )
}
