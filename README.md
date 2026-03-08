# SP Energy — Smart Home Energy Management Demo

A mobile-first energy management app simulation built for Singapore's SP Energy ecosystem. The app is presented as a phone frame in the browser and demonstrates personalised energy insights, AI-driven savings recommendations, and gamified sustainability features.

---

## Features

### Home (Dashboard)
- Real-time energy usage graph with **day / week / month** toggle
- Heat-gradient bars (green → amber → red) reflecting consumption intensity
- Hover tooltip showing exact consumption figures per bar
- **Bell notification icon** with iOS-style slideshow of personalised alerts
- **Spike Detected card** — flags unusual activity (3–5 PM) and lets you log the responsible appliance to earn +10 points

### Grid Tab
- Live national grid utilisation area chart with interactive crosshair and floating tooltip
- Gradient stroke (green at low, red at high utilisation)
- **Comparison card** — benchmarks your household against the median 4-room HDB (380 kWh) with an explanation of key drivers
- AI-generated grid summary with simulated retrieval loading effect

### Your Forest (Gamification)
- Tree-growth visualisation tied to eco-actions
- Redeemable voucher cards (CDC, Fairprice, CFH)
- Opened/redeemed vouchers display a green "Redeemed" pill with a green-tinted card background

### Appliance Intelligence (Devices)
- Per-appliance energy breakdown: Air Conditioner, Refrigerator, Tumble Dryer
- Usage stats, efficiency ratings, and smart scheduling suggestions

### AI Savings Optimiser (Savings Tab)
- **Current vs Optimised card** — animated counter (TOU cost counts up from $0) and a progress bar that shrinks from 100% to 60% to visualise savings
- Recommended actions with impact badges (High Impact, Behavioural, Voucher Eligible)
- **Set Reminder** modal — bottom-sheet with textarea and confirmation state
- Voucher Eligible action links directly to the Forest tab

### Onboarding
- Multi-step personalisation flow (household size, appliances, energy plan)
- Time-of-Use plan card with an inline "?" explanation toggle covering peak/off-peak hours and estimated savings

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Inline styles + Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Backend | FastAPI (Python) |
| Data | ClickHouse (hardcoded demo fallback) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+

### Installation

```bash
# 1. Install backend dependencies
pip install -r backend/requirements.txt

# 2. Install frontend dependencies
cd frontend && npm install
```

### Running

Open two terminals:

**Terminal 1 — Backend**
```bash
cd backend
uvicorn main:app --reload
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

The app renders as a simulated phone frame (414 x 896 px). Use the bottom navigation bar to switch between tabs.
