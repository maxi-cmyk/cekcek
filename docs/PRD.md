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

1.  User opens SP Energy Pulse and sees a **30‑second animated demo**
    showing spike detection and savings.
2.  User taps **"See My Data"** and enters their **SP meter number**.
3.  Optional profile inputs configure the Analogy Engine:
    -   Household size\
    -   Home type (HDB 4-room default)\
    -   Age group\
    -   Grid familiarity question
4.  User indicates whether they are on the **Time-of-Use (TOU) tariff**.
5.  Analogy Engine selects relatable units such as:
    -   Bubble tea
    -   Hours of aircon
    -   MRT trips
6.  User lands on the **Resilience Forest Dashboard** with their first
    week of data visualised.

**Design rationale:** Showing value first significantly reduces
onboarding drop-off.

------------------------------------------------------------------------

## Phase 2 --- Dashboard: Understanding Your Usage

The dashboard turns energy data into a **story instead of a
spreadsheet**.

Features include:

-   24-hour usage graph with **half‑hourly resolution**
-   Analogy Engine overlay translating kWh into **real-life units**
-   **Neighbour comparison** against similar HDB households
-   **Grid impact strip** showing peak demand context
-   **Daily streak counter** encouraging reduced usage

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

Next‑day feedback loop that identifies unusual consumption.

Detection logic:

-   Rolling **30‑day baseline**
-   **1.5 standard deviation anomaly threshold**
-   Separate weekday/weekend baselines

User flow:

1.  Push notification: **"Unusual spike detected yesterday."**
2.  User labels appliance causing spike.
3.  Impact explained using the **Analogy Engine**.
4.  User earns **points for training the ML model**.

------------------------------------------------------------------------

## Phase 5 --- Gamification: The Resilience Forest

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
-   NEA Climate Friendly Household vouchers

------------------------------------------------------------------------

## Phase 6 --- Appliance Intelligence

Energy disaggregation identifies appliances **without smart plugs or
additional hardware**.

System design:

-   Pre‑trained signature models from industry datasets
-   Household-specific ML tuning via spike labels
-   Passive detection of appliance upgrades

Example detection:

> Overnight baseline drops → fridge replacement detected.

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

-   Live national grid demand
-   Yesterday demand replay
-   Tomorrow demand forecast
-   Real‑time **Grid Stress Alerts**

Example analogy:

> "The grid at 7:30 PM is like the MRT at rush hour."

Users earn **Grid Hero badges** by shifting usage during peak stress
periods.

------------------------------------------------------------------------

## Phase 9 --- AI Savings Optimiser

A unified engine that calculates the **highest‑impact savings action**
for each household.

Example recommendation stack:

1.  Enrol in TOU tariff --- \$18/month
2.  Shift dryer usage --- \$9/month
3.  Upgrade old fridge --- \$14/month

Users also receive:

-   Monthly **AI Savings Report**
-   **What‑If Simulator**
-   Personalised savings roadmap

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
