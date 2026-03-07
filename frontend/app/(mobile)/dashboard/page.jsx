"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building, Flame } from "lucide-react";
import { fetchInsights, fetchSpike, fetchGrid, fetchGamification, fetchConsumption } from "../../../lib/api.js";

const C = {
    bg: "#07090f", surface: "#0e1219", border: "#1c2535",
    green: "#00d68f", red: "#ff4757", amber: "#ffb347", blue: "#4a9eff",
    text: "#eef2f8", muted: "#5a7090", dim: "#28374f",
};
const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

export default function DashboardPage() {
    const router = useRouter();
    const [consumption, setConsumption] = useState([]);
    const [spike, setSpike] = useState(null);
    const [grid, setGrid] = useState(null);
    const [gamification, setGamification] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchConsumption().catch(() => null),
            fetchSpike().catch(() => null),
            fetchGrid().catch(() => null),
            fetchGamification().catch(() => null),
        ]).then(([cons, spk, grd, gam]) => {
            if (cons?.rows?.length) setConsumption(cons.rows);
            if (spk?.latest) setSpike(spk.latest);
            if (grd?.grid_status) setGrid(grd.grid_status);
            if (gam) setGamification(gam);
            setLoading(false);
        });
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
        <div style={{ padding: "20px", color: C.text, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

            {/* Today's Usage */}
            <div style={{ background: C.surface, borderRadius: 16, padding: "16px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>Today's Usage</span>
                        {!loading && totalKwh > 0 && (
                            <span style={{ marginLeft: 10, fontSize: 13, color: C.green, fontWeight: 700, ...mono }}>
                                {totalKwh.toFixed(2)} kWh
                            </span>
                        )}
                    </div>
                    <div style={{ background: "#0a0f18", padding: 4, borderRadius: 8, border: `1px solid ${C.border}` }}>
                        <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${C.green}20`, color: C.green, border: `1px solid ${C.green}30` }}>day</span>
                    </div>
                </div>

                {/* Bar chart */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 96, marginBottom: 8 }}>
                    {loading ? (
                        Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} style={{ flex: 1, height: 28, background: `${C.muted}22`, borderRadius: "2px 2px 0 0" }} />
                        ))
                    ) : bars.map((b, i) => {
                        const isPeak = (b.hour >= 7 && b.hour <= 9) || (b.hour >= 18 && b.hour <= 22);
                        const isTop = b.kwh === maxKwh;
                        const barHeight = Math.max((b.kwh / maxKwh) * 86, b.kwh > 0 ? 4 : 0);
                        return (
                            <div key={i} style={{
                                flex: 1,
                                height: barHeight,
                                background: isTop
                                    ? "linear-gradient(180deg, #ff4757, #ff475788)"
                                    : isPeak
                                        ? `linear-gradient(180deg, ${C.amber}, ${C.amber}66)`
                                        : `${C.green}55`,
                                borderRadius: "2px 2px 0 0",
                                boxShadow: isTop ? `0 0 8px rgba(255,71,87,0.5)` : "none",
                                transition: "height 0.4s ease",
                            }} title={`${b.label}: ${b.kwh.toFixed(3)} kWh`} />
                        );
                    })}
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
                <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", color: C.muted, ...mono, marginBottom: 8 }}>GRID STATUS · RIGHT NOW</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: gridColor, boxShadow: `0 0 8px ${gridColor}` }} />
                        <span style={{ fontWeight: 700, fontSize: 15, color: gridColor }}>
                            {grid ? `Grid is ${grid.current_level.toLowerCase()}` : "Loading…"}
                        </span>
                    </div>
                    <div style={{ color: C.muted, fontSize: 12 }}>{grid ? `${grid.stress_score}% national load` : "—"}</div>
                </div>
                <button
                    onClick={() => router.push("/grid")}
                    style={{ background: `${C.dim}50`, border: `1px solid ${C.border}`, color: C.blue, borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                >
                    Grid Pulse →
                </button>
            </div>

            {/* Daily Streak */}
            <div style={{ background: C.surface, borderRadius: 16, padding: "16px", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", color: C.muted, ...mono, marginBottom: 8 }}>DAILY STREAK</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <Flame size={24} style={{ color: "#f97316", filter: "drop-shadow(0 0 8px rgba(249,115,22,0.6))" }} fill="#f97316" />
                        <span style={{ fontWeight: 900, fontSize: 18, lineHeight: 1.2 }}>
                            {gamification ? `${gamification.streak_days} days below` : "— days below"}<br />baseline
                        </span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        {Array.from({ length: Math.max(7, gamification?.streak_days ?? 7) }).slice(0, 7).map((_, i) => (
                            <div key={i} style={{ height: 6, width: 24, borderRadius: 99, background: i < (gamification?.streak_days ?? 0) ? C.green : `${C.muted}30`, boxShadow: i < (gamification?.streak_days ?? 0) ? `0 0 5px ${C.green}` : "none" }} />
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => router.push("/forest")}
                    style={{ background: `${C.green}10`, color: C.green, border: `1px solid ${C.green}30`, padding: "8px 12px", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", lineHeight: 1.4 }}
                >
                    View<br />Forest
                </button>
            </div>
        </div>
    );
}
