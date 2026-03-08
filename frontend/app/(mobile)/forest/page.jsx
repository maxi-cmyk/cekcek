"use client";

import { useState, useEffect, useRef } from "react";
import { TreePine, Lock } from "lucide-react";
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

const REDEMPTIONS = [
    { user: "GreenPulse88",   action: "redeemed 200 pts",  reward: "$2 FairPrice voucher",  icon: "🛒" },
    { user: "EcoWatcher",     action: "planted a new tree", reward: "5-day streak bonus",    icon: "🌳" },
    { user: "NightOwl_SG",    action: "redeemed 500 pts",  reward: "free kopi at Toast Box", icon: "☕" },
    { user: "SolarMei",       action: "earned 3 tokens",   reward: "off-peak champion",      icon: "⚡" },
    { user: "ThriftGrid",     action: "redeemed 150 pts",  reward: "$1.50 bus credit",       icon: "🚌" },
    { user: "CoolAuntie99",   action: "unlocked badge",    reward: "10-day streak",          icon: "🔥" },
    { user: "GridHero_Raj",   action: "redeemed 300 pts",  reward: "$3 Grab voucher",        icon: "🚗" },
    { user: "PeakShifter",    action: "earned 5 tokens",   reward: "weekend saver bonus",    icon: "🌙" },
    { user: "LowWattLim",     action: "redeemed 100 pts",  reward: "community tree planted", icon: "🌿" },
    { user: "VoltVicky",      action: "hit 30-day streak", reward: "Silver Saver badge",     icon: "🥈" },
];

const VOUCHERS = [
    { id: "v1", pts: 100,  icon: "☕", title: "Free Kopi",          desc: "Any kopi at Toast Box",          code: "TOAST-ECO-4821",  color: "#ffb347" },
    { id: "v2", pts: 200,  icon: "🛒", title: "$2 FairPrice",        desc: "FairPrice supermarket voucher",   code: "FP-GRN-7734",     color: "#00d68f" },
    { id: "v3", pts: 350,  icon: "🚌", title: "$3 Bus Credit",       desc: "Top-up on SimplyGo card",         code: "BUS-ECO-2290",    color: "#4a9eff" },
    { id: "v4", pts: 500,  icon: "🍜", title: "Free Hawker Meal",    desc: "Any stall at selected hawker centres", code: "HAWK-NRG-5512", color: "#ff6b9d" },
    { id: "v5", pts: 750,  icon: "🚗", title: "$5 Grab Voucher",     desc: "GrabFood or GrabCar rides",       code: "GRAB-SP-8801",    color: "#00d68f" },
    { id: "v6", pts: 1000, icon: "⚡", title: "$10 Bill Credit",     desc: "Applied to your SP Group bill",   code: "SP-ECO-1000X",    color: "#ffb347" },
    { id: "v7", pts: 1500, icon: "🌳", title: "Real Tree Planted",   desc: "1 tree planted in your name in SG", code: "TREE-SG-0042",  color: "#00d68f" },
    { id: "v8", pts: 2000, icon: "🥇", title: "Gold Saver Badge",    desc: "Exclusive profile badge + 200 bonus pts", code: "GOLD-ECO-2K", color: "#ffb347" },
];

const DEMO_GAM = {
    tree_status: "Healthy",
    points: 350,
    streak_days: 7,
    next_reward: "150 pts to unlock $3 Bus Credit",
    leaderboard: [
        { alias: "GreenPulse88", points: 1240 },
        { alias: "EcoWatcher",   points: 980  },
        { alias: "You",          points: 350  },
    ],
};

const CONFETTI_COLORS = ["#00d68f", "#ffb347", "#4a9eff", "#ff4757", "#ff6b9d", "#fff"];

function ConfettiDot({ color, tx, ty, tr, delay }) {
    return (
        <div className="confetti-dot" style={{
            background: color,
            "--tx": tx, "--ty": ty, "--tr": tr,
            animationDelay: delay,
            left: "50%", top: "50%",
            marginLeft: -3.5, marginTop: -3.5,
        }} />
    );
}

