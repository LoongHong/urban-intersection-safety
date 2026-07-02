from pydantic import BaseModel
from typing import Literal


class Features(BaseModel):
    weather_condition: str
    lighting_condition: str
    roadway_surface_cond: str
    road_defect: str
    alignment: str
    traffic_control_device: str
    trafficway_type: str
    first_crash_type: str
    crash_hour: int
    crash_day_of_week: int
    crash_month: int
    num_units: int


class PredictRequest(BaseModel):
    model: Literal["lightgbm", "xgboost", "gradient_boosting"]
    features: Features


class PredictResponse(BaseModel):
    prediction: int
    probability: float
    label: str


class ModelPrediction(BaseModel):
    model: str
    prediction: int
    probability: float
    label: str


class PredictAllResponse(BaseModel):
    results: list[ModelPrediction]
