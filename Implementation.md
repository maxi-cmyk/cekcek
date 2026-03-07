# SP Energy Pulse --- Technical Implementation Plan (ClickHouse Edition)

------------------------------------------------------------------------

## Step 1: The Tech Stack

**Frontend** - React Native, Flutter, or React / Next.js for a
responsive web app.

**Backend** - Python (FastAPI). - Lightweight and easy to deploy. -
Excellent ecosystem with libraries like `clickhouse-connect`.

**Database** - ClickHouse. - Ideal for time‑series analytics like
half‑hourly energy readings. - Can be deployed quickly using
**ClickHouse Cloud**.

**The Ultimate Failsafe** - A single file in the frontend called
`fallback_data.js`. - Contains perfectly formatted JSON demo data for
the **Wei Ling scenario**.

------------------------------------------------------------------------

# Step 2: Phase 1 --- Onboarding & The Analogy Engine

You need a screen that: - Plays a demo - Asks for a meter number -
Configures the **Analogy Engine** (Bubble Tea units, MRT trips, etc.)

### How to Build It

1.  Create a simple UI onboarding form.
2.  When the user saves their details:
    -   The frontend sends data to your **FastAPI backend**.
3.  The backend writes a row to a **users table in ClickHouse**
    containing:
    -   User profile
    -   Home type
    -   Analogy configuration

### Hardcoded Failsafe

Use an OpenAI API key to generate fallback demo data.

If the ClickHouse connection fails:

``` javascript
{
  "name": "Wei Ling",
  "homeType": "4-room HDB",
  "analogies": ["Bubble Teas", "MRT Trips"]
}
```

------------------------------------------------------------------------

# Step 3: Phase 2 --- The Dashboard

The dashboard shows a **24‑hour energy usage chart** with dual axes: -
kWh - Bubble Tea equivalents

### How to Build It

Use **Recharts (React)** to render the graph.

Query ClickHouse for the user's daily energy readings:

``` sql
SELECT timestamp, kwh
FROM energy_readings
WHERE user_id = ?
AND date = today()
```

ClickHouse returns the **48 half‑hour readings extremely quickly**,
which is why it's ideal for this application.

### Hardcoded Failsafe

Use fallback chart data if the query fails.

``` javascript
const fallbackChartData = [
0.2,0.2,0.1,0.1,0.2,0.3,0.4,0.5,0.6,0.8,1.0,1.2,
1.4,1.7,2.5,1.8,1.3,0.9,0.8,0.7,0.6,0.5,0.4,0.3
];
```

Ensure the **2.5 spike at 2:00 PM** for the Wei Ling demo.

------------------------------------------------------------------------

# Step 4: Phase 3 & 4 --- Spike Detection

You need to detect anomalies in energy consumption.

### How to Build It

ClickHouse includes built‑in statistical functions.

Example spike detection query:

``` sql
SELECT
avg(kwh) as baseline,
stddevSamp(kwh) as stddev
FROM energy_readings
WHERE user_id = ?
AND time_slot = '14:00'
AND date > today() - 30
```

Then compare today's reading to:

    baseline + 1.5 × stddev

If it exceeds this threshold → trigger a **spike alert**.

### Hardcoded Failsafe

If the SQL query fails, show a prebuilt demo scenario:

``` javascript
{
"spikeTime": "2:00 PM",
"kwh": 2.0,
"cost": "$0.60",
"bubbleTeaEquivalent": 4,
"options": ["Aircon", "Dryer", "Oven", "Other"]
}
```

------------------------------------------------------------------------

# Step 5: Phase 5 --- Resilience Forest (Gamification)

Features: - Tree growth states - Points system - Leaderboard

### How to Build It

Create a `points_ledger` table in ClickHouse.

``` sql
SELECT sum(points)
FROM points_ledger
WHERE user_id = X
```

Frontend logic:

    > 100 points → Thriving tree
    50–100 → Healthy
    < 50 → Wilting

### Hardcoded Failsafe

``` javascript
{
"currentUser": {
"points": 350,
"status": "Thriving"
},
"leaderboard": [
{ "alias": "HDB_Hero_99", "points": 420 }
]
}
```

------------------------------------------------------------------------

# Step 6: Phase 7 --- Seasonal Bill Forecast

You need to estimate the next month's electricity bill.

### How to Build It

In your Python backend, create a simple seasonal rule:

Example:

    April temperature effect → +10% predicted usage

Combine: - Past usage - Temperature multiplier - Household baseline

### Hardcoded Failsafe

``` javascript
{
"predictedBill": "$98–$112",
"context": "April is typically 1.8°C warmer than February...",
"topTip": "Raising aircon to 25°C saves ~$14."
}
```

------------------------------------------------------------------------

# Step 7: Phase 8 --- Grid Demand & Off‑Peak Nudges

You need to: - Show grid stress - Send nudges to shift usage

### How to Build It

Create a **UI button** that triggers a simulated push notification.

This allows you to demonstrate the feature during the hackathon demo.

### Hardcoded Failsafe

Keep a dictionary of analogy messages in `fallback_data.js`.

Example:

``` javascript
{
commuter: "The grid at 7:30 PM is like the MRT at 6 PM.",
hawker: "Peak demand is like a lunch queue at a hawker stall.",
infrastructure: "Running near peak load wears down transformers."
}
```

------------------------------------------------------------------------

# Step 8: Simulated Notifications

Use keyboard shortcuts during the demo to trigger notifications.

Examples:

**Ctrl + N** \> "It's a cool night tonight --- you may not need aircon
to sleep."

**Ctrl + M** \> "Off‑peak hours now! Running laundry now saves about
\$20 per month."

**Ctrl + B** \> "Your neighbour just claimed a Cold Storage voucher for
a 10‑day low‑energy streak!"

These shortcuts allow a **perfectly controlled demo environment**.

------------------------------------------------------------------------

# Why ClickHouse Makes You Look Good

Judges appreciate when teams select tools that match the problem.

SP Energy Pulse handles:

-   Millions of half‑hourly readings
-   Time‑series analytics
-   Fast aggregations

Traditional relational databases struggle with this workload.

ClickHouse excels because it is built for:

-   Columnar storage
-   Real‑time analytical queries
-   Massive time‑series datasets

### The Pitch Line

> "We chose ClickHouse because SP Group manages millions of half‑hourly
> energy readings. ClickHouse is purpose‑built for high‑speed
> time‑series analytics, allowing us to detect anomalies and generate
> insights instantly."

This demonstrates that your solution considers **enterprise‑scale
infrastructure**, not just a hackathon prototype.
