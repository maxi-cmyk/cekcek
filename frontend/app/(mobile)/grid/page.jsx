"use client";

import { useState, useEffect } from "react";
import { Grid } from "lucide-react";
import { fetchGrid } from "../../../lib/api.js";

const C = {
    bg: "#07090f", surface: "#0e1219", border: "#1c2535",
    green: "#00d68f", red: "#ff4757", amber: "#ffb347", blue: "#4a9eff",
    text: "#eef2f8", muted: "#5a7090", dim: "#28374f",
};
const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

// SVG area chart using utilisation_pct from real ClickHouse data
function AreaChart({ data }) {
    if (!data || data.length === 0) return null;
    const W = 380, H = 100;
    const values = data.map(d => d.utilisation_pct);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const range = maxV - minV || 1;

    const pts = data.map((d, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((d.utilisation_pct - minV) / range) * (H - 10) - 5;
        return `${x},${y}`;
    });

    // Colour the line red in high-util zones
    const lineColor = maxV >= 65 ? "#ff4757" : maxV >= 52 ? "#ffb347" : "#00d68f";
    const linePath = `M ${pts.join(" L ")}`;
    const areaPath = `M 0,${H} L ${pts.join(" L ")} L ${W},${H} Z`;

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
            <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={lineColor} stopOpacity="0.3" />
                    <stop offset="95%" stopColor={lineColor} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#areaGrad)" />
            <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" />
        </svg>
    );
}

export default function GridPage() {
    const [gridStatus, setGridStatus] = useState(null);
    const [loading, setLoading] = useState(true);


    const [timeline, setTimeline] = useState([]);

    useEffect(() => {
        fetchGrid().catch(() => null).then(data => {
            if (data?.grid_status) setGridStatus(data.grid_status);
            if (data?.timeline) setTimeline(data.timeline);
            setLoading(false);
        });
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
            </div>

            {/* Live stats row */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, color: C.muted, ...mono, letterSpacing: "0.08em", marginBottom: 6 }}>DEMAND</div>
                    <div style={{ fontSize: 22, fontWeight: 900, ...mono, color: C.text, lineHeight: 1 }}>
                        {loading ? "—" : `${demandMw?.toLocaleString() ?? "—"}`}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>MW</div>
                </div>
                <div style={{ flex: 1, background: C.surface, border: `1px solid ${levelColor}30`, borderRadius: 14, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, color: C.muted, ...mono, letterSpacing: "0.08em", marginBottom: 6 }}>UTILISATION</div>
                    <div style={{ fontSize: 22, fontWeight: 900, ...mono, color: levelColor, lineHeight: 1 }}>
                        {loading ? "—" : `${utilPct ?? "—"}%`}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>of capacity</div>
                </div>
            </div>

            {/* AI Summary Card */}
            <div style={{ background: `${C.green}08`, border: `1px solid ${C.green}20`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.green, ...mono, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>⚡</span> WHAT'S HAPPENING RIGHT NOW
                </div>
                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ height: 14, borderRadius: 4, background: `${C.muted}22`, width: "100%" }} />
                        <div style={{ height: 14, borderRadius: 4, background: `${C.muted}22`, width: "85%" }} />
                        <div style={{ height: 14, borderRadius: 4, background: `${C.muted}22`, width: "70%" }} />
                    </div>
                ) : (
                    <p style={{ fontSize: 14, color: C.text, lineHeight: 1.75, margin: "0 0 16px" }}>
                        {summary}
                    </p>
                )}
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                        <span style={{ fontSize: 16 }}>🌍</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>If 10,000 households shifted one appliance out of peak hours:</span>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, ...mono, letterSpacing: "-0.05em", color: C.text, lineHeight: 1, marginBottom: 4 }}>
                        -180 MW <span style={{ fontSize: 16, color: C.muted, letterSpacing: 0 }}>peak demand</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.muted }}>Enough to power 45,000 homes</div>
                </div>
            </div>

            {/* National Grid Live */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.muted, ...mono }}>NATIONAL GRID · LIVE</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${levelColor}10`, border: `1px solid ${levelColor}20`, padding: "4px 12px", borderRadius: 99 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: levelColor, boxShadow: `0 0 6px ${levelColor}` }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: levelColor }}>{level}</span>
                    </div>
                </div>

                {loading ? (
                    <div style={{ height: 100, background: `${C.dim}40`, borderRadius: 8, marginBottom: 8 }} />
                ) : (
                    <div style={{ height: 100, marginBottom: 8, overflow: "hidden" }}>
                        <AreaChart data={timeline} />
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, ...mono, color: C.muted, textTransform: "uppercase", padding: "0 2px" }}>
                    <span>12 AM</span>
                    <span>12 PM</span>
                    <span>NOW</span>
                </div>

                {peakWindow !== "—" && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ color: C.muted }}>Peak window</span>
                        <span style={{ color: C.amber, fontWeight: 700, ...mono }}>{peakWindow}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
