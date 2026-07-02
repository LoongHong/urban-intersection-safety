import { useState } from 'react'
import { featureOptions } from '../data/featureOptions'
import { predictRisk, predictAllModels } from '../api/predict'
import RiskBadge from '../components/RiskBadge'
import ConfidenceBar from '../components/ConfidenceBar'

const MODELS = [
  { id: 'lightgbm', label: 'LightGBM', f1: '0.6477' },
  { id: 'xgboost', label: 'XGBoost', f1: '0.6421' },
  { id: 'gradient_boosting', label: 'Gradient Boosting', f1: '0.6609' },
]

const CATEGORICAL_FIELDS = [
  { key: 'weather_condition', label: 'Weather Condition' },
  { key: 'lighting_condition', label: 'Lighting Condition' },
  { key: 'roadway_surface_cond', label: 'Road Surface Condition' },
  { key: 'road_defect', label: 'Road Defect' },
  { key: 'alignment', label: 'Alignment' },
  { key: 'traffic_control_device', label: 'Traffic Control Device' },
  { key: 'trafficway_type', label: 'Trafficway Type' },
  { key: 'first_crash_type', label: 'First Crash Type' },
]

const DAY_BUTTONS = [
  { label: 'Sun', value: 1 },
  { label: 'Mon', value: 2 },
  { label: 'Tue', value: 3 },
  { label: 'Wed', value: 4 },
  { label: 'Thu', value: 5 },
  { label: 'Fri', value: 6 },
  { label: 'Sat', value: 7 },
]

const initialForm = {
  weather_condition: '',
  lighting_condition: '',
  roadway_surface_cond: '',
  road_defect: '',
  alignment: '',
  traffic_control_device: '',
  trafficway_type: '',
  first_crash_type: '',
  crash_hour: 12,
  crash_day_of_week: 1,
  crash_month: 1,
}

function fieldLabel(cls) {
  return `block text-xs font-medium text-gray-500 mb-1 ${cls || ''}`
}

function selectCls(hasValue) {
  return `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent ${
    hasValue ? 'border-gray-300 text-ink' : 'border-gray-200 text-gray-400'
  }`
}

