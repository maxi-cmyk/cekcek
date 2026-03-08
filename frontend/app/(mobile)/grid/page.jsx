"use client";

import { useState, useEffect, useRef } from "react";
import { Grid } from "lucide-react";
const C = {
    bg: "#07090f", surface: "#0e1219", border: "#1c2535",
    green: "#00d68f", red: "#ff4757", amber: "#ffb347", blue: "#4a9eff",
    text: "#eef2f8", muted: "#5a7090", dim: "#28374f",
};
const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

const DEMO_GRID_STATUS = {
    current_level: "Moderate", stress_score: 62,
    peak_window: "7pm – 9pm", demand_mw: 6200, capacity_mw: 10000,
    summary: "Today, Singapore's electricity demand is moderate at 6,200 MW, sitting at 62% of the national capacity. Demand peaks between 7 PM and 9 PM, reaching around 69%. To save on your bill, avoid running heavy appliances like the washing machine or dishwasher during these hours — shifting to after 10 PM can make a real difference.",
};

const DEMO_TIMELINE = [
    { hour:0,  minute:0,  utilisation_pct:44.5, demand_mw:4450, capacity_mw:10000 },
    { hour:0,  minute:30, utilisation_pct:44.1, demand_mw:4410, capacity_mw:10000 },
    { hour:1,  minute:0,  utilisation_pct:43.8, demand_mw:4380, capacity_mw:10000 },
    { hour:1,  minute:30, utilisation_pct:43.5, demand_mw:4350, capacity_mw:10000 },
    { hour:2,  minute:0,  utilisation_pct:43.2, demand_mw:4320, capacity_mw:10000 },
    { hour:2,  minute:30, utilisation_pct:43.0, demand_mw:4300, capacity_mw:10000 },
    { hour:3,  minute:0,  utilisation_pct:42.8, demand_mw:4280, capacity_mw:10000 },
    { hour:3,  minute:30, utilisation_pct:42.5, demand_mw:4250, capacity_mw:10000 },
    { hour:4,  minute:0,  utilisation_pct:42.3, demand_mw:4230, capacity_mw:10000 },
    { hour:4,  minute:30, utilisation_pct:42.0, demand_mw:4200, capacity_mw:10000 },
    { hour:5,  minute:0,  utilisation_pct:43.5, demand_mw:4350, capacity_mw:10000 },
    { hour:5,  minute:30, utilisation_pct:45.2, demand_mw:4520, capacity_mw:10000 },
    { hour:6,  minute:0,  utilisation_pct:48.8, demand_mw:4880, capacity_mw:10000 },
    { hour:6,  minute:30, utilisation_pct:52.1, demand_mw:5210, capacity_mw:10000 },
    { hour:7,  minute:0,  utilisation_pct:57.4, demand_mw:5740, capacity_mw:10000 },
    { hour:7,  minute:30, utilisation_pct:61.2, demand_mw:6120, capacity_mw:10000 },
    { hour:8,  minute:0,  utilisation_pct:62.8, demand_mw:6280, capacity_mw:10000 },
    { hour:8,  minute:30, utilisation_pct:61.5, demand_mw:6150, capacity_mw:10000 },
    { hour:9,  minute:0,  utilisation_pct:59.3, demand_mw:5930, capacity_mw:10000 },
    { hour:9,  minute:30, utilisation_pct:57.8, demand_mw:5780, capacity_mw:10000 },
    { hour:10, minute:0,  utilisation_pct:56.4, demand_mw:5640, capacity_mw:10000 },
    { hour:10, minute:30, utilisation_pct:55.9, demand_mw:5590, capacity_mw:10000 },
    { hour:11, minute:0,  utilisation_pct:55.5, demand_mw:5550, capacity_mw:10000 },
    { hour:11, minute:30, utilisation_pct:56.2, demand_mw:5620, capacity_mw:10000 },
    { hour:12, minute:0,  utilisation_pct:58.1, demand_mw:5810, capacity_mw:10000 },
    { hour:12, minute:30, utilisation_pct:59.3, demand_mw:5930, capacity_mw:10000 },
    { hour:13, minute:0,  utilisation_pct:58.7, demand_mw:5870, capacity_mw:10000 },
    { hour:13, minute:30, utilisation_pct:57.9, demand_mw:5790, capacity_mw:10000 },
    { hour:14, minute:0,  utilisation_pct:57.2, demand_mw:5720, capacity_mw:10000 },
    { hour:14, minute:30, utilisation_pct:56.8, demand_mw:5680, capacity_mw:10000 },
    { hour:15, minute:0,  utilisation_pct:56.5, demand_mw:5650, capacity_mw:10000 },
    { hour:15, minute:30, utilisation_pct:57.1, demand_mw:5710, capacity_mw:10000 },
    { hour:16, minute:0,  utilisation_pct:58.4, demand_mw:5840, capacity_mw:10000 },
    { hour:16, minute:30, utilisation_pct:60.2, demand_mw:6020, capacity_mw:10000 },
    { hour:17, minute:0,  utilisation_pct:62.5, demand_mw:6250, capacity_mw:10000 },
    { hour:17, minute:30, utilisation_pct:64.8, demand_mw:6480, capacity_mw:10000 },
    { hour:18, minute:0,  utilisation_pct:67.3, demand_mw:6730, capacity_mw:10000 },
    { hour:18, minute:30, utilisation_pct:68.9, demand_mw:6890, capacity_mw:10000 },
    { hour:19, minute:0,  utilisation_pct:69.4, demand_mw:6940, capacity_mw:10000 },
    { hour:19, minute:30, utilisation_pct:68.2, demand_mw:6820, capacity_mw:10000 },
    { hour:20, minute:0,  utilisation_pct:66.5, demand_mw:6650, capacity_mw:10000 },
    { hour:20, minute:30, utilisation_pct:64.1, demand_mw:6410, capacity_mw:10000 },
    { hour:21, minute:0,  utilisation_pct:61.8, demand_mw:6180, capacity_mw:10000 },
    { hour:21, minute:30, utilisation_pct:58.9, demand_mw:5890, capacity_mw:10000 },
    { hour:22, minute:0,  utilisation_pct:55.2, demand_mw:5520, capacity_mw:10000 },
    { hour:22, minute:30, utilisation_pct:51.8, demand_mw:5180, capacity_mw:10000 },
    { hour:23, minute:0,  utilisation_pct:48.5, demand_mw:4850, capacity_mw:10000 },
    { hour:23, minute:30, utilisation_pct:46.2, demand_mw:4620, capacity_mw:10000 },
];

