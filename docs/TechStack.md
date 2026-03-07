# SP Energy Pulse

## Hackathon Demo Tech Stack

**Web app simulating a mobile experience --- no DevOps, no cloud infra,
no real push notifications**

------------------------------------------------------------------------

# Demo Philosophy

This is a **hackathon demo**, not a production deployment.

Every technology choice is optimised for:

-   **Building fast**
-   **Looking convincing on screen**

There is:

-   No AWS
-   No CI/CD pipeline
-   No real push notifications
-   No live external API calls during the demo

Everything that matters is:

-   The **user experience**
-   The **data flow**
-   The **AI‑generated insights**
-   The **visualisations**

------------------------------------------------------------------------

## Core Constraint

The demo runs as a **responsive web app styled to look like a mobile
app**.

Key characteristics:

-   Narrow viewport (\~390px width)
-   Bottom navigation bar
-   Card-based layout
-   Judges interact through a **browser**

All "notifications" are **simulated in‑app banners** triggered by:

-   User actions
-   A demo script timer

No native mobile build is required.

------------------------------------------------------------------------

# Stack at a Glance

## Frontend

**Next.js 14 • TypeScript • Tailwind CSS • Recharts • Zustand**

## Backend

**Python • FastAPI • SQLite • pandas • Pydantic**

## Database

**ClickHouse Cloud (free tier) • SQLite (user state)**

## AI / ML

**GPT‑4o (OpenAI API) • demo_outputs.json (scripted ML results)**

## Simulated

-   Push notifications
-   SP meter API
-   EMC live feed
-   NEA weather API

------------------------------------------------------------------------

# Frontend --- Next.js Web App

The frontend is a **Next.js + Tailwind CSS web application** designed to
simulate a **mobile phone interface** inside a browser.

### Mobile Viewport Simulation

The app uses:

    max-w-[390px]

This creates an **iPhone‑sized viewport** centered on screen.

Features:

-   Phone-style frame border
-   Fixed bottom navigation
-   Card UI layout
-   Mouse clicks behaving like taps

This produces a convincing **mobile demo without building a native
app**.

------------------------------------------------------------------------

# Frontend Libraries

  -----------------------------------------------------------------------
  Library                             Purpose
  ----------------------------------- -----------------------------------
  **Next.js 14 (App Router)**         Entire application architecture.
                                      Supports nested layouts used to
                                      wrap pages in mobile chrome.

  **TypeScript**                      End‑to‑end type safety between
                                      frontend and FastAPI backend
                                      models.

  **Tailwind CSS**                    All styling --- mobile layout,
                                      colours, spacing, and
                                      responsiveness.

  **Recharts**                        Data visualisations including
                                      consumption graphs, spike bell
                                      curves, and grid demand charts.

  **Zustand**                         Global state management for user
                                      profile, notifications, and demo
                                      flags.

  **Framer Motion**                   UI animations such as tree growth
                                      and card transitions.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# Backend --- FastAPI + SQLite

A **FastAPI server** handles API requests from the Next.js frontend.

SQLite replaces PostgreSQL for simplicity.

  -----------------------------------------------------------------------
  Component                           Demo Implementation
  ----------------------------------- -----------------------------------
  **FastAPI**                         API endpoints such as `/insights`,
                                      `/spike`, `/forecast`,
                                      `/optimiser`, `/grid`.

  **SQLite**                          Stores user state, onboarding data,
                                      appliance profile, points, and
                                      badges.

  **ClickHouse Cloud**                Stores half‑hourly consumption
                                      time‑series data.

  **pandas + numpy**                  Time‑series manipulation and
                                      feature engineering.

  **Pydantic**                        Request/response validation and GPT
                                      response parsing.

  **python-dotenv**                   Loads environment variables such as
                                      API keys.
  -----------------------------------------------------------------------

FastAPI runs locally:

    uvicorn main:app --reload

------------------------------------------------------------------------

# Database Architecture

Two storage layers are used.

## ClickHouse Cloud --- Time-Series Data

Stores all **energy consumption data**.

### Tables

  Table                  Contents
  ---------------------- -------------------------------------------------
  consumption            13 months of synthetic half‑hourly kWh readings
  cohort_baselines       Aggregated statistics for similar households
  grid_demand            30 days of national grid demand data
  appliance_signatures   Feature vectors for household appliances

This dataset includes:

-   Seasonal patterns
-   Weekday vs weekend behaviour
-   Deliberate spike events

------------------------------------------------------------------------

## SQLite --- User State

Stores everything that changes during the demo.

Examples:

-   Points
-   Badges
-   Appliance logs
-   Spike labels
-   TOU status

### Demo Reset

Deleting `demo.db` resets the demo.

Running:

    python seed.py

restores the initial state in **under 5 seconds**.

