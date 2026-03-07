# Data Format Reference — SP Energy Pulse (CekCek)

> Comprehensive reference for every data structure in the backend:
> ClickHouse tables, SQLite tables, Pydantic models, and API response shapes.

---

## 1. ClickHouse Tables (Database: `CekCek`)

### 1.1 `consumption`

Half-hourly energy consumption readings for a household over 13 months.

| Column         | Type                                                  | Description                                   |
| -------------- | ----------------------------------------------------- | --------------------------------------------- |
| `household_id` | `String`                                              | Household identifier (e.g. `"wei_ling_demo"`) |
| `timestamp`    | `DateTime`                                            | Start of the 30-min interval                  |
| `kwh`          | `Float32`                                             | Energy consumed in this slot (kWh)            |
| `day_type`     | `Enum8('weekday'=1, 'weekend'=2, 'public_holiday'=3)` | Type of day                                   |
| `time_slot`    | `UInt8`                                               | Slot index 0–47 (0 = 00:00, 47 = 23:30)       |
| `month`        | `UInt8`                                               | Calendar month 1–12                           |
| `year`         | `UInt16`                                              | Calendar year                                 |

**Engine**: `MergeTree()` · **Order**: `(household_id, timestamp)` · **Partition**: `toYYYYMM(timestamp)`
**Row count**: ~19,056 (397 days × 48 slots)
**Date range**: 2024-01-01 → 2025-01-31

---

### 1.2 `cohort_baselines`

Statistical baselines for a cohort of similar HDB households, used for percentile comparison.

| Column           | Type                                                  | Description                            |
| ---------------- | ----------------------------------------------------- | -------------------------------------- |
| `hdb_type`       | `String`                                              | HDB flat type (e.g. `"4-room"`)        |
| `household_size` | `UInt8`                                               | Number of occupants                    |
| `month`          | `UInt8`                                               | Calendar month 1–12                    |
| `time_slot`      | `UInt8`                                               | Slot index 0–47                        |
| `day_type`       | `Enum8('weekday'=1, 'weekend'=2, 'public_holiday'=3)` | Type of day                            |
| `p25_kwh`        | `Float32`                                             | 25th percentile kWh                    |
| `p50_kwh`        | `Float32`                                             | 50th percentile (median) kWh           |
| `p75_kwh`        | `Float32`                                             | 75th percentile kWh                    |
| `p90_kwh`        | `Float32`                                             | 90th percentile kWh                    |
| `mean_kwh`       | `Float32`                                             | Mean kWh                               |
| `sample_size`    | `UInt32`                                              | Number of synthetic households sampled |

**Engine**: `MergeTree()` · **Order**: `(hdb_type, household_size, month, time_slot, day_type)`
**Row count**: 1,152 (12 months × 48 slots × 2 day types)

---

### 1.3 `grid_demand`

Half-hourly national grid demand over 30 days.

| Column            | Type                                                  | Description                           |
| ----------------- | ----------------------------------------------------- | ------------------------------------- |
| `timestamp`       | `DateTime`                                            | Start of the 30-min interval          |
| `demand_mw`       | `Float32`                                             | Grid demand in megawatts              |
| `capacity_mw`     | `Float32`                                             | Total grid capacity (fixed 10,000 MW) |
| `utilisation_pct` | `Float32`                                             | `demand / capacity × 100`             |
| `time_slot`       | `UInt8`                                               | Slot index 0–47                       |
| `day_type`        | `Enum8('weekday'=1, 'weekend'=2, 'public_holiday'=3)` | Type of day                           |

**Engine**: `MergeTree()` · **Order**: `timestamp`
**Row count**: 1,440 (30 days × 48 slots)
**Date range**: 2025-01-01 → 2025-01-30

---

### 1.4 `appliance_signatures`

Reference data for common household appliances.