// SVG area chart with green→red gradient and interactive crosshair
function AreaChart({ data }) {
    const [hoverIdx, setHoverIdx] = useState(null);
    const svgRef = useRef(null);

    if (!data || data.length === 0) return null;
    const W = 380, H = 100;
    const values = data.map(d => d.utilisation_pct);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const range = maxV - minV || 1;

    const pts = data.map((d, i) => ({
        x: (i / (data.length - 1)) * W,
        y: H - ((d.utilisation_pct - minV) / range) * (H - 10) - 5,
        ...d,
    }));

    const linePath = `M ${pts.map(p => `${p.x},${p.y}`).join(" L ")}`;
    const areaPath = `M 0,${H} L ${pts.map(p => `${p.x},${p.y}`).join(" L ")} L ${W},${H} Z`;

    function handleMouseMove(e) {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const svgX = ((e.clientX - rect.left) / rect.width) * W;
        let closest = 0, minDist = Infinity;
        pts.forEach((p, i) => {
            const d = Math.abs(p.x - svgX);
            if (d < minDist) { minDist = d; closest = i; }
        });
        setHoverIdx(closest);
    }

    function fmtTime(d) {
        const h = d.hour, m = d.minute;
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
    }

    const hovPt = hoverIdx !== null ? pts[hoverIdx] : null;
    const xPct = hovPt ? (hovPt.x / W) * 100 : 0;
    const flipLeft = hovPt && hovPt.x > W * 0.65;

    return (
        <div style={{ position: "relative" }}>
            <svg
                ref={svgRef}
                width="100%"
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                style={{ display: "block", cursor: "crosshair" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverIdx(null)}
            >
                <defs>
                    {/* vertical gradient: red at top (high), green at bottom (low) */}
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#ff4757" />
                        <stop offset="45%"  stopColor="#ffb347" />
                        <stop offset="100%" stopColor="#00d68f" />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#ff4757" stopOpacity="0.35" />
                        <stop offset="50%"  stopColor="#ffb347" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#00d68f" stopOpacity="0" />
                    </linearGradient>
                </defs>

                <path d={areaPath} fill="url(#areaGrad)" />
                <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinejoin="round" />

                {hovPt && (
                    <>
                        {/* vertical crosshair */}
                        <line
                            x1={hovPt.x} y1={0} x2={hovPt.x} y2={H}
                            stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 3"
                        />
                        {/* dot on line */}
                        <circle cx={hovPt.x} cy={hovPt.y} r={3.5} fill="#0e1219" stroke="#eef2f8" strokeWidth="1.5" />
                    </>
                )}
            </svg>

            {/* Floating tooltip */}
            {hovPt && (
                <div style={{
                    position: "absolute",
                    top: 4,
                    left: flipLeft ? "auto" : `${xPct}%`,
                    right: flipLeft ? `${100 - xPct}%` : "auto",
                    transform: flipLeft ? "translateX(8px)" : "translateX(-50%)",
                    background: "rgba(14,18,25,0.95)",
                    border: "1px solid #1c2535",
                    borderRadius: 8,
                    padding: "6px 10px",
                    pointerEvents: "none",
                    zIndex: 10,
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                }}>
                    <div style={{ fontSize: 10, color: "#5a7090", fontFamily: "'JetBrains Mono',monospace", marginBottom: 2 }}>
                        {fmtTime(hovPt)}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#eef2f8", fontFamily: "'JetBrains Mono',monospace" }}>
                        {hovPt.utilisation_pct}%
                    </div>
                    <div style={{ fontSize: 10, color: "#5a7090" }}>
                        {hovPt.demand_mw?.toLocaleString()} MW
                    </div>
                </div>
            )}
        </div>
    );
}

export default function GridPage() {
    const [gridStatus, setGridStatus] = useState(null);
    const [loading, setLoading] = useState(true);


    const [timeline, setTimeline] = useState([]);

    useEffect(() => {
        const t = setTimeout(() => {
            setGridStatus(DEMO_GRID_STATUS);
            setTimeline(DEMO_TIMELINE);
            setLoading(false);
        }, 2000);
        return () => clearTimeout(t);
    }, []);

    const level = gridStatus?.current_level ?? "—";
    const levelColor = level === "High" ? C.red : level === "Moderate" ? C.amber : C.green;
    const peakWindow = gridStatus?.peak_window ?? "—";
    const demandMw = gridStatus?.demand_mw;
    const utilPct = gridStatus?.stress_score;
    const summary = gridStatus?.summary ?? null;

    return (
        <div style={{ padding: "20px", color: C.text, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <Grid size={24} style={{ color: C.blue }} />
                <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Singapore Grid</h1>
                {loading && <div className="spinner" style={{ marginLeft: "auto" }} />}
            </div>

            {/* Live stats row */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, color: C.muted, ...mono, letterSpacing: "0.08em", marginBottom: 6 }}>DEMAND</div>
                    {loading
                        ? <div className="skeleton-x" style={{ width: 80, height: 22, marginBottom: 6 }} />
                        : <div style={{ fontSize: 22, fontWeight: 900, ...mono, color: C.text, lineHeight: 1 }}>{demandMw?.toLocaleString()}</div>
                    }
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>MW</div>
                </div>
                <div style={{ flex: 1, background: C.surface, border: `1px solid ${loading ? C.border : `${levelColor}30`}`, borderRadius: 14, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, color: C.muted, ...mono, letterSpacing: "0.08em", marginBottom: 6 }}>UTILISATION</div>
                    {loading
                        ? <div className="skeleton-x" style={{ width: 64, height: 22, marginBottom: 6 }} />
                        : <div style={{ fontSize: 22, fontWeight: 900, ...mono, color: levelColor, lineHeight: 1 }}>{utilPct}%</div>
                    }
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>of capacity</div>
                </div>
            </div>

            {/* AI Summary Card */}
            <div style={{ background: `${C.green}08`, border: `1px solid ${C.green}20`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.green, ...mono, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>⚡</span> WHAT'S HAPPENING RIGHT NOW
                </div>
                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                        <div className="skeleton-x" style={{ width: "100%", height: 13 }} />
                        <div className="skeleton-x" style={{ width: "88%", height: 13, animationDelay: "0.15s" }} />
                        <div className="skeleton-x" style={{ width: "72%", height: 13, animationDelay: "0.3s" }} />
                    </div>
                ) : (
                    <p style={{ fontSize: 14, color: C.text, lineHeight: 1.75, margin: "0 0 16px" }}>{summary}</p>
                )}
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
                    {loading ? (
                        <>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                                <div className="skeleton" style={{ width: 20, height: 20, borderRadius: 4 }} />
                                <div className="skeleton-x" style={{ width: "80%", height: 13 }} />
                            </div>
                            <div className="skeleton-x" style={{ width: "55%", height: 28, marginBottom: 8 }} />
                            <div className="skeleton-x" style={{ width: "65%", height: 12, animationDelay: "0.2s" }} />
                        </>
                    ) : (
                        <>
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                                <span style={{ fontSize: 16 }}>🌍</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>If 10,000 households shifted one appliance out of peak hours:</span>
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 900, ...mono, letterSpacing: "-0.05em", color: C.text, lineHeight: 1, marginBottom: 4 }}>
                                -180 MW <span style={{ fontSize: 16, color: C.muted, letterSpacing: 0 }}>peak demand</span>
                            </div>
                            <div style={{ fontSize: 12, color: C.muted }}>Enough to power 45,000 homes</div>
                        </>
                    )}
                </div>
            </div>

            {/* National Grid Live */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.muted, ...mono }}>NATIONAL GRID · LIVE</span>
                    {loading ? (
                        <div className="skeleton-x" style={{ width: 70, height: 24, borderRadius: 99 }} />
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${levelColor}10`, border: `1px solid ${levelColor}20`, padding: "4px 12px", borderRadius: 99 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: levelColor, boxShadow: `0 0 6px ${levelColor}` }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: levelColor }}>{level}</span>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div style={{ height: 100, marginBottom: 8, position: "relative", borderRadius: 8, overflow: "hidden" }}>
                        {/* Fake area chart outline skeleton */}
                        <svg width="100%" height="100" viewBox="0 0 380 100" preserveAspectRatio="none">
                            <path d="M 0,80 C 40,75 80,60 120,50 C 160,40 200,55 240,45 C 280,35 320,25 380,30 L 380,100 L 0,100 Z"
                                className="skeleton" style={{ fill: "#5a7090", animation: "skeleton-pulse 1.6s ease-in-out infinite" }} />
                            <path d="M 0,80 C 40,75 80,60 120,50 C 160,40 200,55 240,45 C 280,35 320,25 380,30"
                                fill="none" stroke="#5a7090" strokeWidth="2"
                                style={{ opacity: 0.3, animation: "skeleton-pulse 1.6s ease-in-out infinite" }} />
                        </svg>
                    </div>
                ) : (
                    <div style={{ marginBottom: 8 }}>
                        <AreaChart data={timeline} />
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, ...mono, color: C.muted, textTransform: "uppercase", padding: "0 2px" }}>
                    <span>12 AM</span>
                    <span>12 PM</span>
                    <span>NOW</span>
                </div>

                {!loading && peakWindow !== "—" && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ color: C.muted }}>Peak window</span>
                        <span style={{ color: C.amber, fontWeight: 700, ...mono }}>{peakWindow}</span>
                    </div>
                )}
                {loading && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
                        <div className="skeleton-x" style={{ width: 80, height: 12 }} />
                        <div className="skeleton-x" style={{ width: 60, height: 12 }} />
                    </div>
                )}
            </div>

            {/* Comparison */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginTop: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.muted, ...mono, marginBottom: 20 }}>COMPARISON</div>

                {/* Median HDB bar */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: C.muted, lineHeight: 1.4 }}>Median 4-room HDB</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: C.muted, ...mono }}>380 kWh</span>
                    </div>
                    <div style={{ background: C.dim, borderRadius: 99, height: 8, overflow: "hidden" }}>
                        <div style={{ width: "72%", height: "100%", background: C.muted, borderRadius: 99 }} />
                    </div>
                </div>

                {/* You bar */}
                <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>You</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: C.blue, ...mono }}>521 kWh</span>
                    </div>
                    <div style={{ background: C.dim, borderRadius: 99, height: 8, overflow: "hidden" }}>
                        <div style={{ width: "100%", height: "100%", background: `linear-gradient(90deg, ${C.blue}, ${C.blue}99)`, borderRadius: 99, boxShadow: `0 0 8px ${C.blue}55` }} />
                    </div>
                </div>

                {/* Explanation box */}
                <div style={{ background: `${C.blue}0d`, border: `1px solid ${C.blue}25`, borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <span style={{ fontSize: 14 }}>💡</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.blue, letterSpacing: "0.06em" }}>+37% ABOVE MEDIAN</span>
                    </div>
                    <p style={{ fontSize: 13, color: C.text, lineHeight: 1.65, margin: 0 }}>
                        Your usage is <span style={{ color: C.blue, fontWeight: 700 }}>141 kWh above</span> the median household. This is likely driven by your <span style={{ fontWeight: 700 }}>air conditioner</span> (running ~45 mins/day unoccupied) and an older <span style={{ fontWeight: 700 }}>refrigerator</span> with a low energy tick rating — both flagged in your Appliance Intelligence.
                    </p>
                </div>
            </div>
        </div>
    );
}
