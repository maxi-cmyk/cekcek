"use client";

import { useState, useEffect } from "react";
import { TreePine } from "lucide-react";
import { fetchGamification } from "../../../lib/api.js";

const C = {
    bg: "#07090f", surface: "#0e1219", border: "#1c2535",
    green: "#00d68f", "green-dim": "#00a36b", red: "#ff4757", amber: "#ffb347",
    text: "#eef2f8", muted: "#5a7090", dim: "#28374f",
};
const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

const TREE_EMOJI = {
    Thriving: "🌳",
    Healthy: "🌲",
    Wilting: "🌿",
    Dormant: "🪴",
};

const TREE_PROGRESS = {
    Thriving: 90,
    Healthy: 60,
    Wilting: 30,
    Dormant: 10,
};

export default function ForestPage() {
    const [gam, setGam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGamification().catch(() => null).then(data => {
            if (data) setGam(data);
            setLoading(false);
        });
    }, []);

    const treeStatus = gam?.tree_status ?? "Healthy";
    const treeEmoji = TREE_EMOJI[treeStatus] ?? "🌳";
    const progress = TREE_PROGRESS[treeStatus] ?? 50;
    const points = gam?.points ?? 0;
    const streak = gam?.streak_days ?? 0;
    const leaderboard = gam?.leaderboard ?? [];
    const nextReward = gam?.next_reward ?? "—";

    return (
        <div style={{ padding: "20px", color: C.text, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <TreePine size={24} style={{ color: C.green }} />
                <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Resilience Forest</h1>
            </div>

            {/* Main Tree View */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16, position: "relative", overflow: "hidden" }}>
                {/* Glow */}
                <div style={{ position: "absolute", top: "33%", left: "50%", transform: "translate(-50%, -50%)", width: 150, height: 150, background: `${C.green}20`, filter: "blur(50px)", borderRadius: "50%", pointerEvents: "none" }} />

                {/* Tree emoji */}
                <div style={{ fontSize: 110, lineHeight: 1, marginBottom: 24, position: "relative", zIndex: 1, filter: "drop-shadow(0 15px 15px rgba(0,0,0,0.5))", transition: "transform 0.5s ease" }}>
                    {loading ? "🌱" : treeEmoji}
                </div>

                {/* Status badge */}
                <div style={{ background: `${C.green}10`, color: C.green, border: `1px solid ${C.green}30`, padding: "4px 12px", borderRadius: 99, fontSize: 10, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, zIndex: 1, boxShadow: `0 0 15px rgba(0,214,143,0.15)` }}>
                    {loading ? "LOADING…" : treeStatus.toUpperCase()}
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px", zIndex: 1 }}>
                    {streak}-day streak
                </h2>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 20, zIndex: 1 }}>
                    Keep going — stay below baseline to grow your tree
                </p>

                {/* Progress bar */}
                <div style={{ width: "100%", zIndex: 1 }}>
                    <div style={{ height: 8, background: C.bg, borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
                        <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C["green-dim"]}, ${C.green})`, borderRadius: 99, boxShadow: `0 0 10px ${C.green}` }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, ...mono }}>
                        <span>Seedling</span>
                        <span>Lush Forest</span>
                    </div>
                </div>
            </div>

            {/* Points & Leaderboard */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.muted, ...mono, marginBottom: 16 }}>
                    ECOSYSTEM POINTS
                </div>

                {/* Total points hero */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
                    <span style={{ fontSize: 40, fontWeight: 900, color: C.green, ...mono }}>{points.toLocaleString()}</span>
                    <span style={{ fontSize: 14, color: C.muted }}>pts total</span>
                </div>

                {/* Next reward */}
                <div style={{ background: `${C.green}08`, border: `1px solid ${C.green}20`, borderRadius: 12, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: C.green, fontWeight: 600 }}>
                    🎯 {nextReward}
                </div>

                {/* Leaderboard */}
                {leaderboard.length > 0 && (
                    <>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.muted, ...mono, marginBottom: 12 }}>LEADERBOARD</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {leaderboard.map((entry, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ fontSize: 14, ...mono, color: i === 0 ? C.amber : i === 1 ? C.muted : C.dim }}>{i + 1}.</span>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{entry.alias}</span>
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 700, ...mono, color: C.green }}>{entry.points.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
