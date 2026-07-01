export default function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-card p-5 shadow-sm border border-gray-100">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-4xl font-bold ${accent ? 'text-accent' : 'text-ink'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}
