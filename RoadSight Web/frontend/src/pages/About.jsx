const STACK = [
  'React 18', 'FastAPI', 'scikit-learn', 'XGBoost', 'LightGBM',
  'Python 3.11', 'Tailwind CSS', 'Recharts', 'Vite',
]

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-card p-6 shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold text-ink mb-3">{title}</h2>
      {children}
    </div>
  )
}

export default function About() {
  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">About RoadSight</h1>
        <p className="text-sm text-gray-400 mt-1">Final Year Project — Traffic Accident Risk Classification</p>
      </div>

      <Section title="Project Overview">
        <p className="text-sm text-gray-600 leading-relaxed">
          RoadSight is a binary risk classification system for intersection-related traffic crashes in Chicago.
          It predicts whether a crash scenario is <span className="font-medium text-attention">At Risk</span> (likely to involve injuries or significant damage)
          or <span className="font-medium text-accent">Low Risk</span>, using environmental and temporal features recorded at the time of the crash.
        </p>
      </Section>

      <Section title="Dataset">
        <div className="text-sm text-gray-600 space-y-1.5">
          <p><span className="font-medium text-ink">Source:</span> Chicago Data Portal — Traffic Crashes dataset</p>
          <p><span className="font-medium text-ink">Raw rows:</span> 209,306</p>
          <p><span className="font-medium text-ink">After filtering:</span> 163,676 (intersection-related, UNKNOWN removed, duplicates dropped)</p>
          <p><span className="font-medium text-ink">Features:</span> 24 columns → 12 selected (8 categorical, 4 numerical)</p>
          <p><span className="font-medium text-ink">Class distribution:</span> 72.9% Low Risk / 27.1% At Risk</p>
        </div>
      </Section>

      <Section title="Methodology">
        <ol className="text-sm text-gray-600 space-y-1.5 list-decimal list-inside">
          <li>Filter to intersection-related crashes; drop UNKNOWN categorical rows</li>
          <li>Assign binary <code className="bg-gray-100 px-1 rounded text-xs">Risk_Level</code> from injury severity and damage fields</li>
          <li>Stratified 80/20 and 70/30 train/test splits (random_state=42)</li>
          <li>Two preprocessors: OrdinalEncoder+StandardScaler (tree models, 12 features); OneHotEncoder+StandardScaler (LR/SVM, 85 features)</li>
          <li>BorderlineSMOTE (kind='borderline-1') applied to training data → 50/50 class balance</li>
          <li>9 algorithms trained (baseline + RandomizedSearchCV tuned, 15 iterations, 3-fold CV, F1-macro scoring)</li>
          <li>Top-4 models saved: LightGBM, XGBoost, Gradient Boosting, Random Forest (tuned)</li>
        </ol>
      </Section>

      <Section title="Tech Stack">
        <div className="flex flex-wrap gap-2">
          {STACK.map(t => (
            <span key={t} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">{t}</span>
          ))}
        </div>
      </Section>

      <Section title="Author">
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium text-ink">University:</span> Asia Pacific University of Technology & Innovation</p>
          <p><span className="font-medium text-ink">Programme:</span> Bachelor of Computer Science (Hons) in Data Science</p>
          <p><span className="font-medium text-ink">Year:</span> 2026</p>
        </div>
      </Section>
    </div>
  )
}