| Column                 | Type      | Description                                 |
| ---------------------- | --------- | ------------------------------------------- |
| `appliance_name`       | `String`  | e.g. `"aircon"`, `"fridge"`, `"dryer"`      |
| `tick_rating`          | `UInt8`   | Energy efficiency tick rating (0–5)         |
| `typical_watt_min`     | `UInt16`  | Min wattage draw                            |
| `typical_watt_max`     | `UInt16`  | Max wattage draw                            |
| `avg_daily_kwh`        | `Float32` | Average daily consumption                   |
| `monthly_cost_sgd`     | `Float32` | Estimated monthly cost (standard tariff)    |
| `monthly_cost_tou`     | `Float32` | Estimated monthly cost (Time-of-Use tariff) |
| `spike_duration_slots` | `UInt8`   | Typical spike length in 30-min slots        |

**Engine**: `MergeTree()` · **Order**: `(appliance_name, tick_rating)`
**Row count**: 8

**Seeded appliances**: `aircon`, `fridge`, `washing_machine`, `dryer`, `water_heater`, `oven`, `ev_charger`, `standby_load`

---

## 2. SQLite Tables (File: `demo.db`)

Local state for the demo user session.

### 2.1 `user`

| Column                | Type                  | Default        |
| --------------------- | --------------------- | -------------- |
| `id`                  | `INTEGER PRIMARY KEY` | auto           |
| `name`                | `TEXT`                | `'Wei Ling'`   |
| `hdb_type`            | `TEXT`                | `'4-room'`     |
| `household_size`      | `INTEGER`             | `4`            |
| `tou_enrolled`        | `INTEGER`             | `0`            |
| `analogy_persona`     | `TEXT`                | `'commuter'`   |
| `analogy_unit`        | `TEXT`                | `'bubble_tea'` |
| `grid_familiarity`    | `TEXT`                | `'low'`        |
| `onboarding_complete` | `INTEGER`             | `0`            |

### 2.2 `points`

| Column         | Type                  | Default |
| -------------- | --------------------- | ------- |
| `id`           | `INTEGER PRIMARY KEY` | auto    |
| `total`        | `INTEGER`             | `0`     |
| `last_updated` | `TEXT`                | `NULL`  |

### 2.3 `badges`

| Column      | Type               | Default |
| ----------- | ------------------ | ------- |
| `id`        | `TEXT PRIMARY KEY` | —       |
| `earned`    | `INTEGER`          | `0`     |
| `earned_at` | `TEXT`             | `NULL`  |

**Seeded badges**: `grid_hero`, `streak_7`, `first_label`

### 2.4 `spike_labels`

| Column        | Type               |
| ------------- | ------------------ |
| `spike_id`    | `TEXT PRIMARY KEY` |
| `appliance`   | `TEXT`             |
| `labelled_at` | `TEXT`             |

### 2.5 `appliance_profile`

| Column           | Type               |
| ---------------- | ------------------ |
| `appliance_name` | `TEXT PRIMARY KEY` |
| `tick_rating`    | `INTEGER`          |
| `logged_at`      | `TEXT`             |

**Seeded entries**: `aircon` (2-tick, 2023), `fridge` (1-tick, 2018), `washing_machine` (3-tick, 2021)

---

## 3. Pydantic Models (in `synthetic_data_generator.py`)

These models validate all generated demo payloads.

### 3.1 `DemoPayload` — Top-level container

```
{
  scenario_id:                  str
  scenario_label:               str
  user:                         UserProfile
  journey_date:                 str               // ISO date
  dashboard_timeseries:         DashboardPoint[]
  insights:                     InsightCard[]
  spike_events:                 SpikeEvent[]
  forecast_results:             ForecastResults
  disaggregation_attributions:  DisaggregationAttributions
  percentile_rankings:          PercentileRankings
  grid_status:                  GridStatus
  optimiser:                    OptimiserPayload
  generated_with:               "openai" | "hardcoded"
  generated_at:                 str               // ISO datetime
}
```

### 3.2 `UserProfile`

```
{
  name:                 str
  persona:              str
  home_type:            str
  household_size:       int         // 1–8
  tariff_plan:          str
  city:                 str
  analogy_preferences:  str[]
}
```

