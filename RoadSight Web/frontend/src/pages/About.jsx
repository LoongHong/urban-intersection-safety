import StatCard from '../components/StatCard'

const STACK = [
  'React 19', 'FastAPI', 'scikit-learn', 'XGBoost', 'LightGBM',
  'Python 3.11', 'Tailwind CSS', 'Recharts', 'Vite',
]

const DATASET_STATS = [
  { label: 'Raw Rows', value: '209,306' },
  { label: 'After Filtering', value: '163,676' },
  { label: 'Features Selected', value: '12' },
  { label: 'Class Split', value: '72.9% / 27.1%' },
]

const METHODOLOGY = [
  { title: 'Filter & Clean', desc: 'Filter to intersection-related crashes; drop UNKNOWN categorical rows' },
  { title: 'Label Risk', desc: <>Assign binary <code className="bg-gray-100 px-1 rounded text-xs">Risk_Level</code> from injury severity and damage fields</> },
  { title: 'Split Data', desc: 'Stratified 80/20 and 70/30 train/test splits (random_state=42)' },
  { title: 'Preprocess', desc: 'Two preprocessors: OrdinalEncoder+StandardScaler (tree models, 12 features); OneHotEncoder+StandardScaler (LR/SVM, 85 features)' },
  { title: 'Balance Classes', desc: "BorderlineSMOTE (kind='borderline-1') applied to training data → 50/50 class balance" },
  { title: 'Train Models', desc: '9 algorithms trained (baseline + RandomizedSearchCV tuned, 15 iterations, 3-fold CV, F1-macro scoring)' },
  { title: 'Save Best', desc: 'Top-4 models saved: LightGBM, XGBoost, Gradient Boosting, Random Forest (tuned)' },
]

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-card p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <h2 className="text-base font-semibold text-ink mb-3">{title}</h2>
      {children}
    </div>
  )
}

export default function About() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-ink">About RoadSight</h1>
        <p className="text-sm text-gray-400 mt-1">Traffic Accident Risk Classification</p>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Crashes Analysed" value="163,676" sub="Intersection-related, cleaned" />
        <StatCard label="At Risk Rate" value="27.1%" sub="44,361 crashes classified At Risk" accent />
        <StatCard label="Algorithms Compared" value="9" sub="Baseline + tuned, across 2 splits" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <Section title="Project Overview">
            <p className="text-sm text-gray-600 leading-relaxed">
              RoadSight is a binary risk classification system for intersection-related traffic crashes.
              It predicts whether a crash scenario is <span className="font-medium text-attention">At Risk</span> (likely to involve injuries or significant damage)
              or <span className="font-medium text-accent">Low Risk</span>, using environmental and temporal features recorded at the time of the crash.
            </p>
          </Section>

          <Section title="Dataset">
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium text-ink">Source:</span> Open traffic crash records dataset
            </p>
            <div className="grid grid-cols-2 gap-3">
              {DATASET_STATS.map(s => (
                <div key={s.label} className="bg-gray-50 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100">
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="text-sm font-bold text-ink mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <Section title="Methodology">
          <div>
            {METHODOLOGY.map((step, i) => (
              <div key={step.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 shrink-0 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  {i < METHODOLOGY.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                </div>
                <div className={i < METHODOLOGY.length - 1 ? 'pb-4' : ''}>
                  <p className="text-sm font-semibold text-ink">{step.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Section title="Tech Stack">
          <div className="flex flex-wrap gap-2">
            {STACK.map(t => (
              <span key={t} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">{t}</span>
            ))}
          </div>
        </Section>

        <Section title="Author">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">
              LH
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium text-ink">University:</span> Asia Pacific University of Technology & Innovation</p>
              <p><span className="font-medium text-ink">Programme:</span> Bachelor of Computer Science (Hons) in Data Science</p>
              <p><span className="font-medium text-ink">Year:</span> 2026</p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
