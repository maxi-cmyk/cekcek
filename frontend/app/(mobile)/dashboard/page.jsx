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

const DEMO_WEEK = [
    { label: "Mon", kwh: 8.2 },
    { label: "Tue", kwh: 9.1 },
    { label: "Wed", kwh: 7.8 },
    { label: "Thu", kwh: 10.4 },
    { label: "Fri", kwh: 11.2 },
    { label: "Sat", kwh: 14.8 },
    { label: "Sun", kwh: 13.5 },
];

const DEMO_MONTH = [
    7.4, 8.9, 6.2, 9.8, 11.5, 13.1, 12.4,
    8.1, 7.3, 10.6, 9.2, 8.7, 15.8, 11.9,
    6.8, 9.5, 12.3, 8.4, 7.1, 10.2, 14.7,
    9.9, 8.3, 11.1, 6.5, 13.6, 10.8, 16.2,
    7.9, 9.3,
].map((kwh, i) => ({ label: `${i + 1}`, kwh }));

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

const SPIKE_SLOTS = [
    { t: "12PM", hot: false }, { t: "1PM", hot: false }, { t: "2PM", hot: false },
    { t: "3PM", hot: true  }, { t: "4PM", hot: true  }, { t: "5PM", hot: true  },
    { t: "6PM", hot: false }, { t: "7PM", hot: false }, { t: "8PM", hot: false },
];

const SPIKE_APPLIANCES = [
    { emoji: "❄️", label: "Air Conditioner" },
    { emoji: "🧊", label: "Refrigerator" },
    { emoji: "🌀", label: "Tumble Dryer" },
];