function VoucherCard({ voucher, unlocked, opened, onOpen }) {
    const [celebrating, setCelebrating] = useState(false);
    const [confetti, setConfetti] = useState([]);
    const cardRef = useRef(null);

    function handleClick() {
        if (!unlocked || opened) return;
        // Generate confetti
        const dots = Array.from({ length: 18 }, (_, i) => ({
            id: i,
            color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            tx: `${(Math.random() - 0.5) * 140}px`,
            ty: `${-(Math.random() * 100 + 40)}px`,
            tr: `${(Math.random() - 0.5) * 360}deg`,
            delay: `${Math.random() * 0.15}s`,
        }));
        setConfetti(dots);
        setCelebrating(true);
        onOpen(voucher.id);
        setTimeout(() => { setCelebrating(false); setConfetti([]); }, 1000);
    }

    const locked = !unlocked;
    const bg = locked ? C.bg : opened ? `${C.green}12` : `${voucher.color}18`;
    const borderColor = locked ? C.border : opened ? `${C.green}40` : `${voucher.color}50`;

    return (
        <div ref={cardRef} onClick={handleClick} style={{
            position: "relative", overflow: "hidden",
            background: bg,
            border: `1px solid ${borderColor}`,
            borderRadius: 16,
            padding: "14px 16px",
            opacity: locked ? 0.45 : 1,
            cursor: unlocked && !opened ? "pointer" : "default",
            transition: "opacity 0.3s, transform 0.15s",
            filter: locked ? "grayscale(0.6)" : "none",
        }}>
            {/* celebrate ring */}
            {celebrating && <div className="celebrate-ring" />}
            {/* confetti */}
            {confetti.map(d => <ConfettiDot key={d.id} {...d} />)}

            <div className={celebrating ? "voucher-reveal" : ""} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* icon */}
                <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: locked ? `${C.muted}20` : `${voucher.color}20`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                }}>
                    {locked ? <Lock size={18} style={{ color: C.muted }} /> : voucher.icon}
                </div>

                {/* text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: locked ? C.muted : C.text, marginBottom: 2 }}>
                        {voucher.title}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {locked ? `Unlock at ${voucher.pts} pts` : voucher.desc}
                    </div>
                    {opened && (
                        <div style={{ marginTop: 6, background: `${voucher.color}15`, border: `1px dashed ${voucher.color}50`, borderRadius: 6, padding: "3px 8px", display: "inline-block" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: voucher.color, ...mono }}>{voucher.code}</span>
                        </div>
                    )}
                </div>

                {/* right badge */}
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                    {locked ? (
                        <div style={{ fontSize: 11, color: C.muted, ...mono }}>{voucher.pts} pts</div>
                    ) : opened ? (
                        <div style={{
                            background: `${C.green}20`, border: `1px solid ${C.green}50`,
                            color: C.green, borderRadius: 8, padding: "4px 10px",
                            fontSize: 11, fontWeight: 700,
                        }}>Redeemed</div>
                    ) : (
                        <div style={{
                            background: `${voucher.color}20`, border: `1px solid ${voucher.color}40`,
                            color: voucher.color, borderRadius: 8, padding: "4px 10px",
                            fontSize: 11, fontWeight: 700,
                        }}>
                            Tap to open
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function RedemptionTicker() {
    // Duplicate items so the seamless loop works
    const items = [...REDEMPTIONS, ...REDEMPTIONS];
    return (
        <div style={{
            overflow: "hidden",
            background: "#0a0f18",
            border: `1px solid #1c2535`,
            borderRadius: 12,
            marginBottom: 20,
            padding: "8px 0",
            position: "relative",
        }}>
            {/* left fade */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 32, background: "linear-gradient(to right, #0a0f18, transparent)", zIndex: 2, pointerEvents: "none" }} />
            {/* right fade */}
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 32, background: "linear-gradient(to left, #0a0f18, transparent)", zIndex: 2, pointerEvents: "none" }} />

            <div className="ticker-track">
                {items.map((r, i) => (
                    <div key={i} style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "0 24px",
                        whiteSpace: "nowrap",
                        fontSize: 12,
                        borderRight: "1px solid #1c2535",
                    }}>
                        <span>{r.icon}</span>
                        <span style={{ color: "#00d68f", fontWeight: 700 }}>{r.user}</span>
                        <span style={{ color: "#5a7090" }}>{r.action} —</span>
                        <span style={{ color: "#eef2f8" }}>{r.reward}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ForestPage() {
    const [gam, setGam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openedVouchers, setOpenedVouchers] = useState({});

    useEffect(() => {
        const t = setTimeout(() => {
            setGam(DEMO_GAM);
            setLoading(false);
        }, 2000);
        try {
            const saved = JSON.parse(localStorage.getItem("opened_vouchers") || "{}");
            setOpenedVouchers(saved);
        } catch {}
        return () => clearTimeout(t);
    }, []);

    function handleOpenVoucher(id) {
        setOpenedVouchers(prev => {
            const next = { ...prev, [id]: true };
            try { localStorage.setItem("opened_vouchers", JSON.stringify(next)); } catch {}
            return next;
        });
    }

    const treeStatus = gam?.tree_status ?? "Healthy";
    const treeEmoji = TREE_EMOJI[treeStatus] ?? "🌳";
    const progress = TREE_PROGRESS[treeStatus] ?? 50;
    const points = gam?.points ?? 0;
    const streak = gam?.streak_days ?? 0;
    const leaderboard = gam?.leaderboard ?? [];
    const nextReward = gam?.next_reward ?? "—";

    return (
        <div style={{ padding: "20px", color: C.text, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <TreePine size={24} style={{ color: C.green }} />
                <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Your Forest</h1>
            </div>

            {/* Community Redemption Ticker */}
            <RedemptionTicker />

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

            {/* Vouchers */}
            <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.muted, ...mono, marginBottom: 12, paddingLeft: 4 }}>
                    REDEEM VOUCHERS
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {VOUCHERS.map(v => (
                        <VoucherCard
                            key={v.id}
                            voucher={v}
                            unlocked={points >= v.pts}
                            opened={!!openedVouchers[v.id]}
                            onOpen={handleOpenVoucher}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
