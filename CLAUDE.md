# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Final Year Project (FYP): Traffic accident **risk level classification** for intersection-related crashes in Chicago. Predicts a **binary** `Risk_Level` target (0 = Low Risk, 1 = At Risk) from environmental and temporal features.

**Dataset:** `traffic_accidents.csv` — 209,306 rows, 24 columns. Path is hardcoded in `datapreprocessing.ipynb`:
```
C:\Users\Acer\OneDrive - Asia Pacific University\Degree Y3S2\FYP\traffic_accidents.csv
```

## Notebook Workflow

Two notebooks run sequentially:

### 1. `datapreprocessing.ipynb`

**Filtering & cleaning:**
- Filters to intersection-only crashes (`intersection_related_i == 'Y'`) → 163,676 rows (35,621 dropped for UNKNOWN in 7 categorical cols; 30 duplicates removed)
- Drops rows where any of `weather_condition`, `lighting_condition`, `roadway_surface_cond`, `road_defect`, `traffic_control_device`, `alignment`, `trafficway_type` equals `UNKNOWN` — treated as missing, not imputed
- `prim_contributory_cause` has 55,193 UNKNOWN values but is excluded from features so it is not cleaned

**Target variable (`Risk_Level`)** — binary, assigned row-by-row via `assign_risk()`:
- **At Risk (1):** `injuries_fatal > 0` OR `most_severe_injury == 'FATAL'` OR `injuries_incapacitating > 0` OR `most_severe_injury == 'INCAPACITATING INJURY'` OR `most_severe_injury in ['NONINCAPACITATING INJURY', 'REPORTED, NOT EVIDENT']` OR (`damage == 'OVER $1,500'` AND `injuries_total > 0`)
- **Low Risk (0):** everything else
- Class distribution after assignment: 119,315 Low Risk (72.9%) vs 44,361 At Risk (27.1%)

**EDA visualisations** (inline display, not all saved to disk):
- Distributions of crash hour, day of week, month, damage categories, weather/lighting conditions, injury counts, crash severity
- Correlation matrix of all numerical columns → saved as `correlation_matrix.png`
- Class imbalance bar + pie chart → saved as `class_imbalance.png`

**Feature validation:**
- Chi-Square test for 8 categorical features vs `Risk_Level` — all significant (p < 0.05); `first_crash_type` is the strongest (χ² = 26,251), results saved to `chi_square_results.csv`
- One-Way ANOVA for 4 numerical features vs `Risk_Level` — all significant; boxplots saved to `anova_boxplots.png`

**Train/test splits** (both stratified, `random_state=42`):
- 80/20: train 130,940 rows / test 32,736 rows
- 70/30: train 114,573 rows / test 49,103 rows

**Preprocessing & oversampling:**
- Two `ColumnTransformer` preprocessors are fit separately for each split (80 and 70):
  - `preprocessor_lr`: StandardScaler (numerical) + OneHotEncoder `drop='first'` (categorical) → **85 features**
  - `preprocessor_tree`: StandardScaler (numerical) + OrdinalEncoder `unknown_value=-1` (categorical) → **12 features**
- **BorderlineSMOTE** (`kind='borderline-1'`, `k_neighbors=5`) applied to training arrays only → balances classes to 50/50 (95,451 each for 80/20 split; 83,520 each for 70/30 split)
- Raw pre-SMOTE tree arrays are also retained (needed for `BalancedRandomForestClassifier`)

**Saves to `fyp_preprocessed_data.pkl`** via `joblib.dump` — 20 keys:
- SMOTE-balanced train arrays + unmodified test arrays for both splits, in both LR (85-feature) and tree (12-feature) formats
- Raw (pre-SMOTE) tree train arrays for both splits (`X_train_80_tree_raw`, `y_train_80_raw`, etc.)
- All 4 preprocessor objects: `preprocessor_lr`, `preprocessor_tree`, `preprocessor_lr_70`, `preprocessor_tree_70`

### 2. `modeltraining.ipynb`

**Setup:**
- Loads `fyp_preprocessed_data.pkl` and unpacks all 20 keys
- `evaluate_model(model, X_test, y_test, model_name, split_label)` helper: prints accuracy, classification report, F1-macro, F1-weighted, ROC-AUC (binary, `y_proba[:, 1]`), saves confusion matrix PNG as `cm_{ModelName}_{split}.png`, and returns a results dict appended to a shared `results` list

