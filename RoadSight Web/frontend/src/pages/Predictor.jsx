import { useState } from 'react'
import { featureOptions } from '../data/featureOptions'
import { predictRisk } from '../api/predict'
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
  num_units: 2,
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
  const [error, setError] = useState(null)

  const allCategoricalFilled = CATEGORICAL_FIELDS.every(({ key }) => form[key] !== '')

  function handleChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
    setResult(null)
    setError(null)
  }

  async function handlePredict() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await predictRisk({
        model: selectedModel,
        features: {
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
          num_units: Number(form.num_units),
        },
      })
      setResult(res)
    } catch (e) {
      setError(e?.response?.data?.detail || e.message || 'Backend call failed.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setForm(initialForm)
    setResult(null)
    setError(null)
  }

  const explanation =
    result != null
      ? result.prediction === 1
        ? 'The model detected conditions associated with elevated injury or damage risk at this intersection.'
        : 'Conditions suggest a low-severity outcome is most likely at this intersection.'
      : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Risk Predictor</h1>
        <p className="text-sm text-gray-400 mt-1">
          Select a model, fill in crash conditions, and get an instant risk classification.
        </p>
      </div>

      {/* Model selector */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Choose Model</p>
        <div className="grid grid-cols-3 gap-3">
          {MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => { setSelectedModel(m.id); setResult(null); setError(null) }}
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
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Temporal &amp; Units</p>

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

            {/* num_units number input */}
            <div>
              <label className={fieldLabel()}>Number of Units Involved</label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.num_units}
                onChange={e => handleChange('num_units', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Predict button */}
            <button
              onClick={handlePredict}
              disabled={!allCategoricalFilled || loading}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                allCategoricalFilled && !loading
                  ? 'bg-accent text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Predicting…' : 'Predict Risk'}
            </button>

            {/* Error */}
            {error && (
              <p className="text-sm text-attention font-medium">{error}</p>
            )}

            {/* Result card */}
            {result != null && (
              <div className="rounded-card border border-gray-100 bg-gray-50 p-4 space-y-3">
                <RiskBadge prediction={result.prediction} />
                <ConfidenceBar
                  probability={result.probability}
                  prediction={result.prediction}
                />
                <p className="text-xs text-gray-500">{explanation}</p>
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
    </div>
  )
}