### 3.3 `DashboardPoint`

```
{
  time:                  str       // "HH:MM"
  kwh:                   float     // ≥ 0
  estimated_cost_sgd:    float     // ≥ 0
  bubble_tea_equivalent: int       // ≥ 0
  peak_flag:             bool      // true if 18:00–21:59
}
```

### 3.4 `InsightCard`

```
{
  id:       str
  title:    str
  summary:  str
  analogy:  str
  impact:   InsightImpact
  action:   str
}
```

#### `InsightImpact`

```
{
  cost_sgd:               float   // ≥ 0
  carbon_kg:              float   // ≥ 0
  savings_if_shifted_sgd: float   // ≥ 0
}
```

### 3.5 `SpikeEvent`

```
{
  date:                  str       // ISO date
  spike_time:            str       // "HH:MM"
  display_time:          str       // e.g. "2:00 PM"
  reading_kwh:           float     // ≥ 0
  baseline_kwh:          float     // ≥ 0
  stddev_kwh:            float     // ≥ 0
  z_score:               float     // ≥ 0
  estimated_cost_sgd:    float     // ≥ 0
  bubble_tea_equivalent: int       // ≥ 0
  likely_appliances:     str[]
  recommended_actions:   str[]
  explanation:           str
}
```

### 3.6 `ForecastResults`

```
{
  forecast_month:       str                     // "YYYY-MM"
  predicted_bill_sgd:   { min: float, max: float }
  confidence:           "low" | "medium" | "high"
  context:              str
  drivers:              str[]
  top_tip:              str
}
```

### 3.7 `DisaggregationAttributions`

```
{
  top_appliances:        ApplianceAttribution[]
  upgrade_opportunities: UpgradeOpportunity[]
}
```

#### `ApplianceAttribution`

```
{
  name:             str
  share_pct:        int       // 0–100
  monthly_cost_sgd: float     // ≥ 0
  monthly_kwh:      float     // ≥ 0
  tip:              str
}
```

#### `UpgradeOpportunity`

```
{
  appliance:           str
  current_issue:       str
  recommended_model:   str
  annual_savings_sgd:  float   // ≥ 0
  points_bonus:        int     // ≥ 0
}
```

### 3.8 `PercentileRankings`

```
{
  neighbourhood_percentile: int                // 0–100
  streak_days:              int                // ≥ 0
  tree_status:              "Thriving" | "Healthy" | "Wilting" | "Dormant"
  points:                   int                // ≥ 0
  leaderboard:              LeaderboardEntry[]
  next_reward:              str
}
```

#### `LeaderboardEntry`

```
{
  alias:  str
  points: int   // ≥ 0
}
```

### 3.9 `GridStatus`

```
{
  current_level:    "Low" | "Moderate" | "High"
  stress_score:     int        // 0–100
  current_demand_mw: int      // ≥ 0
  peak_window:      str        // e.g. "18:30-21:30"
  analogy:          str
  timeline:         GridPoint[]
}
```

#### `GridPoint`

```
{
  time:         str                              // "HH:MM"
  demand_mw:    int                              // ≥ 0
  stress_level: "Low" | "Moderate" | "High"
}
```

### 3.10 `OptimiserPayload`

```
{
  monthly_savings_potential_sgd: float           // ≥ 0
  recommended_actions:          OptimiserAction[]
  savings_report_headline:      str
}
```

#### `OptimiserAction`

```
{
  rank:           int                            // ≥ 1
  title:          str
  savings_sgd:    float                          // ≥ 0
  difficulty:     "Easy" | "Moderate" | "High"
  rationale:      str
  schedule_hint:  str
}
```

---

## 4. API Router Response Shapes

All routers source data from `get_random_demo_payload()` in `synthetic_data_generator.py`.
Every route accepts optional query params: `refresh` (bool) and `force_fallback` (bool).

---

### 4.1 `GET /api/insights/`

