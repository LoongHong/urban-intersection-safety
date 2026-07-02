import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'

export default function EDABarChart({ data, xKey, yKey = 'count', color = '#22c55e', horizontal = false, unit = '', showPercent = false }) {
  const total = data.reduce((sum, d) => sum + d[yKey], 0)
  const percentFormatter = (v) => `${((v / total) * 100).toFixed(1)}%`

  if (horizontal) {
    const chartHeight = data.length * 44
    return (
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 120, right: showPercent ? 44 : 20, top: 4, bottom: 4 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey={xKey} tick={{ fontSize: 11 }} width={116} />
            <Tooltip formatter={(v) => showPercent ? `${v.toLocaleString()} (${percentFormatter(v)})` : `${v.toLocaleString()}${unit}`} />
            <Bar dataKey={yKey} fill={color} radius={[0, 4, 4, 0]} barSize={22}>
              {showPercent && (
                <LabelList dataKey={yKey} position="right" formatter={percentFormatter} style={{ fontSize: 11, fill: '#1a1a1a' }} />
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v) => v.toLocaleString()} />
        <Bar dataKey={yKey} radius={[4, 4, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
