import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ModelCompareChart({ data }) {
  const baselineOnly = data.filter(d => d.type === 'Baseline')
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={baselineOnly} margin={{ top: 4, right: 4, bottom: 40, left: 0 }}>
        <XAxis dataKey="model" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
        <YAxis domain={[0.5, 0.85]} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="accuracy" fill="#22c55e" radius={[4, 4, 0, 0]} name="Accuracy" />
        <Bar dataKey="f1Macro" fill="#f97316" radius={[4, 4, 0, 0]} name="F1-Macro" />
      </BarChart>
    </ResponsiveContainer>
  )
}
