# RoadSight — Design Spec
**Date:** 2026-06-30
**Status:** Approved

---

## Context

RoadSight is a React web application built on top of a completed FYP machine-learning pipeline that classifies traffic accident risk (binary: Low Risk / At Risk) for intersection-related crashes. The app is intended as an **FYP presentation demo** — polished enough to impress examiners and demonstrate end-to-end system integration.

The ML pipeline already exists:
- 3 trained, serialised models: `model_lightgbm.pkl` (348 KB), `model_xgboost.pkl` (340 KB), `model_gradient_boosting.pkl` (475 KB)
- A fitted preprocessor: `preprocessor_tree.pkl` (6 KB) — OrdinalEncoder + StandardScaler for 12 features
- All results data (36 model evaluations, chi-square scores, EDA distributions) are fixed and known

---

## Architecture

**Two-server local setup:**

```
frontend/    React (Vite) — http://localhost:5173
backend/     FastAPI      — http://localhost:8000
```

```
User fills form
    → React POST /predict  { features: {...}, model: "lightgbm" }
    → FastAPI: preprocessor_tree.pkl.transform(input)
             → selected model.predict_proba()
    → Response: { prediction: 0|1, probability: 0.83, label: "At Risk" }
    → React renders result card
```

**Frontend tech stack:**
- React 18 + Vite
- React Router v6 (client-side routing, 4 pages)
- Tailwind CSS (styling)
- Recharts (all data visualisations)
- Axios (API calls to FastAPI)

**Backend tech stack:**
- FastAPI + Uvicorn
- joblib (load pkl files at startup)
- scikit-learn + LightGBM + XGBoost (inference only, no training)
- Pydantic (request/response validation)

---

## Pages & Features

### 1. Dashboard (`/`)

Purpose: Show what the underlying data looks like — EDA at a glance.

**Stat bar (top):**
- Total crashes analysed: 163,676
- At Risk rate: 27.1% (44,361 crashes)
- Total Injuries: 80,105

**EDA charts (hardcoded JSON from notebook outputs):**
1. Accidents by Hour of Day — bar chart (0–23)
2. Accidents by Day of Week — bar chart (Sun–Sat)
3. Accidents by Month — bar chart (Jan–Dec)
4. Damage Categories — bar chart (3 categories)
5. Top 10 Weather Conditions — horizontal bar
6. Lighting Conditions — horizontal bar
7. Most Severe Injury distribution — horizontal bar

All chart data lives in `frontend/src/data/chartData.js` (static, pre-populated from notebook outputs).

---

### 2. Risk Predictor (`/predictor`)

Purpose: Live inference — user inputs conditions, gets a binary risk prediction.

**Model selector (top):**
Dropdown with 3 options, each showing the model's F1-macro score (baseline 80/20 results — these match the saved pkl files):
- LightGBM (F1-macro: 0.6477)
- XGBoost (F1-macro: 0.6421)
- Gradient Boosting (F1-macro: 0.6609)

**Input form — two panels:**

*Environmental Conditions (8 dropdown selects):*

All dropdown option lists are hardcoded in `frontend/src/data/featureOptions.js` (extracted from notebook unique-value outputs — they never change).

| Field | Example values |
|---|---|
| Weather Condition | CLEAR, RAIN, SNOW, FOG/SMOKE/HAZE, … |
| Lighting Condition | DAYLIGHT, DARKNESS, DARKNESS, LIGHTED ROAD, … |
| Road Surface Condition | DRY, WET, SNOW OR SLUSH, ICE, … |
| Road Defect | NO DEFECTS, WORN SURFACE, RUT, HOLES, … |
| Alignment | STRAIGHT AND LEVEL, CURVE ON GRADE, … |
| Traffic Control Device | TRAFFIC SIGNAL, STOP SIGN, NO CONTROLS, … |
| Trafficway Type | DIVIDED - W/MEDIAN BARRIER, NOT DIVIDED, … |
| First Crash Type | REAR END, TURNING, ANGLE, SIDESWIPE, … |

*Temporal & Context (4 inputs):*
| Field | Type | Range |
|---|---|---|
| Crash Hour | slider + number | 0–23 |
| Day of Week | 7-button toggle | Sun / Mon / Tue / Wed / Thu / Fri / Sat |
| Month | select | Jan–Dec |
| Number of Units | number input | 1–10+ |

**Predict button** — disabled until all fields are filled, sends `POST /predict`.

**Result card (appears after prediction):**
- Risk badge: 🟢 **Low Risk** or 🔴 **At Risk**
- Confidence bar: e.g. "83% confident"
- One-line explanation: what the label means in plain language
- Reset button

