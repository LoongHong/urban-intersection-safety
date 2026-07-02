import { useState } from 'react'
import { modelResults, featureImportance } from '../data/modelResults'
import ModelCompareChart from '../components/charts/ModelCompareChart'
import FeatureImportanceChart from '../components/charts/FeatureImportanceChart'
import StatCard from '../components/StatCard'

const METRICS = ['accuracy', 'f1Macro', 'f1Weighted', 'rocAuc']
const METRIC_LABELS = { accuracy: 'Accuracy', f1Macro: 'F1-Macro', f1Weighted: 'F1-Weighted', rocAuc: 'ROC-AUC' }

const RANK_BADGE = [
  'bg-yellow-400 text-white',
  'bg-gray-300 text-white',
  'bg-orange-300 text-white',
]

export default function ModelPerformance() {
  const [split, setSplit] = useState('80/20')
  const data = modelResults[split]

  const best = {}
  METRICS.forEach(m => {
    best[m] = Math.max(...data.map(r => r[m]))
  })

  const sorted = [...data].sort((a, b) => b.f1Macro - a.f1Macro)
  const top = sorted[0]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Model Performance</h1>
          <p className="text-sm text-gray-400 mt-1">Comparison of all 9 models across baseline and tuned variants</p>
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-full p-1">
          {['80/20', '70/30'].map(s => (
            <button
              key={s}
              onClick={() => setSplit(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                split === s ? 'bg-ink text-white' : 'text-gray-500 hover:text-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Best Model" value={top.model} sub={top.type} />
        <StatCard label="Top F1-Macro" value={top.f1Macro.toFixed(4)} sub={`${split} split`} accent />
        <StatCard label="Accuracy at Best F1" value={top.accuracy.toFixed(4)} sub={top.model} />
      </div>

      {/* Metric note */}
      <div className="bg-orange-50 border border-orange-200 rounded-card p-4 text-sm text-gray-600">
        <span className="font-semibold text-attention">Primary metric: F1-Macro.</span>{' '}
        Class imbalance (72.9% Low Risk / 27.1% At Risk) makes accuracy misleading. F1-Macro weights both classes equally, penalising poor minority-class recall.
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-card shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Rank</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Model</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Type</th>
                {METRICS.map(m => (
                  <th key={m} className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase">
                    {METRIC_LABELS[m]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-50 transition-colors ${
                    i === 0 ? 'bg-green-50/60 border-l-2 border-l-accent hover:bg-green-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      RANK_BADGE[i] || 'bg-gray-100 text-gray-400'
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-ink">{row.model}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      row.type === 'Tuned' ? 'bg-green-100 text-accent' : 'bg-gray-100 text-gray-500'
                    }`}>{row.type}</span>
                  </td>
                  {METRICS.map(m => (
                    <td key={m} className={`px-4 py-2.5 text-right font-mono text-sm ${
                      row[m] === best[m] ? 'text-accent font-bold' : 'text-gray-600'
                    }`}>
                      {row[m].toFixed(4)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-card p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <h3 className="text-sm font-semibold text-ink mb-4">Accuracy vs F1-Macro (Baseline)</h3>
          <ModelCompareChart data={data} />
        </div>
        <div className="bg-white rounded-card p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <h3 className="text-sm font-semibold text-ink mb-4">Chi-Square Feature Importance vs Risk Level</h3>
          <FeatureImportanceChart data={featureImportance} />
        </div>
      </div>
    </div>
  )
}
