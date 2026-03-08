"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
    bg: "#07090f",
    surface: "#0e1219",
    border: "#1c2535",
    borderHi: "#2a3d58",
    green: "#00d68f",
    greenDim: "#00a36b",
    greenGlow: "rgba(0,214,143,0.12)",
    red: "#ff4757",
    redGlow: "rgba(255,71,87,0.12)",
    amber: "#ffb347",
    blue: "#4a9eff",
    text: "#eef2f8",
    muted: "#5a7090",
    dim: "#28374f",
};

// ── Tiny helpers ──────────────────────────────────────────────────────────────
const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

function useTick(ms = 1000, max = null) {
    const [n, setN] = useState(0);
    useEffect(() => {
        if (max !== null && n >= max) return;
        const id = setTimeout(() => setN(v => v + 1), ms);
        return () => clearTimeout(id);
    }, [n, ms, max]);
    return n;
}

// Animated counter
function Counter({ to, duration = 1200, prefix = "", suffix = "", color = C.green, size = 32 }) {
    const [val, setVal] = useState(0);
    const start = useRef(Date.now());
    const raf = useRef();
    useEffect(() => {
        start.current = Date.now();
        const tick = () => {
            const p = Math.min(1, (Date.now() - start.current) / duration);
            const ease = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(ease * to));
            if (p < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf.current);
    }, [to, duration]);
    return (
        <span style={{ color, fontSize: size, fontWeight: 900, ...mono }}>
            {prefix}{val.toLocaleString()}{suffix}
        </span>
    );
}

// Glowing divider
const Divider = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        {label && <span style={{ color: C.muted, fontSize: 10, ...mono, letterSpacing: "0.1em" }}>{label}</span>}
        <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
);

