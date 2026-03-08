"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building, Flame, HelpCircle, X, Home, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NOTIFICATIONS = [
    { icon: "🧋", title: "Laundry = savings", body: "18 bubble teas a month — only if you do your laundry right now!", time: "now" },
    { icon: "🏘️", title: "Your neighbor just saved big", body: "Your neighbor just got $15 off. Save more to redeem for yourself too! 💸", time: "1m ago" },
    { icon: "🌙", title: "Skip the AC tonight", body: "It's a cold day today — you don't need the AC to sleep tonight ❄️", time: "3m ago" },
    { icon: "🌳", title: "Your forest is at risk! 🚨", body: "Energy projected to hit baseline by 9:30 PM!! Slow down to save your forest 🔥", time: "5m ago" },
];

function NotificationOverlay({ onClose }) {
    const [index, setIndex] = useState(0);

    function handleClick() {
        if (index < NOTIFICATIONS.length - 1) {
            setIndex(i => i + 1);
        } else {
            onClose();
        }
    }

    const notif = NOTIFICATIONS[index];

    return (
        <div
            onClick={handleClick}
            style={{
                position: "absolute", inset: 0, zIndex: 300,
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                background: "rgba(4,6,12,0.55)",
                display: "flex", flexDirection: "column",
                alignItems: "center", paddingTop: 80,
            }}
        >
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginBottom: 16, letterSpacing: "0.06em" }}>
                Tap anywhere to continue
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -40, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.96 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        width: "88%",
                        background: "rgba(28,32,46,0.92)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        borderRadius: 20,
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "14px 16px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 11 }}>⚡</span>
                            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>SP ENERGY</span>
                        </div>
                        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{notif.time}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                            background: "rgba(255,255,255,0.08)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 24,
                        }}>
                            {notif.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: "#eef2f8", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{notif.title}</div>
                            <div style={{ color: "rgba(238,242,248,0.65)", fontSize: 15, lineHeight: 1.6 }}>{notif.body}</div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
                {NOTIFICATIONS.map((_, i) => (
                    <div key={i} style={{
                        width: i === index ? 18 : 6, height: 6, borderRadius: 99,
                        background: i === index ? "#00d68f" : "rgba(255,255,255,0.2)",
                        transition: "all 0.3s ease",
                    }} />
                ))}
            </div>

            <button
                onClick={e => { e.stopPropagation(); onClose(); }}
                style={{
                    marginTop: 24, background: "none", border: "none",
                    color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer",
                    fontFamily: "inherit", letterSpacing: "0.05em",
                }}
            >
                dismiss all
            </button>
        </div>
    );
}

const C = {
    bg: "#07090f", surface: "#0e1219", border: "#1c2535",
    green: "#00d68f", red: "#ff4757", amber: "#ffb347", blue: "#4a9eff",
    text: "#eef2f8", muted: "#5a7090", dim: "#28374f",
};
const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

const DEMO_CONSUMPTION = [
    { hour:0,  minute:0,  kwh:0.135 }, { hour:0,  minute:30, kwh:0.132 },
    { hour:1,  minute:0,  kwh:0.120 }, { hour:1,  minute:30, kwh:0.115 },
    { hour:2,  minute:0,  kwh:0.110 }, { hour:2,  minute:30, kwh:0.108 },
    { hour:3,  minute:0,  kwh:0.105 }, { hour:3,  minute:30, kwh:0.102 },
    { hour:4,  minute:0,  kwh:0.100 }, { hour:4,  minute:30, kwh:0.098 },
    { hour:5,  minute:0,  kwh:0.115 }, { hour:5,  minute:30, kwh:0.130 },
    { hour:6,  minute:0,  kwh:0.210 }, { hour:6,  minute:30, kwh:0.280 },
    { hour:7,  minute:0,  kwh:0.520 }, { hour:7,  minute:30, kwh:0.610 },
    { hour:8,  minute:0,  kwh:0.580 }, { hour:8,  minute:30, kwh:0.490 },
    { hour:9,  minute:0,  kwh:0.350 }, { hour:9,  minute:30, kwh:0.310 },
    { hour:10, minute:0,  kwh:0.290 }, { hour:10, minute:30, kwh:0.275 },
    { hour:11, minute:0,  kwh:0.260 }, { hour:11, minute:30, kwh:0.255 },
    { hour:12, minute:0,  kwh:0.310 }, { hour:12, minute:30, kwh:0.340 },
    { hour:13, minute:0,  kwh:0.370 }, { hour:13, minute:30, kwh:0.350 },
    { hour:14, minute:0,  kwh:0.640 }, { hour:14, minute:30, kwh:0.680 },
    { hour:15, minute:0,  kwh:0.720 }, { hour:15, minute:30, kwh:0.700 },
    { hour:16, minute:0,  kwh:0.690 }, { hour:16, minute:30, kwh:0.650 },
    { hour:17, minute:0,  kwh:0.420 }, { hour:17, minute:30, kwh:0.380 },
    { hour:18, minute:0,  kwh:0.750 }, { hour:18, minute:30, kwh:0.820 },
    { hour:19, minute:0,  kwh:0.890 }, { hour:19, minute:30, kwh:0.860 },
    { hour:20, minute:0,  kwh:0.810 }, { hour:20, minute:30, kwh:0.760 },
    { hour:21, minute:0,  kwh:0.620 }, { hour:21, minute:30, kwh:0.550 },
    { hour:22, minute:0,  kwh:0.380 }, { hour:22, minute:30, kwh:0.290 },
    { hour:23, minute:0,  kwh:0.210 }, { hour:23, minute:30, kwh:0.178 },
];

