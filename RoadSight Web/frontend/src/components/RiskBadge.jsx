export default function RiskBadge({ prediction }) {
  const isRisk = prediction === 1
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
        isRisk
          ? 'bg-orange-100 text-attention'
          : 'bg-green-100 text-accent'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${isRisk ? 'bg-attention' : 'bg-accent'}`} />
      {isRisk ? 'ATTENTION! At Risk' : 'GOOD — Low Risk'}
    </span>
  )
}