// ── Scene 1: The Problem ──────────────────────────────────────────────────────
// "Your bill jumped. You had no idea why."
function SceneOne({ visible }) {
    const tick = useTick(80, 20);
    const bars = [1.1, 1.3, 1.0, 1.2, 1.1, 1.4, 1.2, 4.8, 1.3, 1.1, 1.2, 1.0];
    const maxV = 5;
    const spikeIdx = 7;

    return (
        <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
            {/* headline */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.muted, fontSize: 11, letterSpacing: "0.12em", ...mono, marginBottom: 8 }}>
                    LAST MONTH
                </div>
                <h2 style={{
                    color: C.text, fontSize: 26, fontWeight: 900, margin: 0, lineHeight: 1.2,
                    letterSpacing: "-0.5px",
                }}>
                    Your bill jumped <span style={{ color: C.red }}>$30</span>.
                    <br />You had no idea why.
                </h2>
            </div>

            {/* fake bill card */}
            <div style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 16, padding: "16px 18px", marginBottom: 16,
                position: "relative", overflow: "hidden",
            }}>
                {/* subtle red glow top right */}
                <div style={{
                    position: "absolute", top: -20, right: -20,
                    width: 100, height: 100, borderRadius: "50%",
                    background: C.redGlow, filter: "blur(20px)",
                }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                        <div style={{ color: C.muted, fontSize: 10, ...mono }}>SP GROUP BILL · APR 2025</div>
                        <div style={{ color: C.text, fontSize: 13, fontWeight: 700, marginTop: 4 }}>Wei Ling · HDB 4-room</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ color: C.muted, fontSize: 10, ...mono }}>TOTAL DUE</div>
                        <div style={{ color: C.red, fontSize: 28, fontWeight: 900, ...mono }}>$128</div>
                        <div style={{ color: C.red, fontSize: 11, fontWeight: 700 }}>▲ $30 vs last month</div>
                    </div>
                </div>

                {/* bar chart showing spike */}
                <div style={{ marginBottom: 8 }}>
                    <div style={{ color: C.muted, fontSize: 10, ...mono, marginBottom: 8 }}>DAILY USAGE — LAST 12 DAYS</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 56 }}>
                        {bars.map((v, i) => {
                            const isSpike = i === spikeIdx;
                            const animated = i <= tick;
                            return (
                                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                    <div style={{
                                        width: "100%",
                                        height: animated ? `${(v / maxV) * 52}px` : "0px",
                                        background: isSpike
                                            ? `linear-gradient(180deg, ${C.red}, ${C.red}88)`
                                            : `${C.muted}44`,
                                        borderRadius: "3px 3px 0 0",
                                        boxShadow: isSpike ? `0 0 10px ${C.red}88` : "none",
                                        border: isSpike ? `1px solid ${C.red}` : "none",
                                        transition: `height ${0.3 + i * 0.04}s cubic-bezier(0.34,1.56,0.64,1)`,
                                        position: "relative",
                                    }}>
                                        {isSpike && animated && (
                                            <div style={{
                                                position: "absolute", top: -20, left: "50%",
                                                transform: "translateX(-50%)",
                                                background: C.red, borderRadius: 4,
                                                padding: "2px 5px",
                                                color: "#fff", fontSize: 8, fontWeight: 900, ...mono,
                                                whiteSpace: "nowrap",
                                            }}>4.8 kWh</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: `${C.red}11`, border: `1px solid ${C.red}22`,
                    borderRadius: 8, padding: "8px 10px",
                }}>
                    <span style={{ fontSize: 16 }}>😕</span>
                    <span style={{ color: C.muted, fontSize: 12, lineHeight: 1.4 }}>
                        Which day caused this? Which appliance? You have no way to know.
                    </span>
                </div>
            </div>

            <div style={{
                color: C.muted, fontSize: 13, lineHeight: 1.7, textAlign: "center",
                padding: "0 8px",
            }}>
                Most Singapore households face this every month.
                <br />
                <span style={{ color: C.text }}>The data exists. The insight doesn{"'"}t.</span>
            </div>
        </div>
    );
}

// ── Scene 2: Detection ────────────────────────────────────────────────────────
// "We found it. Weekday afternoons. Every single day."
function SceneTwo({ visible }) {
    const tick = useTick(120, 16);

    const slots = [
        { t: "12PM", v: 0.4 }, { t: "1PM", v: 0.5 }, { t: "2PM", v: 2.1 },
        { t: "3PM", v: 2.3 }, { t: "4PM", v: 2.2 }, { t: "5PM", v: 2.0 },
        { t: "6PM", v: 0.6 }, { t: "7PM", v: 1.8 }, { t: "8PM", v: 2.2 },
    ];

    return (
        <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
            <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.amber, fontSize: 11, letterSpacing: "0.12em", ...mono, marginBottom: 8 }}>
                    PULSE DETECTED IT
                </div>
                <h2 style={{
                    color: C.text, fontSize: 24, fontWeight: 900, margin: 0, lineHeight: 1.25,
                    letterSpacing: "-0.5px",
                }}>
                    Weekday afternoons.<br />
                    <span style={{ color: C.amber }}>Aircon left on</span> while no one{"'"}s home.
                </h2>
            </div>

            {/* detection card */}
            <div style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 16, overflow: "hidden", marginBottom: 16,
            }}>
                {/* top banner */}
                <div style={{
                    background: `linear-gradient(135deg, ${C.amber}22, ${C.amber}11)`,
                    borderBottom: `1px solid ${C.amber}33`,
                    padding: "10px 16px",
                    display: "flex", alignItems: "center", gap: 10,
                }}>
                    <span style={{ fontSize: 18 }}>🔍</span>
                    <div>
                        <div style={{ color: C.amber, fontWeight: 800, fontSize: 13 }}>
                            Anomaly detected · Weekdays 2–6 PM
                        </div>
                        <div style={{ color: C.muted, fontSize: 11 }}>
                            Pattern identified across 18 consecutive weekdays
                        </div>
                    </div>
                </div>

                <div style={{ padding: "14px 16px" }}>
                    {/* heatmap-style weekday pattern */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ color: C.muted, fontSize: 10, ...mono, marginBottom: 8 }}>
                            YOUR WEEKDAY USAGE PATTERN
                        </div>
                        <div style={{ display: "flex", gap: 3 }}>
                            {slots.map((s, i) => {
                                const isHot = s.v > 1.5;
                                const shown = i <= tick / 2;
                                return (
                                    <div key={i} style={{ flex: 1 }}>
                                        <div style={{
                                            height: 32,
                                            background: shown
                                                ? isHot
                                                    ? `linear-gradient(180deg, ${C.amber}, ${C.amber}66)`
                                                    : `${C.muted}22`
                                                : C.dim,
                                            borderRadius: 4,
                                            border: isHot && shown ? `1px solid ${C.amber}66` : "none",
                                            boxShadow: isHot && shown ? `0 0 8px ${C.amber}44` : "none",
                                            transition: "background 0.4s ease, box-shadow 0.4s ease",
                                        }} />
                                        <div style={{ color: C.muted, fontSize: 8, textAlign: "center", marginTop: 3, ...mono }}>
                                            {s.t}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                            <div style={{ width: 12, height: 12, borderRadius: 2, background: C.amber }} />
                            <span style={{ color: C.muted, fontSize: 11 }}>Aircon running · no occupancy detected</span>
                        </div>
                    </div>

                    <Divider />

                    {/* identified appliance */}
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 12,
                            background: `${C.amber}18`, border: `1px solid ${C.amber}44`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 26,
                        }}>❄️</div>
                        <div>
                            <div style={{ color: C.text, fontWeight: 800, fontSize: 15 }}>Air Conditioner</div>
                            <div style={{ color: C.muted, fontSize: 12 }}>Bedroom unit · 4 hrs/day unoccupied</div>
                            <div style={{ color: C.amber, fontSize: 12, fontWeight: 700, marginTop: 2 }}>
                                Confidence: 94%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* the translation */}
            <div style={{
                background: `${C.red}0d`, border: `1px solid ${C.red}22`,
                borderRadius: 14, padding: "14px 16px",
                display: "flex", gap: 14, alignItems: "center",
            }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>🧋</span>
                <div>
                    <div style={{ color: C.red, fontWeight: 800, fontSize: 14 }}>
                        That{"'"}s 18 bubble teas — wasted every month
                    </div>
                    <div style={{ color: C.muted, fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>
                        $0.60/day × 30 days = $18/month on an empty room
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Scene 3: The Action ───────────────────────────────────────────────────────
// "One change. Shift to off-peak."
function SceneThree({ visible }) {
    const [step, setStep] = useState(0);
    const tick = useTick(600, 4);

    useEffect(() => {
        if (!visible) return;
        setStep(0);
        const timers = [
            setTimeout(() => setStep(1), 600),
            setTimeout(() => setStep(2), 1400),
            setTimeout(() => setStep(3), 2400),
        ];
        return () => timers.forEach(clearTimeout);
    }, [visible]);

    const actions = [
        { icon: "📬", text: "Pulse sends a shift suggestion", done: step >= 1 },
        { icon: "⏰", text: "Wei Ling sets a reminder for 11 PM", done: step >= 2 },
        { icon: "✅", text: "Aircon scheduled off by 6 PM daily", done: step >= 3 },
    ];

    return (
        <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
            <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.blue, fontSize: 11, letterSpacing: "0.12em", ...mono, marginBottom: 8 }}>
                    THE ACTION TAKEN
                </div>
                <h2 style={{
                    color: C.text, fontSize: 24, fontWeight: 900, margin: 0, lineHeight: 1.25,
                    letterSpacing: "-0.5px",
                }}>
                    One nudge.<br />
                    <span style={{ color: C.blue }}>Three taps.</span> Problem solved.
                </h2>
            </div>

            {/* notification mockup */}
            <div style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${C.border}`,
                borderRadius: 14, padding: "12px 14px",
                marginBottom: 16,
                backdropFilter: "blur(10px)",
            }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 9,
                        background: `linear-gradient(135deg, ${C.green}, ${C.greenDim})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, flexShrink: 0,
                    }}>⚡</div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>SP Energy Pulse</span>
                            <span style={{ color: C.muted, fontSize: 11 }}>8:02 AM</span>
                        </div>
                        <div style={{ color: C.text, fontSize: 13, marginTop: 3, lineHeight: 1.4 }}>
                            Tip: Your aircon runs 4 hrs/day unoccupied.
                            Scheduling it off by 6 PM saves{" "}
                            <span style={{ color: C.green, fontWeight: 700 }}>$18/month</span> — that{"'"}s 18 🧋.
                        </div>
                    </div>
                </div>
            </div>

            {/* step-by-step reveal */}
            <div style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 16, padding: "16px",
                marginBottom: 16,
                display: "flex", flexDirection: "column", gap: 12,
            }}>
                {actions.map((a, i) => (
                    <div key={i} style={{
                        display: "flex", gap: 12, alignItems: "center",
                        opacity: a.done ? 1 : 0.25,
                        transition: "opacity 0.5s ease",
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                            background: a.done ? `${C.green}22` : C.dim,
                            border: `1px solid ${a.done ? C.green : C.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 15,
                            transition: "background 0.4s ease, border-color 0.4s ease",
                            boxShadow: a.done ? `0 0 10px ${C.greenGlow}` : "none",
                        }}>
                            {a.done ? "✓" : a.icon}
                        </div>
                        <span style={{
                            color: a.done ? C.text : C.muted,
                            fontSize: 13, fontWeight: a.done ? 600 : 400,
                            transition: "color 0.4s ease",
                        }}>{a.text}</span>
                    </div>
                ))}
            </div>

            {/* TOU savings explainer */}
            <div style={{
                background: `${C.blue}0d`, border: `1px solid ${C.blue}22`,
                borderRadius: 14, padding: "12px 14px",
            }}>
                <div style={{ color: C.blue, fontSize: 11, ...mono, marginBottom: 6 }}>
                    OFF-PEAK RATE (TOU PLAN)
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8 }}>
                    <div style={{ background: `${C.red}11`, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                        <div style={{ color: C.muted, fontSize: 9, ...mono }}>PEAK</div>
                        <div style={{ color: C.red, fontSize: 16, fontWeight: 900, ...mono }}>$0.45</div>
                        <div style={{ color: C.muted, fontSize: 9 }}>per kWh</div>
                    </div>
                    <div style={{ color: C.muted, fontSize: 18 }}>→</div>
                    <div style={{ background: `${C.green}11`, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                        <div style={{ color: C.muted, fontSize: 9, ...mono }}>OFF-PEAK</div>
                        <div style={{ color: C.green, fontSize: 16, fontWeight: 900, ...mono }}>$0.19</div>
                        <div style={{ color: C.muted, fontSize: 9 }}>per kWh</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Scene 4: The Result ───────────────────────────────────────────────────────
// The transformation. Hard numbers. Real impact.
function SceneFour({ visible }) {
    return (
        <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
            <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.green, fontSize: 11, letterSpacing: "0.12em", ...mono, marginBottom: 8 }}>
                    ONE MONTH LATER
                </div>
                <h2 style={{
                    color: C.text, fontSize: 24, fontWeight: 900, margin: 0, lineHeight: 1.25,
                    letterSpacing: "-0.5px",
                }}>
                    Wei Ling{"'"}s bill.<br />
                    <span style={{ color: C.green }}>Down $22. Tree thriving.</span>
                </h2>
            </div>

            {/* before/after bill */}
            <div style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 16, overflow: "hidden", marginBottom: 16,
            }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    <div style={{
                        padding: "16px", borderRight: `1px solid ${C.border}`,
                        background: `${C.red}06`,
                    }}>
                        <div style={{ color: C.muted, fontSize: 10, ...mono }}>BEFORE</div>
                        <div style={{ color: C.red, fontSize: 30, fontWeight: 900, ...mono, margin: "6px 0 2px" }}>$128</div>
                        <div style={{ color: C.muted, fontSize: 11 }}>No insight</div>
                        <div style={{ color: C.muted, fontSize: 11 }}>No action</div>
                    </div>
                    <div style={{ padding: "16px", background: `${C.green}06` }}>
                        <div style={{ color: C.muted, fontSize: 10, ...mono }}>AFTER PULSE</div>
                        <div style={{ color: C.green, fontSize: 30, fontWeight: 900, ...mono, margin: "6px 0 2px" }}>
                            {visible ? <Counter to={106} prefix="$" duration={1400} color={C.green} size={30} /> : "$128"}
                        </div>
                        <div style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>▼ $22 saved</div>
                        <div style={{ color: C.muted, fontSize: 11 }}>= 22 🧋</div>
                    </div>
                </div>

                <div style={{
                    borderTop: `1px solid ${C.border}`, padding: "12px 16px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                    <div style={{ color: C.muted, fontSize: 12 }}>Annual projection</div>
                    <div style={{ color: C.green, fontWeight: 800, fontSize: 14 }}>
                        {visible ? <Counter to={264} prefix="−$" suffix="/yr" duration={1800} color={C.green} size={14} /> : "−$264/yr"}
                    </div>
                </div>
            </div>

            {/* 3 concrete impact stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                    { icon: "🧋", top: visible ? <Counter to={264} duration={1600} color={C.green} size={22} /> : "0", label: "bubble teas/yr saved" },
                    { icon: "🌱", top: visible ? <Counter to={312} suffix=" kg" duration={1700} color={C.green} size={22} /> : "0 kg", label: "CO₂ avoided" },
                    { icon: "🌳", top: "Stage 3", label: "tree · thriving", isText: true },
                ].map((s, i) => (
                    <div key={i} style={{
                        background: C.surface, border: `1px solid ${C.border}`,
                        borderRadius: 14, padding: "12px 10px", textAlign: "center",
                    }}>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                        <div style={{ color: C.green, fontWeight: 900, fontSize: s.isText ? 13 : undefined, lineHeight: 1 }}>
                            {s.top}
                        </div>
                        <div style={{ color: C.muted, fontSize: 10, marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* social proof */}
            <div style={{
                background: `${C.green}0a`, border: `1px solid ${C.green}22`,
                borderRadius: 14, padding: "14px 16px",
            }}>
                <div style={{ color: C.green, fontSize: 11, ...mono, marginBottom: 8 }}>
                    ACROSS SINGAPORE
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                        "12,400 households shifted their peak-hour usage this week",
                        "Combined saving: 84 MW — enough to power 21,000 homes",
                        "Average user saves $22/month within their first 4 weeks",
                    ].map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <div style={{
                                width: 5, height: 5, borderRadius: "50%",
                                background: C.green, marginTop: 6, flexShrink: 0,
                            }} />
                            <span style={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>{s}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Setup: Step 1 meter ───────────────────────────────────────────────────────
function SetupMeter({ onNext }) {
    const [val, setVal] = useState("");
    const valid = val.length >= 6;
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
                <div style={{ color: C.muted, fontSize: 11, ...mono, letterSpacing: "0.1em", marginBottom: 8 }}>
                    STEP 1 OF 3 · CONNECT YOUR DATA
                </div>
                <h2 style={{ color: C.text, fontSize: 22, fontWeight: 900, margin: 0 }}>
                    Enter your SP meter number
                </h2>
                <p style={{ color: C.muted, fontSize: 13, margin: "8px 0 0", lineHeight: 1.6 }}>
                    Found on your SP bill or the SP app. We fetch your half-hourly data directly.
                </p>
            </div>

            <div style={{
                background: C.surface, border: `1px solid ${valid ? C.green : C.border}`,
                borderRadius: 14, padding: "14px 16px",
                transition: "border-color 0.3s ease",
                boxShadow: valid ? `0 0 16px ${C.greenGlow}` : "none",
            }}>
                <div style={{ color: C.muted, fontSize: 10, ...mono, marginBottom: 8 }}>SP METER NUMBER</div>
                <input
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    placeholder="e.g. 98765432A"
                    style={{
                        width: "100%", background: "transparent",
                        border: "none", outline: "none",
                        color: C.text, fontSize: 20, fontWeight: 700, ...mono,
                        padding: 0,
                    }}
                />
                {valid && (
                    <div style={{ color: C.green, fontSize: 12, marginTop: 8, display: "flex", gap: 6, alignItems: "center" }}>
                        <span>✓</span> Valid format — ready to connect
                    </div>
                )}
            </div>

            <div style={{
                background: `${C.blue}0d`, border: `1px solid ${C.blue}18`,
                borderRadius: 12, padding: "12px 14px",
                display: "flex", gap: 10,
            }}>
                <span style={{ fontSize: 16 }}>🔒</span>
                <span style={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>
                    Your data stays private. We never share consumption figures. Leaderboards show aliases only.
                </span>
            </div>

            <button
                onClick={onNext}
                disabled={!valid}
                style={{
                    background: valid ? `linear-gradient(135deg, ${C.green}, ${C.greenDim})` : C.dim,
                    border: "none", borderRadius: 14, padding: "15px 0",
                    color: valid ? "#000" : C.muted, fontSize: 15, fontWeight: 900,
                    cursor: valid ? "pointer" : "default",
                    boxShadow: valid ? `0 4px 24px ${C.greenGlow}` : "none",
                    transition: "all 0.3s ease",
                    letterSpacing: "0.02em",
                }}>
                Connect my data →
            </button>
        </div>
    );
}

// ── Setup: Step 2 profile ─────────────────────────────────────────────────────
function SetupProfile({ onNext }) {
    const [home, setHome] = useState(1);
    const [size, setSize] = useState(1);
    const [tou, setTou] = useState(null);
    const [fam, setFam] = useState(0);
    const [showTouInfo, setShowTouInfo] = useState(false);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <div style={{ color: C.muted, fontSize: 11, ...mono, letterSpacing: "0.1em", marginBottom: 8 }}>
                    STEP 2 OF 3 · PERSONALISE YOUR EXPERIENCE
                </div>
                <h2 style={{ color: C.text, fontSize: 22, fontWeight: 900, margin: 0 }}>
                    Quick profile — 30 seconds
                </h2>
                <p style={{ color: C.muted, fontSize: 13, margin: "8px 0 0" }}>
                    This calibrates your Analogy Engine and savings calculations.
                </p>
            </div>

            {/* home type */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ color: C.muted, fontSize: 10, ...mono, marginBottom: 10 }}>HOME TYPE</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {["HDB 2–3rm", "HDB 4-room", "HDB 5rm/EA", "Condo", "Landed"].map((o, i) => (
                        <button key={i} onClick={() => setHome(i)} style={{
                            background: home === i ? `${C.green}22` : C.bg,
                            border: `1px solid ${home === i ? C.green : C.border}`,
                            borderRadius: 8, padding: "7px 12px",
                            color: home === i ? C.green : C.muted, fontSize: 12, cursor: "pointer",
                            fontFamily: "inherit",
                        }}>{o}</button>
                    ))}
                </div>
            </div>

            {/* household size */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ color: C.muted, fontSize: 10, ...mono, marginBottom: 10 }}>HOUSEHOLD SIZE</div>
                <div style={{ display: "flex", gap: 8 }}>
                    {["1–2 people", "3–4 people", "5+ people"].map((o, i) => (
                        <button key={i} onClick={() => setSize(i)} style={{
                            flex: 1, background: size === i ? `${C.green}22` : C.bg,
                            border: `1px solid ${size === i ? C.green : C.border}`,
                            borderRadius: 8, padding: "9px 0",
                            color: size === i ? C.green : C.muted, fontSize: 12, cursor: "pointer",
                            fontFamily: "inherit",
                        }}>{o}</button>
                    ))}
                </div>
            </div>

            {/* TOU — most important */}
            <div style={{
                background: C.surface,
                border: `1px solid ${tou !== null ? C.green : C.border}`,
                borderRadius: 14, padding: "14px 16px",
                boxShadow: tou !== null ? `0 0 20px ${C.greenGlow}` : "none",
                transition: "border-color 0.3s, box-shadow 0.3s",
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ color: C.muted, fontSize: 10, ...mono }}>TIME-OF-USE PLAN</div>
                    <button
                        onClick={() => setShowTouInfo(v => !v)}
                        style={{
                            width: 18, height: 18, borderRadius: "50%",
                            background: showTouInfo ? C.blue : C.dim,
                            border: `1px solid ${showTouInfo ? C.blue : C.border}`,
                            color: showTouInfo ? "#fff" : C.muted,
                            fontSize: 11, fontWeight: 800, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "inherit", lineHeight: 1, flexShrink: 0,
                            transition: "background 0.2s, border-color 0.2s",
                        }}
                    >?</button>
                </div>
                {showTouInfo && (
                    <div style={{
                        background: `${C.blue}0d`, border: `1px solid ${C.blue}25`,
                        borderRadius: 10, padding: "10px 12px", marginBottom: 10,
                        fontSize: 12, color: C.muted, lineHeight: 1.6,
                    }}>
                        <span style={{ color: C.text, fontWeight: 700 }}>Time-of-Use (TOU)</span> is an electricity pricing plan where you pay <span style={{ color: C.red, fontWeight: 600 }}>more during peak hours</span> (7–9 AM & 6–10 PM) and <span style={{ color: C.green, fontWeight: 600 }}>less off-peak</span>. By shifting heavy appliances like your washing machine or dryer to run after 10 PM, you can save up to <span style={{ color: C.green, fontWeight: 700 }}>$18/month</span>.
                    </div>
                )}
                <div style={{ color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                    Are you on SP{"'"}s TOU tariff?
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {["Yes", "No / Not sure"].map((o, i) => (
                        <button key={i} onClick={() => setTou(i)} style={{
                            flex: 1, background: tou === i ? `${C.green}22` : C.bg,
                            border: `1px solid ${tou === i ? C.green : C.border}`,
                            borderRadius: 10, padding: "10px 0",
                            color: tou === i ? C.green : C.muted, fontSize: 13, cursor: "pointer",
                            fontWeight: tou === i ? 700 : 400, fontFamily: "inherit",
                        }}>{o}</button>
                    ))}
                </div>
                {tou === 1 && (
                    <div style={{
                        marginTop: 10, background: `${C.green}0d`,
                        border: `1px solid ${C.green}33`, borderRadius: 10, padding: "10px 12px",
                    }}>
                        <div style={{ color: C.green, fontSize: 13, fontWeight: 800 }}>
                            🏆 Enrolling in TOU is your #1 action — saves ~$18/month
                        </div>
                        <div style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>
                            We{"'"}ll make this the first thing on your savings stack.
                        </div>
                    </div>
                )}
            </div>

            <button onClick={onNext} style={{
                background: `linear-gradient(135deg, ${C.green}, ${C.greenDim})`,
                border: "none", borderRadius: 14, padding: "15px 0",
                color: "#000", fontSize: 15, fontWeight: 900, cursor: "pointer",
                boxShadow: `0 4px 24px ${C.greenGlow}`,
                letterSpacing: "0.02em", fontFamily: "inherit",
            }}>
                Launch my dashboard →
            </button>
        </div>
    );
}

// ── Progress dots ─────────────────────────────────────────────────────────────
const Dots = ({ total, active }) => (
    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
                width: i === active ? 20 : 7,
                height: 7, borderRadius: 99,
                background: i === active ? C.green : C.dim,
                transition: "width 0.3s ease, background 0.3s ease",
                boxShadow: i === active ? `0 0 8px ${C.green}` : "none",
            }} />
        ))}
    </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function OnboardingPage() {
    // story slides 0-3, then setup 4-5
    const [slide, setSlide] = useState(0);
    const scrollRef = useRef(null);
    const router = useRouter();
    const isStory = slide < 4;
    const isSetup = slide >= 4;

    const storySlides = [
        { label: "THE PROBLEM", comp: SceneOne },
        { label: "DETECTION", comp: SceneTwo },
        { label: "THE ACTION", comp: SceneThree },
        { label: "THE RESULT", comp: SceneFour },
    ];

    const next = () => setSlide(s => Math.min(s + 1, 5));
    const prev = () => setSlide(s => Math.max(s - 1, 0));

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, [slide]);

    const ctaLabel = [
        "See how it was found →",
        "See what action was taken →",
        "See the result →",
        "Get my own insights →",
    ][slide] || "";

    return (
        <div style={{
            minHeight: "100vh", background: "#04060c",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px 16px",
            fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        }}>
            <div style={{ width: "100%", maxWidth: 414 }}>
                {/* phone shell */}
                <div style={{
                    background: C.bg,
                    borderRadius: 50,
                    border: "2px solid #1a2535",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px #0a0f1a, inset 0 1px 0 #1e2d45",
                    overflow: "hidden",
                    display: "flex", flexDirection: "column",
                    height: 896,
                }}>
                    {/* status bar */}
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "14px 22px 6px",
                    }}>
                        <span style={{ color: C.text, fontSize: 13, fontWeight: 700, ...mono }}>9:41</span>
                        <div style={{ width: 88, height: 24, background: "#000", borderRadius: 12, border: "2px solid #1a2535" }} />
                        <div style={{ display: "flex", gap: 4 }}>
                            <span style={{ fontSize: 12 }}>📶</span>
                            <span style={{ fontSize: 12 }}>🔋</span>
                        </div>
                    </div>

                    {/* story header (shown only during story slides) */}
                    {isStory && (
                        <div style={{ padding: "6px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: 8,
                                    background: `linear-gradient(135deg, ${C.green}, ${C.greenDim})`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 15,
                                }}>⚡</div>
                                <span style={{ color: C.text, fontSize: 13, fontWeight: 800 }}>Energy Pulse</span>
                            </div>
                            <button onClick={() => setSlide(4)} style={{
                                background: "none", border: `1px solid ${C.border}`,
                                borderRadius: 8, padding: "4px 10px",
                                color: C.muted, fontSize: 12, cursor: "pointer",
                            }}>Skip →</button>
                        </div>
                    )}

                    {/* progress bar strip (story only) */}
                    {isStory && (
                        <div style={{ display: "flex", gap: 3, padding: "10px 22px 0" }}>
                            {storySlides.map((_, i) => (
                                <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: C.dim, overflow: "hidden" }}>
                                    <div style={{
                                        height: "100%", borderRadius: 99,
                                        background: i < slide ? C.green : i === slide ? C.green : "transparent",
                                        width: i < slide ? "100%" : i === slide ? "100%" : "0%",
                                        transition: i === slide ? "none" : "width 0s",
                                    }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* scrollable content */}
                    <div ref={scrollRef} style={{ padding: "20px 22px", overflowY: "auto", flex: 1 }}>
                        {isStory && storySlides.map(({ comp: Comp }, i) => (
                            <div key={i} style={{ display: slide === i ? "block" : "none" }}>
                                <Comp visible={slide === i} />
                            </div>
                        ))}

                        {slide === 4 && <SetupMeter onNext={next} />}
                        {slide === 5 && <SetupProfile onNext={() => router.push("/dashboard")} />}
                    </div>

                    {/* bottom CTA bar (story only) */}
                    {isStory && (
                        <div style={{ padding: "12px 22px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                            <button onClick={next} style={{
                                background: `linear-gradient(135deg, ${C.green}, ${C.greenDim})`,
                                border: "none", borderRadius: 14, padding: "14px 0",
                                color: "#000", fontSize: 14, fontWeight: 900, cursor: "pointer",
                                boxShadow: `0 4px 24px ${C.greenGlow}`,
                                letterSpacing: "0.02em",
                            }}>
                                {ctaLabel}
                            </button>
                            <Dots total={4} active={slide} />
                        </div>
                    )}
                </div>

                {/* demo nav (outside phone) */}
                <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
                    {["Problem", "Detection", "Action", "Result", "Meter setup", "Profile setup"].map((l, i) => (
                        <button key={i} onClick={() => setSlide(i)} style={{
                            background: slide === i ? `${C.green}22` : "transparent",
                            border: `1px solid ${slide === i ? C.green : C.border}`,
                            borderRadius: 8, padding: "5px 10px",
                            color: slide === i ? C.green : C.muted,
                            fontSize: 11, cursor: "pointer", ...mono,
                        }}>{l}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}