**Models trained** — 9 algorithms × (baseline + tuned) × (80/20 + 70/30) = **36 evaluations total**:
- Tree preprocessor arrays (12 features): Random Forest, XGBoost, Gradient Boosting, Decision Tree, KNN, Extra Trees, LightGBM
- LR preprocessor arrays (85 features): Logistic Regression, SVM

**Hyperparameter tuning:** `RandomizedSearchCV` (15 iterations, 3-fold CV, `scoring='f1_macro'`, `n_jobs=-1`). Each tuning cell re-imports `RandomizedSearchCV` locally — this is intentional pattern, not a bug.

**Final comparison:** All 36 results collected into a `results_df` DataFrame, printed sorted by F1-macro descending, visualised as `master_heatmap.png` (seaborn heatmap) and `master_bar_chart.png` (grouped bar chart) for tuned 80/20 models only.

**Saved top-4 models** (80/20 baseline variants, `joblib.dump`):
- `model_gradient_boosting.pkl` — Gradient Boosting baseline
- `model_xgboost.pkl` — XGBoost baseline
- `model_lightgbm.pkl` — LightGBM baseline
- `model_random_forest.pkl` — Random Forest **tuned** (baseline RF underperformed)
- `preprocessor_tree.pkl` — tree preprocessor (80/20), required for inference

## Key Features Used

```python
selected_features = [
    # Categorical (8)
    'weather_condition', 'lighting_condition', 'roadway_surface_cond',
    'road_defect', 'alignment', 'traffic_control_device', 'trafficway_type',
    'first_crash_type',
    # Numerical (4)
    'crash_hour', 'crash_day_of_week', 'crash_month', 'num_units'
]
```

## Model Performance Summary

Best results (80/20 split, sorted by F1-macro):

| Model | Accuracy | F1-macro | F1-weighted | ROC-AUC |
|---|---|---|---|---|
| LightGBM (baseline) | 0.7788 | 0.6477 | 0.7461 | 0.7397 |
| XGBoost Tuned | 0.7792 | 0.6439 | 0.7444 | 0.7385 |
| LightGBM Tuned | 0.7790 | 0.6426 | 0.7437 | 0.7388 |
| Gradient Boosting Tuned | 0.7797 | 0.6408 | 0.7431 | 0.7386 |
| Random Forest Tuned | 0.7307 | 0.6410 | 0.7232 | 0.7036 |
| Logistic Regression / SVM | ~0.66 | ~0.63 | ~0.68 | ~0.73 |
| Decision Tree / KNN | ~0.67–0.69 | ~0.59–0.61 | ~0.68 | ~0.60–0.64 |

The gradient-boosting family (XGBoost, Gradient Boosting, LightGBM) dominates at ~78% accuracy. F1-macro (~0.64) is lower than accuracy because the minority At-Risk class (27.1%) is harder to predict even after BorderlineSMOTE. ROC-AUC is binary (probability of class 1). Results are consistent across 70/30 and 80/20 splits.

## Running the Notebooks

Open and run cells top-to-bottom in order:
```
datapreprocessing.ipynb  →  generates fyp_preprocessed_data.pkl
modeltraining.ipynb      →  loads pkl, trains all models, saves top 4
```

## Output Artifacts

| File | Generated by |
|------|-------------|
| `fyp_preprocessed_data.pkl` | `datapreprocessing.ipynb` |
| `correlation_matrix.png` | `datapreprocessing.ipynb` |
| `class_imbalance.png` | `datapreprocessing.ipynb` |
| `anova_boxplots.png` | `datapreprocessing.ipynb` |
| `chi_square_results.csv` | `datapreprocessing.ipynb` |
| `cm_{ModelName}_{split}.png` (36 files) | `modeltraining.ipynb` |
| `master_heatmap.png` | `modeltraining.ipynb` |
| `master_bar_chart.png` | `modeltraining.ipynb` |
| `model_gradient_boosting.pkl` | `modeltraining.ipynb` |
| `model_xgboost.pkl` | `modeltraining.ipynb` |
| `model_lightgbm.pkl` | `modeltraining.ipynb` |
| `model_random_forest.pkl` | `modeltraining.ipynb` |
| `preprocessor_tree.pkl` | `modeltraining.ipynb` |

Note: `fyp_preprocessed_data.pkl` and `model_random_forest.pkl` are in `.gitignore` (large files). The other model pkl files are committed.

## Dependencies

```
pandas, numpy, matplotlib, seaborn
scikit-learn (preprocessing, model_selection, ensemble, metrics)
imbalanced-learn (BorderlineSMOTE)
xgboost
lightgbm
scipy
joblib
```