```json
{
  "data": {
    "scenario_id":           "string",
    "scenario_label":        "string",
    "user":                  UserProfile,
    "dashboard_timeseries":  DashboardPoint[],
    "insights":              InsightCard[]
  },
  "generated_with": "openai" | "hardcoded",
  "journey_date":   "YYYY-MM-DD"
}
```

---

### 4.2 `GET /api/spike/`

```json
{
  "spike_events":   SpikeEvent[],
  "latest":         SpikeEvent | null,
  "scenario_id":    "string",
  "scenario_label": "string",
  "generated_with": "openai" | "hardcoded",
  "journey_date":   "YYYY-MM-DD"
}
```

---

### 4.3 `GET /api/forecast/`

```json
{
  "forecast":       ForecastResults,
  "scenario_id":    "string",
  "scenario_label": "string",
  "generated_with": "openai" | "hardcoded",
  "journey_date":   "YYYY-MM-DD"
}
```

---

### 4.4 `GET /api/grid/`

```json
{
  "grid_status":    GridStatus,
  "demand":         GridPoint[],
  "scenario_id":    "string",
  "scenario_label": "string",
  "generated_with": "openai" | "hardcoded",
  "journey_date":   "YYYY-MM-DD"
}
```

> **Note**: `demand` is a convenience alias for `grid_status.timeline`.

---

### 4.5 `GET /api/appliances/`

```json
{
  "appliances":             ApplianceAttribution[],
  "upgrade_opportunities":  UpgradeOpportunity[],
  "scenario_id":            "string",
  "scenario_label":         "string",
  "generated_with":         "openai" | "hardcoded",
  "journey_date":           "YYYY-MM-DD"
}
```

---

### 4.6 `GET /api/optimiser/`

```json
{
  "status":         "active",
  "optimiser":      OptimiserPayload,
  "scenario_id":    "string",
  "scenario_label": "string",
  "generated_with": "openai" | "hardcoded",
  "journey_date":   "YYYY-MM-DD"
}
```

---

### 4.7 `GET /api/gamification/`

```json
{
  "points":         int,
  "streak_days":    int,
  "tree_status":    "Thriving" | "Healthy" | "Wilting" | "Dormant",
  "leaderboard":    LeaderboardEntry[],
  "next_reward":    "string",
  "scenario_id":    "string",
  "scenario_label": "string",
  "generated_with": "openai" | "hardcoded",
  "journey_date":   "YYYY-MM-DD"
}
```

---

### 4.8 `GET /` (Health check)

```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

---

## 5. Demo Scenario IDs

The system generates 3 hardcoded scenarios (or OpenAI-enhanced variants):

| `scenario_id`            | `scenario_label`       | Spike Time | Focus Appliance    |
| ------------------------ | ---------------------- | ---------- | ------------------ |
| `aircon-afternoon-spike` | Afternoon Aircon Spike | 14:00      | Aircon             |
| `laundry-night-shift`    | Off-Peak Laundry Shift | 19:00      | Dryer              |
| `weekend-cooking-surge`  | Weekend Cooking Surge  | 12:00      | Cooking appliances |

OpenAI-enhanced variants use `scenario_id` prefixed with `openai-` (e.g. `openai-aircon-afternoon-spike`).

---

## 6. Key Constants

| Constant         | Value               | Used In                         |
| ---------------- | ------------------- | ------------------------------- |
| `HOUSEHOLD_ID`   | `"wei_ling_demo"`   | consumption data                |
| `BASE_KWH`       | `0.45`              | consumption & cohort generation |
| `START_DATE`     | `2024-01-01`        | consumption range               |
| `END_DATE`       | `2025-01-31`        | consumption range               |
| `CAPACITY_MW`    | `10,000`            | grid demand                     |
| `PEAK_DEMAND_MW` | `7,200`             | grid demand scaling             |
| Tariff rate      | `SGD 0.27 / kWh`    | cost calculations               |
| Carbon factor    | `0.37 kg CO₂ / kWh` | carbon calculations             |
| Bubble tea rate  | `~2 per kWh`        | analogy calculations            |
