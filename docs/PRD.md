# SP Energy Pulse

## AI for Actionable Energy Behaviour Change

### Hackathon Proposal --- SP Group Challenge

------------------------------------------------------------------------

## Executive Summary

SP Energy Pulse transforms raw half-hourly electricity data into
personalised, explainable, and behaviour-driving insights for Singapore
households. The app bridges the gap between seeing your consumption data
and actually changing the habits that drive it.

### The Core User Story

Meet **Wei Ling**, a mother in a 4-room HDB flat. Her electricity bill
jumped \$30 last month and she had no idea why. SP Energy Pulse detected
an anomalous aircon spike every weekday afternoon, explained it in terms
she understood ("That's like buying 18 bubble teas a month"), helped her
shift usage to off-peak hours, and rewarded her with SP bill rebate
credits.

Her tree is growing. Her bill is down \$22.

------------------------------------------------------------------------

## The Problem

SP Group already provides half-hourly electricity data via the SP App.
The data exists --- but it does not automatically translate into
understanding or behaviour change.

Today, most users:

-   See many numbers but do not know what they mean\
-   Cannot identify which appliances are driving their usage\
-   Do not know when or how to shift load to off-peak hours\
-   Cannot see how their daily habits affect their carbon footprint or
    grid stability

**Result:** Data-rich, insight-poor.

**SP Energy Pulse** solves this by adding an intelligence and motivation
layer on top of existing consumption data.

------------------------------------------------------------------------

## Solution Overview

SP Energy Pulse is a **mobile-first companion app** built on five
interlocking pillars:

  -----------------------------------------------------------------------
  Pillar                              How We Deliver It
  ----------------------------------- -----------------------------------
  Make data understandable            Analogy Engine translates kWh into
                                      relatable units (bubble teas,
                                      laptop charges, MRT trips)

  Actionable recommendations          Proactive off-peak shift cards and
                                      spike resolution flow

  Measurable impact                   Real-time cost, carbon, and
                                      grid-impact metrics on every
                                      insight

  Long-term habit building            Daily streaks, Resilience Forest,
                                      and feedback loops

  Connect to the bigger picture       Household benchmarking and
                                      grid-level impact framing
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# User Journey

## Phase 1 --- Onboarding: Value Before Ask

The onboarding sequence follows one principle: **show value before
requesting data**.

1.  User opens SP Energy Pulse and completes a multi-step
    **personalisation flow**:
    -   Household size
    -   Home type (HDB 4-room default)
    -   Appliances in use
    -   Energy plan selection
2.  The **Time-of-Use (TOU) plan card** includes a **"?" icon** that
    toggles an inline explanation covering peak/off-peak hours and the
    estimated ~$18/month savings potential.
3.  Analogy Engine selects relatable units such as:
    -   Bubble tea
    -   Hours of aircon
    -   MRT trips
4.  User lands on the **Dashboard** with their usage data visualised.

**Design rationale:** Showing value first significantly reduces
onboarding drop-off.

------------------------------------------------------------------------

## Phase 2 --- Dashboard: Understanding Your Usage

The dashboard turns energy data into a **story instead of a
spreadsheet**.

Features include:

-   Energy usage graph with **day / week / month** toggle
-   Heat-gradient bars (green → amber → red) reflecting consumption
    intensity relative to the household's peak
-   Hover tooltip showing exact kWh and cost per bar
-   **Bell notification icon** with iOS-style slideshow of 4 personalised
    alerts (e.g. TOU enrolment reminder, grid peak warning, streak
    milestone, voucher unlock)
-   **Spike Detected card** — flags statistically anomalous activity
    (e.g. 3–5 PM surge) detected via rolling baseline analysis; lets
    the user log the responsible appliance and earn +10 points

------------------------------------------------------------------------

## Phase 3 --- Off‑Peak Shift Suggestions

Daily engagement loop encouraging behavioural change.

1.  Each morning at **8:00 AM**, the app identifies appliances likely to
    run during peak hours.
2.  Suggestion cards show:
    -   Peak cost
    -   Off‑peak cost
    -   Monthly savings
    -   CO₂ reduction
3.  User receives push notification: \> "Running your dryer after 11 PM
    saves \~\$0.40. Tap to set a reminder."
4.  Completing the shift awards **Ecosystem Points** and streak bonuses.

------------------------------------------------------------------------

## Phase 4 --- Spike Detection & Resolution

Real-time feedback loop that identifies unusual consumption using
**statistical time-series analysis**.

Detection logic:

-   Rolling **30‑day baseline** per time slot
-   **1.5 standard deviation anomaly threshold**
-   Separate weekday/weekend baselines
-   Powered by ClickHouse built-in statistical aggregation functions

User flow:

1.  **Spike Detected card** appears on the dashboard.
2.  User selects the responsible appliance from their registered devices
    (Air Conditioner, Refrigerator, Tumble Dryer).
3.  Logging earns **+10 Ecosystem Points** confirmed by an in-app toast.
4.  Labels feed back into the NILM model to improve future appliance
    attribution accuracy.

------------------------------------------------------------------------

## Phase 5 --- Gamification: Your Forest

A behavioural reinforcement system where households grow a digital tree.

Tree states:

-   Thriving (5+ day streak)
-   Healthy (2--4 days)
-   Wilting (3 days inactivity)
-   Dormant (1 week inactivity)

Points can be redeemed for:

-   SP bill rebates
-   Carbon offset certificates
-   Grab / NTUC vouchers
-   NEA Climate Friendly Household (CFH) vouchers

Redeemed vouchers display a green **"Redeemed" pill** with a
green-tinted card background to clearly distinguish claimed from
available rewards.

------------------------------------------------------------------------

## Phase 6 --- Appliance Intelligence

Energy disaggregation identifies appliances **without smart plugs or
additional hardware** using a **NILM (Non-Intrusive Load Monitoring)**
model.

System design:

-   NILM model analyses the aggregate meter signal (power draw shape,
    duration, frequency) to identify per-appliance signatures
-   Household-specific tuning via user-submitted spike labels
-   Demo tracks three appliances: **Air Conditioner**, **Refrigerator**,
    **Tumble Dryer**
-   Passive detection of appliance upgrades (e.g. overnight baseline
    drop → fridge replacement)

Users can log upgrades and receive **bonus points for efficient
appliances**.

------------------------------------------------------------------------

## Phase 7 --- Seasonal Bill Forecast

Predicts upcoming bills based on:

-   Historical usage
-   NEA weather forecasts
-   National grid demand patterns
-   Similar household consumption

Example insight:

> "April is typically 1.8°C warmer than February --- your baseline will
> rise."

Users earn points if **actual bills match forecasts**, encouraging
engagement.

------------------------------------------------------------------------

## Phase 8 --- Grid Demand Awareness

Helps users understand **why peak demand matters**.

Key idea:

The grid cares about **simultaneous demand**, not monthly totals.

Features:

-   Live national grid utilisation area chart with interactive
    **crosshair and floating tooltip** (similar to stock market charts)
-   Gradient stroke: green at low utilisation, red at high
-   AI-generated grid summary with simulated retrieval loading effect
-   **Comparison card** benchmarking the household against the median
    4-room HDB (380 kWh), with an explanation of the key consumption
    drivers (e.g. unoccupied aircon usage)
-   Real-time **Grid Stress Alerts**

Example analogy:

> "If 10,000 households shifted one appliance out of peak hours:
> −180 MW peak demand. Enough to power 45,000 homes."

Users earn **Grid Hero badges** by shifting usage during peak stress
periods.

------------------------------------------------------------------------

## Phase 9 --- AI Savings (Savings Tab)

A unified engine that calculates the **highest‑impact savings action**
for each household. The tab is labelled **Savings** in the bottom
navigation.

Features:

-   **Current vs Optimised card** — animated TOU cost counter (counts
    from $0 to $124/mo with aggressive ease-out) and a progress bar that
    animates from 100% down to 60% to visually show cost reduction
    vs the $142/mo flat rate
-   Ranked recommendation cards with impact badges:
    1.  Enrol in TOU tariff — $18/month *(High Impact)*
    2.  Shift dryer to after 11 PM — $9/month *(Behavioural)*
    3.  Upgrade 2009 fridge to 4-Tick — $14/month *(Voucher Eligible)*
-   **Set Reminder** button opens a bottom-sheet modal with a textarea
    and confirmation state
-   **Check Voucher** button redirects to the Your Forest tab to claim
    the CFH voucher
-   Personalised savings roadmap based on last 3 months of consumption

------------------------------------------------------------------------

# Technical Architecture

  Component               Approach
  ----------------------- ----------------------------------------------
  Data ingestion          SP Group half-hourly meter API
  Spike detection         Rolling 30-day baseline
  Analogy Engine          Rule-based energy conversion
  Energy disaggregation   Hybrid ML + user-labelled data
  Notifications           Firebase Cloud Messaging
  Forecast model          Multi-signal regression
  Grid data               EMC half-hourly national demand feed
  Rewards                 Integrated points ledger and redemption APIs

------------------------------------------------------------------------

# Mapping to SP Group Success Criteria

  Success Criterion           Feature
  --------------------------- -------------------------------------
  Easy to understand          Analogy Engine
  Behaviour recommendations   Off-peak suggestions + AI optimiser
  Measurable impact           CO₂, cost, and grid metrics
  Long-term habits            Streaks and Resilience Forest
  Bigger picture              Grid Pulse awareness layer

------------------------------------------------------------------------

# Risks & Mitigations

  Risk                      Mitigation
  ------------------------- -----------------------------
  Onboarding drop-off       Demo-first flow
  False spike alerts        Personal baseline modelling
  Privacy concerns          Anonymised leaderboard
  Low engagement            Daily off-peak suggestions
  Forecast accuracy         Cohort fallback model
  Disaggregation accuracy   Hybrid ML + user labels

------------------------------------------------------------------------

# Why SP Energy Pulse Wins

Most energy apps **show data**.

SP Energy Pulse **changes behaviour**.

-   Makes consumption understandable
-   Makes appliances visible without hardware
-   Turns tariff plans into actionable savings
-   Connects household actions to grid stability
-   Builds lasting behavioural habits

At the centre is Wei Ling.

She received a confusing electricity bill.

Now she understands it --- **in bubble teas**.