function SpikeCard() {
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showToast, setShowToast] = useState(false);

    function handleSubmit() {
        if (!selected) return;
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            setShowModal(false);
            setSelected(null);
        }, 2200);
    }

    function closeModal() {
        setShowModal(false);
        setSelected(null);
        setShowToast(false);
    }

    return (
        <>
            {/* Card */}
            <div
                onClick={() => setShowModal(true)}
                style={{ background: C.surface, border: "1px solid #ff475733", borderRadius: 16, overflow: "hidden", marginBottom: 16, cursor: "pointer" }}
            >
                {/* banner */}
                <div style={{ background: "linear-gradient(135deg, #ff475718, #ff47570d)", borderBottom: "1px solid #ff475733", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>⚡</span>
                        <div>
                            <div style={{ color: C.red, fontWeight: 800, fontSize: 13 }}>Spike detected · 3–5 PM today</div>
                            <div style={{ color: C.muted, fontSize: 11 }}>Usage jumped 2.1× above your baseline</div>
                        </div>
                    </div>
                    <div style={{ background: `${C.red}20`, border: `1px solid ${C.red}40`, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: C.red, whiteSpace: "nowrap" }}>
                        Tap to log
                    </div>
                </div>

                <div style={{ padding: "14px 16px" }}>
                    <div style={{ color: C.muted, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", marginBottom: 8 }}>TODAY'S HOURLY PATTERN</div>
                    <div style={{ display: "flex", gap: 3 }}>
                        {SPIKE_SLOTS.map((s, i) => (
                            <div key={i} style={{ flex: 1 }}>
                                <div style={{
                                    height: 28, borderRadius: 4,
                                    background: s.hot ? "linear-gradient(180deg, #ff4757, #ff475766)" : "#5a709022",
                                    border: s.hot ? "1px solid #ff475766" : "none",
                                    boxShadow: s.hot ? "0 0 6px #ff475744" : "none",
                                }} />
                                <div style={{ color: C.muted, fontSize: 8, textAlign: "center", marginTop: 3, fontFamily: "'JetBrains Mono',monospace" }}>{s.t}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Appliance picker modal — fixed so it sits over the visible phone screen */}
            {showModal && (
                <div
                    onClick={closeModal}
                    style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end" }}
                >
                    <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: C.surface, borderRadius: "24px 24px 0 0", border: `1px solid ${C.border}`, borderBottom: "none", padding: "0 20px 40px" }}>
                        {/* drag handle */}
                        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 18px" }}>
                            <div style={{ width: 36, height: 4, borderRadius: 99, background: C.dim }} />
                        </div>

                        {/* +10 pts toast */}
                        {showToast && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)",
                                    background: C.green, color: "#07090f",
                                    borderRadius: 99, padding: "8px 20px",
                                    fontWeight: 800, fontSize: 14, whiteSpace: "nowrap",
                                    boxShadow: `0 0 20px ${C.green}66`,
                                    zIndex: 10,
                                }}
                            >
                                🎉 +10 points earned!
                            </motion.div>
                        )}

                        <div style={{ fontWeight: 800, fontSize: 17, color: C.text, marginBottom: 4 }}>What were you using?</div>
                        <div style={{ color: C.muted, fontSize: 12, marginBottom: 6 }}>Select the appliance running between 3–5 PM today.</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
                            <span style={{ fontSize: 13 }}>🌟</span>
                            <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>Log your appliance and earn +10 points</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                            {SPIKE_APPLIANCES.map(a => {
                                const active = selected === a.label;
                                return (
                                    <button
                                        key={a.label}
                                        onClick={() => setSelected(a.label)}
                                        style={{
                                            background: active ? `${C.red}18` : C.bg,
                                            border: `1px solid ${active ? C.red : C.border}`,
                                            borderRadius: 14, padding: "14px 16px",
                                            display: "flex", alignItems: "center", gap: 14,
                                            cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <span style={{ fontSize: 26 }}>{a.emoji}</span>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: active ? C.red : C.text }}>{a.label}</span>
                                        {active && <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: C.green }}>+10 pts</span>}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleSubmit}
                            style={{
                                width: "100%", padding: "13px 0",
                                background: selected ? C.green : C.dim,
                                color: selected ? "#07090f" : C.muted,
                                border: "none", borderRadius: 12,
                                fontWeight: 800, fontSize: 14, cursor: selected ? "pointer" : "default",
                                fontFamily: "inherit", transition: "all 0.2s",
                            }}
                        >
                            {selected ? `Log ${selected} · +10 pts` : "Select an appliance"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

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
    const [view, setView] = useState("day");
    const [hoveredBar, setHoveredBar] = useState(null);

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
    const dayBars = Array.from({ length: 24 }, (_, h) => {
        const slots = consumption.filter(r => r.hour === h);
        const kwh = slots.length ? slots.reduce((s, r) => s + r.kwh, 0) / slots.length : 0;
        return { hour: h, kwh, label: h === 0 ? "12am" : h === 12 ? "12pm" : h < 12 ? `${h}am` : `${h - 12}pm` };
    });

    const bars = view === "day" ? dayBars : view === "week" ? DEMO_WEEK : DEMO_MONTH;
    const maxKwh = Math.max(...bars.map(b => b.kwh), 0.01);
    const totalKwh = view === "day"
        ? consumption.reduce((s, r) => s + r.kwh, 0)
        : bars.reduce((s, b) => s + b.kwh, 0);

    const viewTitle = view === "day" ? "Today's Usage" : view === "week" ? "This Week" : "This Month";
    const xLabels = view === "day"
        ? ["12am", "6am", "12pm", "6pm", "11pm"]
        : view === "week"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : ["1", "8", "15", "22", "30"];

    // Green → Amber → Red interpolation based on 0–1 ratio, returns hex
    function heatColor(ratio) {
        let r, g, b;
        if (ratio <= 0.5) {
            const t = ratio * 2;
            r = Math.round(0   + t * (255 - 0));
            g = Math.round(214 + t * (179 - 214));
            b = Math.round(143 + t * (71  - 143));
        } else {
            const t = (ratio - 0.5) * 2;
            r = 255;
            g = Math.round(179 + t * (71  - 179));
            b = Math.round(71  + t * (87  - 71));
        }
        return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
    }

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

            {/* Usage card */}
            <div style={{ background: C.surface, borderRadius: 16, padding: "16px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {loading
                            ? <div className="skeleton" style={{ width: 110, height: 15 }} />
                            : <>
                                <span style={{ fontWeight: 700, fontSize: 15 }}>{viewTitle}</span>
                                {totalKwh > 0 && <span style={{ fontSize: 13, color: C.green, fontWeight: 700, ...mono }}>{totalKwh.toFixed(2)} kWh</span>}
                              </>
                        }
                    </div>
                    {/* Toggle */}
                    <div style={{ background: "#0a0f18", padding: 3, borderRadius: 8, border: `1px solid ${C.border}`, display: "flex", gap: 2 }}>
                        {["day", "week", "month"].map(v => (
                            <button key={v} onClick={() => setView(v)} style={{
                                padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                                background: view === v ? `${C.green}20` : "transparent",
                                color: view === v ? C.green : C.muted,
                                border: view === v ? `1px solid ${C.green}30` : "1px solid transparent",
                                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                            }}>{v}</button>
                        ))}
                    </div>
                </div>

                {/* Bar chart */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: view === "month" ? 1 : 2, height: 96, marginBottom: 8, position: "relative" }}>
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
                            const ratio = b.kwh / maxKwh;
                            const color = heatColor(ratio);
                            const barHeight = Math.max(ratio * 86, b.kwh > 0 ? 4 : 0);
                            const isHovered = hoveredBar === i;
                            return (
                                <div
                                    key={i}
                                    style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative" }}
                                    onMouseEnter={() => setHoveredBar(i)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                >
                                    {/* Tooltip */}
                                    {isHovered && (
                                        <div style={{
                                            position: "absolute",
                                            bottom: barHeight + 6,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            background: "#0e1219",
                                            border: `1px solid ${color}55`,
                                            borderRadius: 7,
                                            padding: "4px 8px",
                                            whiteSpace: "nowrap",
                                            zIndex: 10,
                                            pointerEvents: "none",
                                            boxShadow: `0 4px 12px rgba(0,0,0,0.5)`,
                                        }}>
                                            <div style={{ fontSize: 10, color, fontWeight: 800, ...mono }}>{b.label}</div>
                                            <div style={{ fontSize: 11, color: C.text, fontWeight: 700, ...mono }}>{b.kwh.toFixed(2)} kWh</div>
                                        </div>
                                    )}
                                    {/* Bar */}
                                    <div style={{
                                        width: "100%",
                                        height: barHeight,
                                        background: `linear-gradient(180deg, ${color}, ${color}88)`,
                                        borderRadius: "2px 2px 0 0",
                                        boxShadow: isHovered ? `0 0 8px ${color}88` : "none",
                                        transition: "height 0.4s ease, box-shadow 0.15s",
                                        opacity: hoveredBar !== null && !isHovered ? 0.5 : 1,
                                    }} />
                                </div>
                            );
                          })
                    }
                </div>

                {/* X-axis labels */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, ...mono, color: C.muted, marginBottom: 6 }}>
                    {xLabels.map(l => <span key={l}>{l}</span>)}
                </div>

                {/* Legend */}
                <div style={{ display: "flex", gap: 10, fontSize: 11, ...mono, color: C.muted }}>
                    <span><span style={{ color: C.green }}>■</span> low</span>
                    <span><span style={{ color: C.amber }}>■</span> medium</span>
                    <span><span style={{ color: C.red }}>■</span> high</span>
                </div>
            </div>

            {/* Spike Detected */}
            {!loading && <SpikeCard />}

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
