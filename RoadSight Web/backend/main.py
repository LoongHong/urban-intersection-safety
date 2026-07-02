import os
import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import Features, PredictRequest, PredictResponse, ModelPrediction, PredictAllResponse

app = FastAPI(title="RoadSight API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
MODELS = {}
PREPROCESSOR = None
FEATURE_NAMES = [
    'weather_condition', 'lighting_condition', 'roadway_surface_cond',
    'road_defect', 'alignment', 'traffic_control_device',
    'trafficway_type', 'first_crash_type',
    'crash_hour', 'crash_day_of_week', 'crash_month', 'num_units',
]


@app.on_event("startup")
def load_models():
    global PREPROCESSOR
    PREPROCESSOR = joblib.load(os.path.join(MODELS_DIR, "preprocessor_tree.pkl"))
    MODELS["lightgbm"] = joblib.load(os.path.join(MODELS_DIR, "model_lightgbm.pkl"))
    MODELS["xgboost"] = joblib.load(os.path.join(MODELS_DIR, "model_xgboost.pkl"))
    MODELS["gradient_boosting"] = joblib.load(os.path.join(MODELS_DIR, "model_gradient_boosting.pkl"))


@app.get("/")
def health():
    return {"status": "ok"}


def _features_to_row(f: Features) -> pd.DataFrame:
    return pd.DataFrame([[
        f.weather_condition, f.lighting_condition, f.roadway_surface_cond,
        f.road_defect, f.alignment, f.traffic_control_device,
        f.trafficway_type, f.first_crash_type,
        f.crash_hour, f.crash_day_of_week, f.crash_month, f.num_units,
    ]], columns=FEATURE_NAMES)


def _run_model(model, X):
    pred = int(model.predict(X)[0])
    prob = float(model.predict_proba(X)[0][pred])
    label = "At Risk" if pred == 1 else "Low Risk"
    return pred, prob, label


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    row = _features_to_row(req.features)
    X = PREPROCESSOR.transform(row)
    pred, prob, label = _run_model(MODELS[req.model], X)
    return PredictResponse(prediction=pred, probability=prob, label=label)


@app.post("/predict/all", response_model=PredictAllResponse)
def predict_all(features: Features):
    row = _features_to_row(features)
    X = PREPROCESSOR.transform(row)
    results = []
    for name, model in MODELS.items():
        pred, prob, label = _run_model(model, X)
        results.append(ModelPrediction(model=name, prediction=pred, probability=prob, label=label))
    return PredictAllResponse(results=results)