------------------------------------------------------------------------

# AI and ML Layer

The demo uses **two types of AI components**:

1.  Real AI (GPT‑4o)
2.  Scripted model outputs

This ensures:

-   Reliable demo behaviour
-   Fast performance
-   Convincing AI interactions

------------------------------------------------------------------------

# GPT‑4o --- Real API Calls

GPT‑4o generates all **natural language insight cards**.

  -----------------------------------------------------------------------
  Task                    Input                   Output
  ----------------------- ----------------------- -----------------------
  Insight cards           kWh values + user       2‑3 sentence
                          persona                 explanations

  Savings optimiser       Scripted savings stack  Ranked recommendations

  Spike explanation       Appliance + spike value Impact explanation

  Notification text       Appliance + TOU saving  Push‑style notification
                                                  copy
  -----------------------------------------------------------------------

### Latency Handling

Typical latency:

**1--3 seconds per call**

To prevent delays:

-   Responses are **pre‑fetched on startup**
-   Cached using **Zustand**

------------------------------------------------------------------------

# demo_outputs.json --- Scripted ML Results

Instead of running heavy ML models live, the demo reads **pre‑computed
results**.

Example contents:

  Feature                 Stored Data
  ----------------------- ----------------------------------
  Spike detection         Timestamp + appliance prediction
  Seasonal forecast       Predicted bill range
  Energy disaggregation   Appliance attribution
  Appliance upgrades      Passive detection events
  Neighbour ranking       Percentile scores

FastAPI reads this JSON file and returns results **as if they were
produced by ML models**.

------------------------------------------------------------------------

# Answering Judge Questions About ML

Suggested explanation:

> In production we use an XGBoost model for appliance classification and
> Facebook Prophet for seasonal forecasting. For the hackathon demo we
> use synthetic datasets to simulate those outputs so we can focus on
> the user experience and the AI insight layer.

This answer is:

-   Honest
-   Technically credible
-   Hackathon appropriate

------------------------------------------------------------------------

# Simulated Components

Several production integrations are simulated.

  Component            Simulation
  -------------------- ---------------------------------------------
  Push notifications   React banners using Zustand + Framer Motion
  SP meter API         FastAPI endpoint returning ClickHouse data
  EMC grid feed        Synthetic demand dataset
  NEA weather API      Hardcoded monthly temperature dataset

These simulations produce **realistic behaviour without external
dependencies**.

------------------------------------------------------------------------

# Demo Control Panel

A hidden control panel is activated using:

    Shift + D

It allows the presenter to:

-   Trigger spike alerts
-   Trigger grid stress events
-   Fast‑forward forecast comparisons
-   Reset demo state

This ensures the demo **always hits key moments** regardless of user
navigation.

------------------------------------------------------------------------

# Project Structure

The project is a **single monorepo**.

    /frontend
    /backend

## Frontend

Next.js application.

    /frontend/app
    /frontend/components
    /frontend/store

Example pages:

-   dashboard
-   grid
-   forest
-   appliances
-   optimiser
-   onboarding

------------------------------------------------------------------------

## Backend

FastAPI application.

    /backend
    /backend/data
    /backend/routers

Key files:

  File                          Purpose
  ----------------------------- ------------------------
  demo_outputs.json             Scripted ML results
  seed.py                       Resets demo state
  synthetic_data_generator.py   Generates demo dataset
  clickhouse_schema.sql         Table definitions

Routers:

-   insights.py
-   spike.py
-   optimiser.py
-   forecast.py
-   grid.py
-   appliances.py
-   gamification.py

------------------------------------------------------------------------

# Environment Variables

Stored in `.env`.

    OPENAI_API_KEY
    CLICKHOUSE_HOST
    CLICKHOUSE_USER
    CLICKHOUSE_PASSWORD

Never committed to the repository.

------------------------------------------------------------------------

# Running the Demo

## Step 1 --- Install Dependencies

    cd backend
    pip install -r requirements.txt

    cd frontend
    npm install

------------------------------------------------------------------------

## Step 2 --- Seed Demo Data

    cd backend
    python data/seed.py

This resets:

-   SQLite state
-   Points
-   Badges
-   Spike labels

------------------------------------------------------------------------

## Step 3 --- Start Servers

    cd backend
    uvicorn main:app --reload

    cd frontend
    npm run dev

Open:

    http://localhost:3000

------------------------------------------------------------------------

# Demo Day Checklist

Before presenting:

1.  Run `seed.py` to reset state
2.  Open the demo in Chrome
3.  Set browser zoom to **100%**
4.  Ensure `.env` contains a valid OpenAI API key
5.  Know the **Shift+D** control panel shortcut
6.  Run one ClickHouse warm‑up query

This guarantees a **smooth, predictable demo experience**.
