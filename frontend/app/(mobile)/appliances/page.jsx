"use client";

import { ChevronLeft, Home, Search, Snowflake, ThermometerSnowflake, WashingMachine } from "lucide-react";

const C = {
    bg: "#07090f", surface: "#0e1219", border: "#1c2535", borderHi: "#2a3d58",
    green: "#00d68f", red: "#ff4757", blue: "#4a9eff",
    text: "#eef2f8", muted: "#5a7090",
};

export default function AppliancesPage() {
    return (
        <div style={{ padding: "20px", color: C.text, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <Home size={24} style={{ color: C.blue }} />
                <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Appliance Intelligence</h1>
            </div>

            {/* Passive Detection Card */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 20, marginBottom: 16, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 150, height: 150, background: `${C.blue}10`, filter: "blur(40px)", borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Search size={14} style={{ color: C.blue }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.blue, fontFamily: "monospace", textTransform: "uppercase" }}>Passive Detection</span>
                    </div>
                    <button style={{ color: C.muted, background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>✕</button>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, position: "relative", zIndex: 1 }}>
                    We noticed your overnight baseline dropped by ~28W this week.
                </p>
                <p style={{ fontSize: 13, color: C.muted, marginBottom: 16, position: "relative", zIndex: 1 }}>
                    Did you replace an appliance or change a setting?
                </p>
                <div style={{ display: "flex", gap: 12, position: "relative", zIndex: 1 }}>
                    <button style={{ flex: 1, background: `${C.blue}10`, color: C.blue, border: `1px solid ${C.blue}30`, padding: "8px 12px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        Yes, log a change
                    </button>
                    <button style={{ flex: 1, background: `${C.borderHi}30`, color: C.muted, border: `1px solid ${C.border}`, padding: "8px 12px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        Dismiss
                    </button>
                </div>
            </div>

            {/* CFH Voucher Card */}
            <div style={{ background: `${C.green}05`, border: `1px solid ${C.green}20`, borderRadius: 24, padding: 20, marginBottom: 24, position: "relative", overflow: "hidden", boxShadow: `0 4px 25px rgba(0,214,143,0.05)` }}>
                <div style={{ position: "absolute", bottom: -10, right: -10, width: 100, height: 100, background: `${C.green}20`, filter: "blur(30px)", borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, position: "relative", zIndex: 1 }}>
                    <span style={{ color: C.green, fontSize: 12 }}>✨</span>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.green, fontFamily: "monospace", textTransform: "uppercase" }}>CFH Voucher Eligible</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 20, position: "relative", zIndex: 1 }}>
                    Your 2014 fridge may qualify for up to $300 in NEA Climate Friendly vouchers
                </p>
                <button style={{ background: C.green, color: "#000", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 900, border: "none", cursor: "pointer", boxShadow: `0 0 15px rgba(0,214,143,0.3)`, position: "relative", zIndex: 1, fontFamily: "inherit" }}>
                    Check eligibility on NEA →
                </button>
            </div>

            {/* Appliance List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                    { Icon: Snowflake, name: "Air Conditioner", label: "High user", labelStyle: { color: C.red, background: `${C.red}10`, border: `1px solid ${C.red}20` }, iconStyle: { background: `${C.red}10`, border: `1px solid ${C.red}30`, color: C.red }, usage: "148 kWh/mo", cost: "$33.26/mo", since: "Since 2018", ticks: 3 },
                    { Icon: ThermometerSnowflake, name: "Refrigerator", label: "CFH eligible", labelStyle: { color: C.green, background: `${C.green}10`, border: `1px solid ${C.green}20` }, iconStyle: { background: `${C.green}10`, border: `1px solid ${C.green}30`, color: C.green }, usage: "42 kWh/mo", cost: "$9.45/mo", since: "Since 2014", ticks: 4 },
                    { Icon: WashingMachine, name: "Tumble Dryer", label: null, labelStyle: {}, iconStyle: { background: `${C.borderHi}30`, border: `1px solid ${C.border}`, color: C.muted }, usage: "28 kWh/mo", cost: "$6.30/mo", since: "Since 2017", ticks: 2 },
                ].map((app, i) => (
                    <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, display: "flex", gap: 16, alignItems: "center" }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...app.iconStyle }}>
                            <app.Icon size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <span style={{ fontWeight: 700, fontSize: 14 }}>{app.name}</span>
                                {app.label && (
                                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, ...app.labelStyle }}>{app.label}</span>
                                )}
                            </div>
                            <div style={{ fontSize: 11, color: C.muted }}>
                                {app.usage} · <span style={{ color: C.text }}>{app.cost}</span> · {app.since}
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
                            <div style={{ display: "flex", gap: 2 }}>
                                {[1, 2, 3, 4, 5].map(t => (
                                    <div key={t} style={{ width: 6, height: 14, borderRadius: 1, background: t <= app.ticks ? C.green : `${C.muted}30` }} />
                                ))}
                            </div>
                            <span style={{ fontSize: 9, fontWeight: 700, color: C.muted, fontFamily: "monospace" }}>{app.ticks}-tick</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
