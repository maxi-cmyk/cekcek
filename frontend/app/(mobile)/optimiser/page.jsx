"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, Leaf, Refrigerator, X } from "lucide-react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

const C = {
    bg: "#07090f",
    surface: "#0e1219",
    green: "#00d68f",
    greenDim: "#00d68f18",
    red: "#ff4757",
    amber: "#ffb347",
    amberLight: "#ffb34722",
    blue: "#4a9eff",
    text: "#eef2f8",
    muted: "#5a7090",
    border: "#1c2535",
    borderLight: "#28374f",
};

function Badge({ type, label }) {
    const styles = {
        high: { background: C.greenDim, color: C.green, border: `1px solid ${C.green}33` },
        behavioural: { background: "#4a9eff15", color: C.blue, border: `1px solid ${C.blue}33` },
        voucher: { background: C.amberLight, color: C.amber, border: `1px solid ${C.amber}55` },
    };
    const s = styles[type] || styles.high;
    return (
        <span style={{
            ...s,
            fontSize: 9, fontWeight: 800, letterSpacing: "0.08em",
            textTransform: "uppercase", padding: "2px 7px", borderRadius: 4,
        }}>
            {label}
        </span>
    );
}

function ActionCard({ badge, badgeType, title, subtitle, buttonLabel, buttonVariant, icon: Icon, onPress }) {
    return (
        <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "16px", marginBottom: 12,
            display: "flex", alignItems: "flex-start", gap: 12,
        }}>
            <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 6 }}>
                    <Badge type={badgeType} label={badge} />
                </div>
                <div style={{ color: C.text, fontWeight: 800, fontSize: 16, marginBottom: 3 }}>{title}</div>
                <div style={{ color: C.muted, fontSize: 12, marginBottom: 14 }}>{subtitle}</div>
                <button
                    onClick={onPress}
                    style={{
                        width: "100%", padding: "10px 0",
                        borderRadius: 10, fontSize: 13, fontWeight: 700,
                        cursor: "pointer",
                        background: buttonVariant === "filled" ? C.green : "transparent",
                        color: buttonVariant === "filled" ? "#07090f" : C.text,
                        border: buttonVariant === "filled" ? "none" : `1.5px solid ${C.border}`,
                        fontFamily: "inherit",
                    }}
                >
                    {buttonLabel}
                </button>
            </div>
            <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: C.greenDim, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <Icon size={24} color={C.green} />
            </div>
        </div>
    );
}

function ReminderModal({ onClose }) {
    const [text, setText] = useState("");
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit() {
        if (!text.trim()) return;
        setSubmitted(true);
    }

    return (
        <div style={{
            position: "absolute", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "flex-end",
        }}>
            <div style={{
                width: "100%", background: C.surface,
                borderRadius: "24px 24px 0 0",
                border: `1px solid ${C.border}`, borderBottom: "none",
                padding: "0 20px 40px",
            }}>
                {/* drag handle */}
                <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 18px" }}>
                    <div style={{ width: 36, height: 4, borderRadius: 99, background: C.borderLight }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <span style={{ fontWeight: 800, fontSize: 17, color: C.text }}>Set a Reminder</span>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", padding: 4 }}>
                        <X size={20} />
                    </button>
                </div>

                {submitted ? (
                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
                        <div style={{ color: C.text, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Reminder set!</div>
                        <div style={{ color: C.muted, fontSize: 12 }}>We'll remind you to shift your dryer to after 11 PM.</div>
                        <button onClick={onClose} style={{ marginTop: 20, background: C.green, color: "#07090f", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ color: C.muted, fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>
                            When would you like to be reminded to run your dryer?
                        </div>
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="e.g. Every weeknight at 11 PM..."
                            rows={3}
                            style={{
                                width: "100%", background: C.bg,
                                border: `1.5px solid ${C.border}`, borderRadius: 10,
                                padding: "10px 14px", color: C.text,
                                fontSize: 13, fontFamily: "inherit", outline: "none",
                                resize: "none", boxSizing: "border-box",
                            }}
                        />
                        <button
                            onClick={handleSubmit}
                            style={{
                                marginTop: 12, width: "100%", padding: "12px 0",
                                background: C.green, color: "#07090f",
                                border: "none", borderRadius: 10,
                                fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                            }}
                        >
                            Set Reminder
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function AnimatedSavingsCard() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    // Counting number for TOU saving: counts up from 142 down to 124
    const count = useMotionValue(0);
    const rounded = useTransform(count, v => `$${Math.round(v)}`);

    useEffect(() => {
        if (!inView) return;
        const controls = animate(count, 124, { duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] });
        return controls.stop;
    }, [inView]);

    return (
        <div ref={ref} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "16px", marginBottom: 16,
        }}>
            <div style={{ color: C.muted, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                Current vs Optimized
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
                <div>
                    <div style={{ color: C.muted, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Flat Rate</div>
                    <div style={{ color: C.text, fontWeight: 800, fontSize: 24 }}>$142<span style={{ fontSize: 13, fontWeight: 600 }}>/mo</span></div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ color: C.muted, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>TOU Saving</div>
                    <div style={{ color: C.green, fontWeight: 800, fontSize: 24 }}>
                        <motion.span style={{ fontVariantNumeric: "tabular-nums" }}>{rounded}</motion.span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>/mo</span>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 1.5, duration: 0.4 }}
                        style={{ color: C.green, fontWeight: 700, fontSize: 11 }}
                    >
                        Save $18/mo
                    </motion.div>
                </div>
            </div>
            {/* Progress bar */}
            <div style={{ background: C.borderLight, borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 10 }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: "87%" } : {}}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        height: "100%", background: C.green,
                        borderRadius: 99, boxShadow: `0 0 6px ${C.green}88`,
                    }}
                />
            </div>
            <div style={{ color: C.muted, fontSize: 10 }}>Based on your last 3 months of consumption patterns.</div>
        </div>
    );
}

export default function OptimiserPage() {
    const router = useRouter();
    const [showReminder, setShowReminder] = useState(false);

    return (
        <div style={{ position: "relative", minHeight: "100%", padding: "16px 16px 0", color: C.text, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
            {showReminder && <ReminderModal onClose={() => setShowReminder(false)} />}

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <Sparkles size={24} style={{ color: C.green }} />
                <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>AI Savings Optimiser</h1>
            </div>

            {/* Current vs Optimized */}
            <AnimatedSavingsCard />

            {/* Recommended Actions */}
            <div style={{ color: C.muted, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                Recommended Actions
            </div>

            <ActionCard
                badge="High Impact"
                badgeType="high"
                title="Enrol in TOU Plan"
                subtitle="Zero effort, +$18/mo savings"
                buttonLabel="Enrol Now"
                buttonVariant="filled"
                icon={Zap}
            />
            <ActionCard
                badge="Behavioural"
                badgeType="behavioural"
                title="Shift Dryer to After 11 PM"
                subtitle="Low effort, +$9/mo savings"
                buttonLabel="Set Reminder"
                buttonVariant="outline"
                icon={Leaf}
                onPress={() => setShowReminder(true)}
            />
            <ActionCard
                badge="Voucher Eligible"
                badgeType="voucher"
                title="Upgrade 2009 Fridge to 4-Tick"
                subtitle="Eligible for CFH voucher, +$14/mo savings"
                buttonLabel="Check Voucher"
                buttonVariant="outline"
                icon={Refrigerator}
                onPress={() => router.push("/forest")}
            />


        </div>
    );
}