export default function Predictor() {
  const [selectedModel, setSelectedModel] = useState('lightgbm')
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [compareResults, setCompareResults] = useState(null)
  const [compareLoading, setCompareLoading] = useState(false)
  const [error, setError] = useState(null)

  const allCategoricalFilled = CATEGORICAL_FIELDS.every(({ key }) => form[key] !== '')

  function buildFeatures() {
    return {
      weather_condition: form.weather_condition,
      lighting_condition: form.lighting_condition,
      roadway_surface_cond: form.roadway_surface_cond,
      road_defect: form.road_defect,
      alignment: form.alignment,
      traffic_control_device: form.traffic_control_device,
      trafficway_type: form.trafficway_type,
      first_crash_type: form.first_crash_type,
      crash_hour: Number(form.crash_hour),
      crash_day_of_week: Number(form.crash_day_of_week),
      crash_month: Number(form.crash_month),
      num_units: 2,
    }
  }

  function handleChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
    setResult(null)
    setCompareResults(null)
    setError(null)
  }

  async function handlePredict() {
    setLoading(true)
    setError(null)
    setResult(null)
    setCompareResults(null)
    try {
      const res = await predictRisk({ model: selectedModel, features: buildFeatures() })
      setResult(res)
    } catch (e) {
      setError(e?.response?.data?.detail || e.message || 'Backend call failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCompareAll() {
    setCompareLoading(true)
    setError(null)
    setResult(null)
    setCompareResults(null)
    try {
      const res = await predictAllModels(buildFeatures())
      setCompareResults(res)
    } catch (e) {
      setError(e?.response?.data?.detail || e.message || 'Backend call failed.')
    } finally {
      setCompareLoading(false)
    }
  }

  function handleReset() {
    setForm(initialForm)
    setResult(null)
    setCompareResults(null)
    setError(null)
  }

  const explanation =
    result != null
      ? result.prediction === 1
        ? 'The model detected conditions associated with elevated injury or damage risk at this intersection.'
        : 'Conditions suggest a low-severity outcome is most likely at this intersection.'
      : null

  const recommendation =
    result != null
      ? result.prediction === 1
        ? [
            'Consider enhanced traffic control measures (e.g. signal timing review, additional signage).',
            'This intersection configuration warrants priority monitoring and safety auditing.',
            'Pedestrian or cyclist involvement significantly increases severity — evaluate protective infrastructure.',
          ]
        : [
            'Current conditions suggest standard safety measures are adequate.',
            'Routine monitoring is sufficient for this intersection type.',
            'Continue periodic data collection to detect any emerging risk trends.',
          ]
      : null

  const compareSummary =
    compareResults != null
      ? (() => {
          const total = compareResults.length
          const atRiskCount = compareResults.filter(r => r.prediction === 1).length
          const unanimous = atRiskCount === 0 || atRiskCount === total
          const majorityLabel = atRiskCount * 2 >= total ? 'At Risk' : 'Low Risk'
          return { total, atRiskCount, unanimous, majorityLabel }
        })()
      : null

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-ink">Intersection Risk Predictor</h1>
        <p className="text-sm text-gray-400 mt-1">
          Given the current conditions at an intersection, predict whether a crash is likely to result in injury or significant damage — supporting prioritisation of traffic safety interventions.
        </p>
      </div>

      {/* Model selector */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Choose Model</p>
        <div className="grid grid-cols-3 gap-3">
          {MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => { setSelectedModel(m.id); setResult(null); setCompareResults(null); setError(null) }}
              className={`rounded-card border p-4 text-left transition-all ${
                selectedModel === m.id
                  ? 'border-accent bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="text-sm font-semibold text-ink">{m.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">F1-macro: {m.f1}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Two-panel form */}
      <div className="bg-white rounded-card border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Left panel — categorical dropdowns */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Conditions</p>
            {CATEGORICAL_FIELDS.map(({ key, label }) => (
              <div key={key}>
                <label className={fieldLabel()}>{label}</label>
                <select
                  value={form[key]}
                  onChange={e => handleChange(key, e.target.value)}
                  className={selectCls(form[key] !== '')}
                >
                  <option value="">Select…</option>
                  {featureOptions[key].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Right panel — numerical inputs + result */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Temporal</p>

            {/* crash_hour slider */}
            <div>
              <label className={fieldLabel()}>
                Crash Hour — <span className="text-ink font-semibold">{form.crash_hour}:00</span>
              </label>
              <input
                type="range"
                min={0}
                max={23}
                value={form.crash_hour}
                onChange={e => handleChange('crash_hour', Number(e.target.value))}
                className="w-full accent-accent"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                <span>0:00</span>
                <span>23:00</span>
              </div>
            </div>

            {/* crash_day_of_week toggle */}
            <div>
              <label className={fieldLabel()}>Day of Week</label>
              <div className="flex gap-1">
                {DAY_BUTTONS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => handleChange('crash_day_of_week', value)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      form.crash_day_of_week === value
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* crash_month select */}
            <div>
              <label className={fieldLabel()}>Month</label>
              <select
                value={form.crash_month}
                onChange={e => handleChange('crash_month', Number(e.target.value))}
                className={selectCls(true)}
              >
                {featureOptions.month.map((name, i) => (
                  <option key={name} value={i + 1}>{name}</option>
                ))}
              </select>
            </div>

            {/* Predict button */}
            <button
              onClick={handlePredict}
              disabled={!allCategoricalFilled || loading}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                loading
                  ? 'bg-accent/70 text-white cursor-wait'
                  : allCategoricalFilled
                    ? 'bg-accent text-white hover:bg-green-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading
                ? <span className="inline-flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Predicting…
                  </span>
                : 'Predict Risk'}
            </button>

            {/* Error */}
            {error && (
              <p className="text-sm text-attention font-medium">{error}</p>
            )}

            {/* Result card */}
            {result != null && (
              <div className="rounded-card border border-gray-100 bg-gray-50 p-4 space-y-3 animate-fade-in-up">
                <RiskBadge prediction={result.prediction} />
                <ConfidenceBar
                  probability={result.probability}
                  prediction={result.prediction}
                />
                <p className="text-xs text-gray-500">{explanation}</p>
                <div className={`rounded-lg p-3 ${result.prediction === 1 ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
                  <p className="text-xs font-semibold text-gray-600 mb-1.5">Recommended Actions</p>
                  <ul className="space-y-1">
                    {recommendation.map((r, i) => (
                      <li key={i} className="text-xs text-gray-500 flex gap-1.5">
                        <span className={result.prediction === 1 ? 'text-attention' : 'text-accent'}>•</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-accent underline hover:text-green-700"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare all models */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Compare All Models</p>
            <p className="text-xs text-gray-400 mt-0.5">Run the current input through every model at once to check for agreement</p>
          </div>
          <button
            onClick={handleCompareAll}
            disabled={!allCategoricalFilled || compareLoading}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
              compareLoading
                ? 'border-accent text-accent/70 cursor-wait'
                : allCategoricalFilled
                  ? 'border-accent text-accent hover:bg-green-50'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {compareLoading
              ? <span className="inline-flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  Comparing…
                </span>
              : 'Compare All Models'}
          </button>
        </div>

        {compareResults != null && (
          <div className="space-y-4 animate-fade-in-up">
            <div className={`rounded-card border p-4 text-sm font-semibold ${
              compareSummary.unanimous
                ? 'bg-green-50 border-accent text-ink'
                : 'bg-orange-50 border-orange-200 text-ink'
            }`}>
              {compareSummary.unanimous
                ? `${compareSummary.total}/${compareSummary.total} models agree: ${compareSummary.majorityLabel}`
                : `Models disagree — ${compareSummary.atRiskCount} At Risk, ${compareSummary.total - compareSummary.atRiskCount} Low Risk`}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {compareResults.map(r => (
                <div
                  key={r.model}
                  className="bg-white rounded-card border border-gray-100 p-4 space-y-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <p className="text-sm font-semibold text-ink">
                    {MODELS.find(m => m.id === r.model)?.label || r.model}
                  </p>
                  <RiskBadge prediction={r.prediction} />
                  <ConfidenceBar probability={r.probability} prediction={r.prediction} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
