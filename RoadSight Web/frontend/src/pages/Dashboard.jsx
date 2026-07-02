import StatCard from '../components/StatCard'
import EDABarChart from '../components/charts/EDABarChart'
import EDAAreaChart from '../components/charts/EDAAreaChart'
import EDADonutChart from '../components/charts/EDADonutChart'
import RiskHeatmap from '../components/charts/RiskHeatmap'
import {
  crashByHour, crashByDay, crashByMonth,
  damageCategories, weatherConditions, lightingConditions, severityDistribution,
  intersectionRiskByControl, intersectionRiskByType,
} from '../data/chartData'

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-card p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5 mb-3">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-ink">Traffic Accident Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Intersection-related crashes — 163,676 records analysed</p>
      </div>

      {/* Stat bar */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Crashes Analysed" value="163,676" sub="Intersection-related only" />
        <StatCard label="At Risk Rate" value="27.1%" sub="44,361 crashes classified At Risk" accent />
        <StatCard label="Total Injuries" value="80,105" sub="Across all severity levels" />
      </div>

      {/* Key finding banner */}
      <div className="bg-white rounded-card border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Key Finding — Most Significant Risk Factor</p>
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">First Crash Type dominates intersection risk (χ² = 26,251)</p>
            <p className="text-xs text-gray-500 mt-1">
              Chi-square analysis across all 8 features shows crash type explains far more variance in outcome severity than
              weather, lighting, or road surface combined. Pedestrian and cyclist crashes carry the highest At Risk rate.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            {[
              { label: 'First Crash Type', chi: '26,251', highlight: true },
              { label: 'Traffic Control',  chi: '14,832', highlight: false },
              { label: 'Trafficway Type',  chi: '12,456', highlight: false },
              { label: 'Weather',          chi: '6,723',  highlight: false },
            ].map(f => (
              <div key={f.label} className={`rounded-lg px-3 py-2 text-center ${f.highlight ? 'bg-green-50 border border-accent' : 'bg-gray-50 border border-gray-100'}`}>
                <p className={`text-lg font-bold ${f.highlight ? 'text-accent' : 'text-ink'}`}>{f.chi}</p>
                <p className="text-xs text-gray-400 mt-0.5">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Intersection risk section */}
      <div>
        <h2 className="text-base font-semibold text-ink mb-3">Intersection Risk by Configuration</h2>
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="At Risk Rate by Traffic Control Device" subtitle="% of crashes resulting in injury or major damage">
            <EDABarChart data={intersectionRiskByControl} xKey="type" yKey="atRiskRate" color="#f97316" horizontal unit="%" />
          </ChartCard>
          <ChartCard title="At Risk Rate by Trafficway Type" subtitle="% of crashes resulting in injury or major damage">
            <EDABarChart data={intersectionRiskByType} xKey="type" yKey="atRiskRate" color="#f97316" horizontal unit="%" />
          </ChartCard>
        </div>
      </div>

      {/* Risk heatmap */}
      <ChartCard title="At Risk Rate by Day & Hour" subtitle="Crash severity pattern across the week — hover a cell for the exact rate">
        <RiskHeatmap />
      </ChartCard>

      {/* EDA charts grid */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-ink">Crash Volume Distributions</h2>
        <div className="grid grid-cols-3 gap-4">
          <ChartCard title="Accidents by Hour of Day">
            <EDAAreaChart data={crashByHour} xKey="hour" color="#3b82f6" />
          </ChartCard>
          <ChartCard title="Accidents by Day of Week">
            <EDAAreaChart data={crashByDay} xKey="day" color="#a855f7" />
          </ChartCard>
          <ChartCard title="Accidents by Month">
            <EDAAreaChart data={crashByMonth} xKey="month" color="#14b8a6" />
          </ChartCard>
          <ChartCard title="Damage Categories">
            <EDADonutChart data={damageCategories} nameKey="category" />
          </ChartCard>
          <ChartCard title="Lighting Conditions">
            <EDADonutChart data={lightingConditions} nameKey="condition" />
          </ChartCard>
          <ChartCard title="Most Severe Injury Distribution">
            <EDADonutChart data={severityDistribution} nameKey="severity" />
          </ChartCard>
        </div>
        <ChartCard title="Top 10 Weather Conditions">
          <EDABarChart data={weatherConditions} xKey="condition" horizontal color="#eab308" showPercent />
        </ChartCard>
      </div>
    </div>
  )
}
