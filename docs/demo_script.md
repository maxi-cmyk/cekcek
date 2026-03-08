# SP Energy Pulse — Demo Script

**Total time: ~5 minutes**
**Presenter tip:** Narrate what you're doing as you tap through. Keep energy high — this is a story, not a feature list.

---

## Opening Line (15 sec)

> "Most Singaporeans check their electricity bill once a month — and have no idea why it went up. SP Energy Pulse changes that. It turns your raw half-hourly meter data into something you can actually act on. Let me show you."

Navigate to **http://localhost:3000** and start on the onboarding screen.

---

## 1. Onboarding (30 sec)

Walk through the personalisation steps quickly.

> "When you first open the app, it takes 30 seconds to set up your profile — household size, your appliances, and your energy plan."

Tap through to the **Time-of-Use plan card**. Tap the **"?" icon**.

> "We surface a quick explanation of what Time-of-Use pricing actually means — most users don't know they can save $18 a month just by shifting when they run their dryer. That information is right here, in context, when they need it."

Complete onboarding and land on the **Dashboard**.

---

## 2. Dashboard — Usage Graph (45 sec)

> "This is the home screen. Your energy usage at a glance."

Point to the bar chart.

> "The bars aren't just numbers — they're heat-coded. Green means you're well within your normal range. Amber is moderate. Red means a spike."

Toggle between **Day → Week → Month**.

> "You can zoom out to see patterns across the week or the whole month — useful for spotting habits you didn't know you had."

Hover over a red bar to show the **floating tooltip**.

> "Hover over any bar and you get the exact consumption and estimated cost for that period."

---

## 3. Bell Notifications (30 sec)

Tap the **bell icon** in the top right.

> "This is our personalised notification centre. Instead of generic alerts, every message is tailored to this household's actual behaviour."

Click through the **4 notification cards**.

> "TOU enrolment reminder based on their usage pattern. A peak demand warning. A streak milestone. A voucher they've unlocked. Each one is actionable — not just informational."

Tap anywhere to dismiss.

---

## 4. Spike Detected Card (45 sec)

Scroll down to the **Spike Detected card**.

> "Our system runs statistical analysis on every half-hourly reading — comparing it against a rolling 30-day baseline for that exact time slot. When something crosses 1.5 standard deviations above normal, we flag it."

Tap the card to open the **appliance modal**.

> "Rather than just telling the user 'something spiked between 3 and 5 PM', we ask them to confirm which appliance was responsible. This does two things: it makes the insight personal, and it trains our NILM model."

Select **Air Conditioner**.

> "They log it — and earn 10 points for helping improve the system."

Show the **toast notification**.

---

## 5. Grid Tab (45 sec)

Navigate to the **Grid tab**.

> "Now let's zoom out from the household to the national grid."

Point to the **area chart**.

> "This is live national grid utilisation. The stroke colour maps directly to stress level — green when demand is low, red when it's approaching capacity. Hover anywhere on the chart..."

Hover to show the **crosshair and floating tooltip**.

> "...and you get the exact utilisation percentage and megawatt demand at that moment."

Scroll down to the **Comparison card**.

> "Here's where it gets personal. The median 4-room HDB uses 380 kWh a month. This household is at 521 — 37% above median. And we can tell them exactly why: their air conditioner is running for 45 minutes a day in an unoccupied room."

---

## 6. Your Forest (30 sec)

Navigate to the **Your Forest tab**.

> "Behaviour change needs a reward loop. Every action — logging a spike, shifting a load, hitting a streak — earns points. Points grow your forest and unlock vouchers."

Point to the **voucher cards**.

> "CDC vouchers, FairPrice, NEA Climate Friendly Household vouchers. Real incentives that SP Group already partners on."

Show a **redeemed voucher** with the green pill.

> "Redeemed vouchers are clearly marked so users can track what they've claimed."

---

## 7. Savings Tab (45 sec)

Navigate to the **Savings tab**.

> "This is the AI Savings Optimiser. It calculates the highest-impact actions for this specific household — not generic tips."

Point to the **animated savings card**.

> "Right now they're on a flat rate — $142 a month. Switch to Time-of-Use pricing and that drops to $124. The bar shows the reduction visually."

Point to the **three recommendation cards**.

> "Ranked by impact. Enrol in TOU — $18 a month, zero effort. Shift the dryer to after 11 PM — $9 a month. Upgrade the 2009 fridge to a 4-Tick model — $14 a month, and they're already eligible for a CFH voucher."

Tap **Set Reminder**.

> "They can set a reminder directly from here — no friction, no context switching."

Tap **Check Voucher** on the fridge card.

> "And the voucher card routes them straight to their Forest to claim it. The whole loop is connected."

---

## Closing (20 sec)

> "SP Energy Pulse isn't another dashboard. It's a behaviour change engine built on the data SP Group already has. NILM identifies appliances without hardware. ClickHouse handles the time-series analytics at scale. And the experience is designed so that every insight has an action, and every action has a reward."

> "Wei Ling got a confusing electricity bill. Now she knows it's her aircon — and she's doing something about it."

---

## Key Numbers to Remember

| Stat | Value |
|------|-------|
| Flat rate baseline | $142/mo |
| TOU optimised | $124/mo |
| Monthly savings potential | $41/mo (all actions combined) |
| HDB median benchmark | 380 kWh |
| Demo household usage | 521 kWh (+37% above median) |
| Points earned per spike label | +10 |
| Spike detection threshold | 1.5 standard deviations above 30-day rolling baseline |
