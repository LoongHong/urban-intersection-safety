export default function ConfidenceBar({ probability, prediction }) {
  const pct = Math.round(probability * 100)
  const color = prediction === 1 ? 'bg-attention' : 'bg-accent'
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Confidence</span>
        <span className="font-semibold text-ink">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
