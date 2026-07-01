import { riskHeatmap } from '../../data/chartData'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

function rateToColor(rate) {
  // 18% = green, 35% = orange, 50% = red
  const t = Math.min(1, Math.max(0, (rate - 18) / 32))
  if (t < 0.5) {
    const u = t * 2
    return `rgb(${Math.round(34 + u * (249 - 34))}, ${Math.round(197 + u * (115 - 197))}, ${Math.round(94 + u * (22 - 94))})`
  }
  const u = (t - 0.5) * 2
  return `rgb(${Math.round(249 + u * (239 - 249))}, ${Math.round(115 + u * (68 - 115))}, ${Math.round(22 + u * (22 - 22))})`
}

export default function RiskHeatmap() {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 text-xs text-gray-400 mb-1 ml-9">
        {HOURS.map(h => (
          <div key={h} className="w-6 text-center shrink-0">{h % 3 === 0 ? h : ''}</div>
        ))}
      </div>
      <div className="space-y-1">
        {DAYS.map((day, d) => (
          <div key={day} className="flex items-center gap-1">
            <div className="w-8 text-xs text-gray-400 text-right shrink-0">{day}</div>
            {HOURS.map(h => {
              const rate = riskHeatmap[d][h]
              return (
                <div
                  key={h}
                  className="w-6 h-6 rounded-sm shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: rateToColor(rate) }}
                  title={`${day} ${h}:00 — At Risk rate: ${rate}%`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-gray-400">Lower risk</span>
        <div className="flex h-3 w-32 rounded-sm overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: rateToColor(18 + i * 1.6) }} />
          ))}
        </div>
        <span className="text-xs text-gray-400">Higher risk</span>
      </div>
    </div>
  )
}
