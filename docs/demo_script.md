# SP Energy Pulse — Live Demo Script

**Total time: ~5 minutes**
**URL:** http://localhost:3000

---

## Opening (20 sec)

> "Every Singaporean household gets half-hourly electricity data from SP Group. But seeing data and understanding it are two completely different things. SP Energy Pulse is the layer between raw numbers and real behaviour change. Let me walk you through it."

---

## 1. Onboarding — Personalisation (60 sec)

Land on the **onboarding screen**.

> "The first thing we do is learn who you are. Not to collect data for the sake of it — but because a generic tip means nothing. A personalised one changes behaviour."

Step through the household size and appliance selection screens.

> "We ask about your household — how many people, which appliances you actually own. This isn't a form. It's how the system decides what to show you and what to skip. A single person in a studio gets completely different recommendations from a family of four in a 5-room flat."

Arrive at the **Time-of-Use plan card**. Tap the **"?" icon**.

> "Here's a great example of personalisation at the point of decision. Most users don't know what Time-of-Use pricing even means — and we don't assume they do. One tap gives them a plain-English explanation: what peak hours are, what off-peak hours are, and exactly how much they'd save by switching — $18 a month, in their specific case."

> "That's the philosophy across the whole app. Every piece of information is surfaced at the moment it's relevant to a decision the user is already making."

Complete onboarding and land on the **Dashboard**.

---

## 2. Dashboard — Reading Your Own Behaviour (60 sec)

> "This is the home screen. But notice — it's not just a chart. Every bar is heat-coded. Green means you're well within your normal range. Amber is moderate. Red means something unusual happened."

Toggle **Day → Week → Month**.

> "You can look at a single day, a week, or the full month. The weekly and monthly views are where behavioural patterns really show up — the Monday spikes, the weekend surges, the late-night appliance habits you didn't know you had."

Hover over a **red bar** to show the tooltip.

> "Hover over any bar and you get the exact consumption and estimated cost for that period. Not kWh — dollars. Because that's the number that actually means something to most people."

Tap the **bell icon** at the top right.

> "Our notification system doesn't send you generic reminders. Every alert is generated from your actual consumption pattern."

Click through the **4 notification slides**.

> "A TOU enrolment nudge timed to when this household's off-peak savings would be highest. A peak demand warning for tonight. A streak milestone. A voucher they've just unlocked. Each one is a behavioural prompt — not just information. And the timing and content are different for every household."

Dismiss the notifications.

---

## 3. Spike Detected — Closing the Feedback Loop (45 sec)

Scroll down to the **Spike Detected card**.

> "This is one of the most important features in the app. Our backend runs statistical analysis on every half-hourly reading — comparing it against a rolling 30-day baseline for that exact time slot, accounting for whether it's a weekday or weekend. When a reading crosses 1.5 standard deviations above normal, we flag it."

> "But here's the key insight: we don't just tell the user something happened. We ask them to explain it."

Tap the card to open the **appliance modal**.

> "We show only the appliances registered to this household — Air Conditioner, Refrigerator, Tumble Dryer. The user picks whichever was running during the spike window."

Select **Air Conditioner**. Show the **+10 points toast**.

> "Two things happen. The user earns 10 points — immediate positive reinforcement for engaging with their data. And the label goes back into our NILM model to sharpen future appliance attribution. The user teaches the system. The system teaches the user. That feedback loop is what turns a one-time interaction into a lasting habit."

---

## 4. Grid Tab — The Bigger Picture (45 sec)

Navigate to the **Grid tab**.

> "Now let's zoom out from one household to the national grid."

Point to the **area chart** and hover to show the **crosshair tooltip**.

> "This is live national grid utilisation. The chart uses a gradient — green when demand is low, red as it climbs toward capacity. Hover anywhere and you get the exact utilisation percentage and megawatt figure for that moment."

Scroll to the **AI grid summary**. Watch the **retrieval animation**.

> "The AI summary loads with a real retrieval effect — because we want users to feel that the insight was generated for them, right now, not pulled from a static cache."

Scroll to the **Comparison card**.

> "This is where personalisation and social proof meet. The median 4-room HDB uses 380 kWh a month. This household is at 521 — 37% above median. And we don't just show that number. We explain it: their air conditioner has been running for approximately 45 minutes a day in an unoccupied room. That's a behavioural insight, not just a statistic. And it's specific enough to act on."

---

## 5. Your Forest — Rewarding the Right Behaviours (30 sec)

Navigate to the **Your Forest tab**.

> "Behavioural change doesn't stick without a reward loop. Every action in this app — logging a spike, completing a streak, shifting a load — earns Ecosystem Points. Points grow your digital forest and unlock real vouchers."

Point to the **voucher cards**.

> "CDC vouchers. FairPrice. NEA Climate Friendly Household vouchers. These are real incentives SP Group already partners on. We're plugging into an existing rewards ecosystem, not building one from scratch."

Show a **redeemed voucher** with the green pill.

> "Once a voucher is claimed, it's clearly marked — so users always know what's available versus what they've already earned."

---

## 6. Savings Tab — From Insight to Action (45 sec)

Navigate to the **Savings tab**.

> "Every insight in this app leads here — the AI Savings Optimiser. It takes everything we know about this household and calculates the exact actions with the highest return."

Point to the **animated savings card**.

> "Right now they're paying $142 a month on a flat rate. Switch to Time-of-Use pricing — which costs them nothing to do — and that drops to $124. The bar animates down to show the reduction visually, not just numerically. We designed that deliberately. A shrinking bar feels like savings. A number changing doesn't."

Point to the **three recommendation cards**.

> "Three actions, ranked by impact and effort. Enrol in TOU — $18 a month, zero behavioural change required. Shift the dryer to after 11 PM — $9 a month, one small habit. Upgrade the 2009 fridge to a 4-Tick model — $14 a month in savings, and they already qualify for a government voucher to offset the cost."

Tap **Set Reminder** on the dryer card.

> "The reminder modal lets them schedule the habit change directly in the app — no friction, no app switching, no forgetting."

Tap **Check Voucher** on the fridge card.

> "And this routes them straight to the Forest tab to claim their CFH voucher. The whole experience is a closed loop — insight leads to action, action leads to reward, reward reinforces the behaviour."

---

## Close (20 sec)

> "SP Energy Pulse works because it doesn't treat energy data as the product. It treats behaviour change as the product. The data is just how we get there."

> "NILM identifies appliances without any additional hardware. ClickHouse handles half-hourly time-series analytics at national scale. And every feature — every notification, every chart, every recommendation — is personalised to the household in front of you."

> "Wei Ling got a confusing electricity bill last month. This month, she knows it was her air conditioner. She's shifted it. Her tree is growing. And her bill is down $22."

---

## Key Numbers

| | |
|---|---|
| Flat rate baseline | $142/mo |
| TOU optimised | $124/mo |
| Savings from all 3 actions | $41/mo |
| HDB median benchmark | 380 kWh |
| Demo household | 521 kWh (+37% above median) |
| Spike threshold | 1.5 std dev above 30-day rolling baseline |
| Points per spike label | +10 |
