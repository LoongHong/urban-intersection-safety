import StatCard from '../components/StatCard'
import EDABarChart from '../components/charts/EDABarChart'
import {
  crashByHour, crashByDay, crashByMonth,
  damageCategories, weatherConditions, lightingConditions, severityDistribution,
} from '../data/chartData'

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-card p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-ink mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Traffic Accident Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Intersection-related crashes in Chicago — 163,676 records analysed</p>
      </div>

      {/* Stat bar */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Crashes Analysed" value="163,676" sub="Intersection-related only" />
        <StatCard label="At Risk Rate" value="27.1%" sub="44,361 crashes classified At Risk" accent />
        <StatCard label="Total Injuries" value="80,105" sub="Across all severity levels" />
      </div>

      {/* EDA charts grid */}
      <div className="grid grid-cols-3 gap-4">
        <ChartCard title="Accidents by Hour of Day">
          <EDABarChart data={crashByHour} xKey="hour" />
        </ChartCard>
        <ChartCard title="Accidents by Day of Week">
          <EDABarChart data={crashByDay} xKey="day" />
        </ChartCard>
        <ChartCard title="Accidents by Month">
          <EDABarChart data={crashByMonth} xKey="month" />
        </ChartCard>
        <ChartCard title="Damage Categories">
          <EDABarChart data={damageCategories} xKey="category" />
        </ChartCard>
        <ChartCard title="Top 10 Weather Conditions">
          <EDABarChart data={weatherConditions} xKey="condition" horizontal />
        </ChartCard>
        <ChartCard title="Lighting Conditions">
          <EDABarChart data={lightingConditions} xKey="condition" horizontal />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ChartCard title="Most Severe Injury Distribution">
          <EDABarChart data={severityDistribution} xKey="severity" horizontal color="#f97316" />
        </ChartCard>
      </div>
    </div>
  )
}