const ANOMALY_SLOTS = [
    { t: "12PM", hot: false }, { t: "1PM", hot: false }, { t: "2PM", hot: true },
    { t: "3PM", hot: true  }, { t: "4PM", hot: true  }, { t: "5PM", hot: true },
    { t: "6PM", hot: false }, { t: "7PM", hot: true  }, { t: "8PM", hot: true },
];

function AnomalyCard() {
    return (
        <div style={{ background: "#0e1219", border: "1px solid #1c2535", borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
            {/* banner */}
            <div style={{ background: "linear-gradient(135deg, #ffb34722, #ffb34711)", borderBottom: "1px solid #ffb34733", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>🔍</span>
                <div>
                    <div style={{ color: "#ffb347", fontWeight: 800, fontSize: 13 }}>Anomaly detected · Weekdays 2–6 PM</div>
                    <div style={{ color: "#5a7090", fontSize: 11 }}>Pattern identified across 18 consecutive weekdays</div>
                </div>
            </div>
            <div style={{ padding: "14px 16px" }}>
                {/* heatmap */}
                <div style={{ color: "#5a7090", fontSize: 10, fontFamily: "'JetBrains Mono',monospace", marginBottom: 8 }}>YOUR WEEKDAY USAGE PATTERN</div>
                <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                    {ANOMALY_SLOTS.map((s, i) => (
                        <div key={i} style={{ flex: 1 }}>
                            <div style={{
                                height: 28, borderRadius: 4,
                                background: s.hot ? "linear-gradient(180deg, #ffb347, #ffb34766)" : "#5a709022",
                                border: s.hot ? "1px solid #ffb34766" : "none",
                                boxShadow: s.hot ? "0 0 6px #ffb34744" : "none",
                            }} />
                            <div style={{ color: "#5a7090", fontSize: 8, textAlign: "center", marginTop: 3, fontFamily: "'JetBrains Mono',monospace" }}>{s.t}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 14 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: "#ffb347" }} />
                    <span style={{ color: "#5a7090", fontSize: 11 }}>Aircon running · no occupancy detected</span>
                </div>
                {/* appliance */}
                <div style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 12, borderTop: "1px solid #1c2535" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ffb34718", border: "1px solid #ffb34744", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>❄️</div>
                    <div>
                        <div style={{ color: "#eef2f8", fontWeight: 800, fontSize: 15 }}>Air Conditioner</div>
                        <div style={{ color: "#5a7090", fontSize: 12 }}>Bedroom unit · 4 hrs/day unoccupied</div>
                        <div style={{ color: "#ffb347", fontSize: 12, fontWeight: 700, marginTop: 2 }}>Confidence: 94%</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AnalogyCard() {
    return (
        <div style={{ background: "#ff475708", border: "1px solid #ff475722", borderRadius: 14, padding: "14px 16px", marginBottom: 16, display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 32, flexShrink: 0 }}>🧋</span>
            <div>
                <div style={{ color: "#ff4757", fontWeight: 800, fontSize: 14 }}>That's 18 bubble teas — wasted every month</div>
                <div style={{ color: "#5a7090", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>$0.60/day × 30 days = $18/month on an empty room</div>
            </div>
        </div>
    );
}

function TOUCard() {
    const [showInfo, setShowInfo] = useState(false);
    return (
        <div style={{ background: "#4a9eff0d", border: "1px solid #4a9eff22", borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showInfo ? 10 : 12 }}>
                <div style={{ color: "#4a9eff", fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>OFF-PEAK RATE (TOU PLAN)</div>
                <button onClick={() => setShowInfo(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: showInfo ? "#4a9eff" : "#5a7090", display: "flex", alignItems: "center" }}>
                    {showInfo ? <X size={16} /> : <HelpCircle size={16} />}
                </button>
            </div>
            {showInfo && (
                <div style={{ background: "#4a9eff12", border: "1px solid #4a9eff25", borderRadius: 10, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#5a7090", lineHeight: 1.6 }}>
                    <span style={{ color: "#eef2f8", fontWeight: 700 }}>Time-of-Use (TOU)</span> is a pricing plan where electricity costs more during peak hours (7–9am & 6–10pm) and less off-peak. By shifting usage to off-peak slots — like running your washing machine at night — you can cut your bill significantly.
                </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8 }}>
                <div style={{ background: "#ff475711", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                    <div style={{ color: "#5a7090", fontSize: 9, fontFamily: "'JetBrains Mono',monospace" }}>PEAK</div>
                    <div style={{ color: "#ff4757", fontSize: 18, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace" }}>$0.45</div>
                    <div style={{ color: "#5a7090", fontSize: 9 }}>per kWh</div>
                </div>
                <div style={{ color: "#5a7090", fontSize: 18 }}>→</div>
                <div style={{ background: "#00d68f11", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                    <div style={{ color: "#5a7090", fontSize: 9, fontFamily: "'JetBrains Mono',monospace" }}>OFF-PEAK</div>
                    <div style={{ color: "#00d68f", fontSize: 18, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace" }}>$0.19</div>
                    <div style={{ color: "#5a7090", fontSize: 9 }}>per kWh</div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const [consumption, setConsumption] = useState([]);
    const [spike, setSpike] = useState(null);
    const [grid, setGrid] = useState(null);
    const [gamification, setGamification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNotifs, setShowNotifs] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            setConsumption(DEMO_CONSUMPTION);
            setGrid({ current_level: "Moderate", stress_score: 62 });
            setGamification({ streak_days: 7 });
            setLoading(false);
        }, 2000);
        return () => clearTimeout(t);
    }, []);

    // One bar per hour (average the two 30-min slots)
    const bars = Array.from({ length: 24 }, (_, h) => {
        const slots = consumption.filter(r => r.hour === h);
        const kwh = slots.length ? slots.reduce((s, r) => s + r.kwh, 0) / slots.length : 0;
        return { hour: h, kwh, label: h === 0 ? "12am" : h === 12 ? "12pm" : h < 12 ? `${h}am` : `${h - 12}pm` };
    });
    const maxKwh = Math.max(...bars.map(b => b.kwh), 0.01);
    const totalKwh = consumption.reduce((s, r) => s + r.kwh, 0);

    const gridColor = grid?.current_level === "High" ? C.red : grid?.current_level === "Moderate" ? C.amber : C.green;
    const gridLabel = grid ? `${grid.current_level} — ${grid.stress_score}% load` : "Loading…";

    return (
        <div style={{ position: "relative", padding: "20px", color: C.text, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
            {showNotifs && <NotificationOverlay onClose={() => setShowNotifs(false)} />}

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <Home size={24} style={{ color: C.green }} />
                <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Home</h1>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
                    {loading && <div className="spinner" />}
                    <button
                        onClick={() => setShowNotifs(true)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", position: "relative" }}
                    >
                        <Bell size={24} color={C.text} />
                        <div style={{
                            position: "absolute", top: -2, right: -2,
                            width: 8, height: 8, borderRadius: "50%",
                            background: C.red, border: "1.5px solid #07090f",
                        }} />
                    </button>
                </div>
            </div>

            {/* Today's Usage */}
            <div style={{ background: C.surface, borderRadius: 16, padding: "16px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {loading
                            ? <div className="skeleton" style={{ width: 110, height: 15 }} />
                            : <>
                                <span style={{ fontWeight: 700, fontSize: 15 }}>Today's Usage</span>
                                {totalKwh > 0 && <span style={{ fontSize: 13, color: C.green, fontWeight: 700, ...mono }}>{totalKwh.toFixed(2)} kWh</span>}
                              </>
                        }
                    </div>
                    <div style={{ background: "#0a0f18", padding: 4, borderRadius: 8, border: `1px solid ${C.border}` }}>
                        <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${C.green}20`, color: C.green, border: `1px solid ${C.green}30` }}>day</span>
                    </div>
                </div>

                {/* Bar chart */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 96, marginBottom: 8 }}>
                    {loading
                        ? Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="skeleton" style={{
                                flex: 1,
                                height: [18,28,22,35,20,30,40,55,48,38,32,44,60,52,46,58,70,80,72,65,50,38,28,18][i],
                                borderRadius: "2px 2px 0 0",
                                animationDelay: `${i * 0.06}s`,
                            }} />
                          ))
                        : bars.map((b, i) => {
                            const isPeak = (b.hour >= 7 && b.hour <= 9) || (b.hour >= 18 && b.hour <= 22);
                            const isTop = b.kwh === maxKwh;
                            const barHeight = Math.max((b.kwh / maxKwh) * 86, b.kwh > 0 ? 4 : 0);
                            return (
                                <div key={i} style={{
                                    flex: 1, height: barHeight,
                                    background: isTop ? "linear-gradient(180deg, #ff4757, #ff475788)" : isPeak ? `linear-gradient(180deg, ${C.amber}, ${C.amber}66)` : `${C.green}55`,
                                    borderRadius: "2px 2px 0 0",
                                    boxShadow: isTop ? `0 0 8px rgba(255,71,87,0.5)` : "none",
                                    transition: "height 0.4s ease",
                                }} title={`${b.label}: ${b.kwh.toFixed(3)} kWh`} />
                            );
                          })
                    }
                </div>

                {/* X-axis labels */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, ...mono, color: C.muted, marginBottom: 6 }}>
                    <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span>
                </div>

                {/* Legend + spike annotation */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, ...mono, color: C.muted }}>
                    <div style={{ display: "flex", gap: 10 }}>
                        <span><span style={{ color: C.green }}>■</span> off-peak</span>
                        <span><span style={{ color: C.amber }}>■</span> peak</span>
                        <span><span style={{ color: C.red }}>■</span> highest</span>
                    </div>
                    {spike && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ color: C.red, fontSize: 10 }}>●</span>
                            <span>spike {spike.display_time}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid Status mini-card */}
            <div style={{ background: C.surface, borderRadius: 16, padding: "16px", border: `1px solid ${C.border}`, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", color: C.muted, ...mono, marginBottom: 8 }}>GRID STATUS · RIGHT NOW</div>
                    {loading || !grid ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div className="skeleton-x" style={{ width: 160, height: 16 }} />
                            <div className="skeleton-x" style={{ width: 100, height: 12 }} />
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: gridColor, boxShadow: `0 0 8px ${gridColor}` }} />
                                <span style={{ fontWeight: 700, fontSize: 15, color: gridColor }}>Grid is {grid.current_level.toLowerCase()}</span>
                            </div>
                            <div style={{ color: C.muted, fontSize: 12 }}>{grid.stress_score}% national load</div>
                        </>
                    )}
                </div>
                <button
                    onClick={() => router.push("/grid")}
                    style={{ background: `${C.dim}50`, border: `1px solid ${C.border}`, color: C.blue, borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                >
                    Grid Pulse →
                </button>
            </div>

            {/* Daily Streak */}
            <div style={{ background: C.surface, borderRadius: 16, padding: "16px", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", color: C.muted, ...mono, marginBottom: 8 }}>DAILY STREAK</div>
                    {loading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div className="skeleton-x" style={{ width: 140, height: 20 }} />
                            <div style={{ display: "flex", gap: 6 }}>
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <div key={i} className="skeleton" style={{ height: 6, width: 24, borderRadius: 99, animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                <Flame size={24} style={{ color: "#f97316", filter: "drop-shadow(0 0 8px rgba(249,115,22,0.6))" }} fill="#f97316" />
                                <span style={{ fontWeight: 900, fontSize: 18, lineHeight: 1.2 }}>
                                    {gamification ? `${gamification.streak_days} days below` : "— days below"}<br />baseline
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <div key={i} style={{ height: 6, width: 24, borderRadius: 99, background: i < (gamification?.streak_days ?? 0) ? C.green : `${C.muted}30`, boxShadow: i < (gamification?.streak_days ?? 0) ? `0 0 5px ${C.green}` : "none" }} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <button
                    onClick={() => router.push("/forest")}
                    style={{ background: `${C.green}10`, color: C.green, border: `1px solid ${C.green}30`, padding: "8px 12px", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", lineHeight: 1.4 }}
                >
                    View<br />Forest
                </button>
            </div>

            {/* Anomaly Detected / Analogy / TOU — hidden while loading */}
            {loading ? (
                <>
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                        <div className="skeleton" style={{ height: 148, borderRadius: 16 }} />
                        <div className="skeleton" style={{ height: 72, borderRadius: 14 }} />
                        <div className="skeleton" style={{ height: 96, borderRadius: 14 }} />
                    </div>
                </>
            ) : (
                <>
                    {/* Anomaly Detected */}
                    <AnomalyCard />

                    {/* Bubble Tea Analogy */}
                    <AnalogyCard />

                    {/* TOU Plan */}
                    <TOUCard />
                </>
            )}
        </div>
    );
}