**FastAPI endpoint:**
```
POST /predict
Body: { model: "lightgbm", features: { weather_condition: "CLEAR", crash_hour: 14, ... } }
Response: { prediction: 1, probability: 0.83, label: "At Risk" }
```

---

### 3. Model Performance (`/models`)

Purpose: Compare all trained models — justify the choice of LightGBM/XGBoost/Gradient Boosting.

**Split toggle:** 80/20 | 70/30 (filters the table)

**Comparison table** — all 9 models × 4 metrics, all data hardcoded from `results_df`:

| Model | Accuracy | F1-macro | F1-weighted | ROC-AUC |
|---|---|---|---|---|
| Best cell in each column is highlighted green |

**Bar chart** — Accuracy and F1-macro side by side per model (Recharts `BarChart`, data from same hardcoded table)

**Feature Importance section:**
- Horizontal bar chart of 8 categorical features ranked by chi-square statistic (from `chi_square_results.csv`)
- Title: "Chi-Square Feature Importance vs Risk Level"
- Ranks: first_crash_type (26,251) → alignment (21)

**Metric explanation card:**
- Brief note: why F1-macro is the primary metric (class imbalance: 72.9% / 27.1% means accuracy is misleading)

---

### 4. About (`/about`)

Purpose: Explain the project for examiners who want context.

**Sections:**
1. **Project Overview** — binary risk classification for intersection crashes, Chicago dataset
2. **Dataset** — 209,306 raw rows → filtered to 163,676 intersection crashes, 24 columns, source
3. **Methodology** — step-by-step: feature selection → UNKNOWN removal → Risk_Level labelling → stratified splits → BorderlineSMOTE → two preprocessors → 9 models × baseline + tuned
4. **Tech Stack** — badges: React, FastAPI, scikit-learn, XGBoost, LightGBM, Python, Tailwind
5. **Author / FYP info** — name, university, year

---

## Backend Structure

```
backend/
├── main.py          # FastAPI app, CORS, startup model loading, /predict route
├── schemas.py       # Pydantic PredictRequest / PredictResponse models
└── models/          # Copy of the 4 pkl files
    ├── model_lightgbm.pkl
    ├── model_xgboost.pkl
    ├── model_gradient_boosting.pkl
    └── preprocessor_tree.pkl
```

**`main.py` startup:** Load all 3 models and the preprocessor once at app start (not per-request). Store in a module-level dict `MODELS = { "lightgbm": ..., "xgboost": ..., "gradient_boosting": ... }`.

**CORS:** Allow `http://localhost:5173` (React dev server).

**Endpoints:**
- `GET /` — health check, returns `{ status: "ok" }`
- `POST /predict` — accepts `PredictRequest`, returns `PredictResponse`

---

## Frontend Structure

```
frontend/src/
├── pages/
│   ├── Dashboard.jsx
│   ├── Predictor.jsx
│   ├── ModelPerformance.jsx
│   └── About.jsx
├── components/
│   ├── Navbar.jsx
│   ├── StatCard.jsx
│   ├── RiskBadge.jsx
│   ├── ConfidenceBar.jsx
│   └── charts/
│       ├── EDABarChart.jsx      # reusable bar chart for EDA distributions
│       ├── ModelCompareChart.jsx
│       └── FeatureImportanceChart.jsx
├── data/
│   ├── chartData.js      # all hardcoded EDA distributions
│   └── modelResults.js   # all 36 model evaluation results
├── api/
│   └── predict.js        # Axios wrapper for POST /predict
└── App.jsx               # React Router setup
```

---

## Colour Scheme

| Element | Colour |
|---|---|
| At Risk badge / high values | Red `#EF4444` |
| Low Risk badge / good values | Green `#22C55E` |
| Primary accent | Blue `#3B82F6` |
| Background | Dark `#0F172A` (slate-900) |
| Card background | `#1E293B` (slate-800) |
| Text | White / slate-300 |

Dark theme — professional appearance, easier to read charts on screen.

---

## Verification

**Backend:**
1. `cd backend && uvicorn main:app --reload`
2. Open `http://localhost:8000/docs` — Swagger UI should show `/predict` endpoint
3. Send a test prediction via Swagger — should return `{ prediction, probability, label }`

**Frontend:**
1. `cd frontend && npm run dev`
2. Navigate to all 4 pages — no console errors
3. Fill the Predictor form → click Predict → result card appears with correct label and probability
4. Switch models in the dropdown → re-predict → different probability values
5. Model Performance table shows all 9 models, split toggle filters correctly
6. Dashboard charts render with data (no blank charts)
