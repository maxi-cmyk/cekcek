"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Home, Search, Snowflake, ThermometerSnowflake, WashingMachine, X, Tv, Wind, Flame, Zap, Minus } from "lucide-react";
import { useFab } from "../../../components/FabContext";

const C = {
    bg: "#07090f", surface: "#0e1219", border: "#1c2535", borderHi: "#2a3d58",
    green: "#00d68f", red: "#ff4757", blue: "#4a9eff", amber: "#ffb347",
    text: "#eef2f8", muted: "#5a7090", dim: "#28374f",
};
const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

const ICON_OPTIONS = [
    { key: "ac",     label: "Air Conditioner",    Icon: Snowflake,            color: "#ff4757" },
    { key: "fridge", label: "Refrigerator",        Icon: ThermometerSnowflake, color: "#00d68f" },
    { key: "washer", label: "Washing Machine",     Icon: WashingMachine,       color: "#4a9eff" },
    { key: "dryer",  label: "Tumble Dryer",        Icon: WashingMachine,       color: "#5a7090" },
    { key: "tv",     label: "Television",          Icon: Tv,                   color: "#4a9eff" },
    { key: "fan",    label: "Fan",                 Icon: Wind,                 color: "#4a9eff" },
    { key: "heater", label: "Water Heater",        Icon: Flame,                color: "#ffb347" },
    { key: "other",  label: "Other",               Icon: Zap,                  color: "#5a7090" },
];

let _nextId = 4;
function genId() { return `a${_nextId++}`; }

const INITIAL = [
    { id: "a1", type: "ac",     name: "Air Conditioner", usage: "148 kWh/mo", cost: "$33.26/mo", since: "2018", ticks: 3, label: "High user",    labelColor: "#ff4757" },
    { id: "a2", type: "fridge", name: "Refrigerator",    usage: "42 kWh/mo",  cost: "$9.45/mo",  since: "2014", ticks: 4, label: "CFH eligible", labelColor: "#00d68f" },
    { id: "a3", type: "dryer",  name: "Tumble Dryer",    usage: "28 kWh/mo",  cost: "$6.30/mo",  since: "2017", ticks: 2, label: null,           labelColor: null     },
];

// ─── Backdrop ─────────────────────────────────────────────────────────────────
function Backdrop({ onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(3px)",
                zIndex: 100,
            }}
        />
    );
}

// ─── Modal A: add / replace appliance ────────────────────────────────────────
function ModalA({ initial, onConfirm, onCancel, title, confirmLabel }) {
    const [name, setName] = useState(initial?.name ?? "");
    const [type, setType] = useState(initial?.type ?? "ac");
    const [year, setYear] = useState(initial?.since ?? "");
    const [kwh,  setKwh]  = useState(
        initial?.usage && initial.usage !== "—"
            ? initial.usage.replace(" kWh/mo", "")
            : ""
    );

    function submit() {
        if (!name.trim()) return;
        const kwhNum = parseFloat(kwh) || 0;
        onConfirm({
            id:         initial?.id ?? genId(),
            type,
            name:       name.trim(),
            usage:      kwhNum ? `${kwhNum} kWh/mo` : "—",
            cost:       kwhNum ? `$${(kwhNum * 0.2248).toFixed(2)}/mo` : "—",
            since:      year.trim() || "—",
            ticks:      Math.min(5, Math.max(1, Math.round(kwhNum / 40))) || 2,
            label:      initial?.label ?? null,
            labelColor: initial?.labelColor ?? null,
        });
    }

    const inputStyle = {
        width: "100%", background: C.bg,
        border: `1px solid ${C.border}`, borderRadius: 10,
        padding: "10px 12px", color: C.text,
        fontSize: 14, fontFamily: "inherit", outline: "none",
    };

    return (
        <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 101,
            background: C.surface,
            borderRadius: "24px 24px 0 0",
            border: `1px solid ${C.border}`, borderBottom: "none",
            padding: "0 20px 36px",
            animation: "slide-up 0.28s ease",
        }}>
            {/* drag handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 18px" }}>
                <div style={{ width: 36, height: 4, borderRadius: 99, background: C.borderHi }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontWeight: 800, fontSize: 17 }}>{title}</span>
                <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", padding: 4 }}>
                    <X size={20} />
                </button>
            </div>

            {/* Type grid */}
            <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 10, color: C.muted, ...mono, letterSpacing: "0.09em", display: "block", marginBottom: 8 }}>
                    APPLIANCE TYPE
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {ICON_OPTIONS.map(opt => {
                        const active = type === opt.key;
                        const Icon = opt.Icon;
                        return (
                            <button
                                key={opt.key}
                                onClick={() => { setType(opt.key); if (!name.trim()) setName(opt.label); }}
                                style={{
                                    background: active ? `${opt.color}22` : C.bg,
                                    border: `1px solid ${active ? opt.color : C.border}`,
                                    borderRadius: 10, padding: "10px 4px",
                                    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                                    cursor: "pointer", transition: "all 0.15s",
                                }}
                            >
                                <Icon size={16} color={active ? opt.color : C.muted} />
                                <span style={{
                                    fontSize: 8, color: active ? opt.color : C.muted,
                                    fontWeight: 700, textAlign: "center", lineHeight: 1.2,
                                }}>
                                    {opt.label.split(" ").pop()}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Name */}
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, color: C.muted, ...mono, letterSpacing: "0.09em", display: "block", marginBottom: 8 }}>NAME</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={ICON_OPTIONS.find(o => o.key === type)?.label ?? "e.g. Living Room AC"}
                    style={inputStyle}
                />
            </div>

            {/* Year + kWh */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                <div>
                    <label style={{ fontSize: 10, color: C.muted, ...mono, letterSpacing: "0.09em", display: "block", marginBottom: 8 }}>YEAR BOUGHT</label>
                    <input value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 2020" style={inputStyle} type="number" />
                </div>
                <div>
                    <label style={{ fontSize: 10, color: C.muted, ...mono, letterSpacing: "0.09em", display: "block", marginBottom: 8 }}>EST. kWh/MO</label>
                    <input value={kwh} onChange={e => setKwh(e.target.value)} placeholder="e.g. 120" style={inputStyle} type="number" />
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
                <button
                    onClick={onCancel}
                    style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 14, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                >
                    Cancel
                </button>
                <button
                    onClick={submit}
                    disabled={!name.trim()}
                    style={{
                        flex: 2, background: name.trim() ? C.blue : `${C.blue}35`,
                        color: name.trim() ? "#fff" : `${C.blue}70`,
                        border: "none", borderRadius: 14, padding: "13px",
                        fontSize: 14, fontWeight: 800,
                        cursor: name.trim() ? "pointer" : "default",
                        fontFamily: "inherit", transition: "all 0.15s",
                    }}
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    );
}

// ─── Detection choice modal ───────────────────────────────────────────────────
function DetectionChoiceModal({ onRemove, onAdd, onReplace, onClose }) {
    const options = [
        { emoji: "🗑", label: "I removed an appliance", sub: "Remove it from your list", onClick: onRemove },
        { emoji: "➕", label: "I added a new appliance", sub: "Add it to your list",      onClick: onAdd    },
        { emoji: "🔄", label: "I replaced an appliance", sub: "Swap an existing one",     onClick: onReplace },
    ];
    return (
        <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 101,
            background: C.surface, borderRadius: "24px 24px 0 0",
            border: `1px solid ${C.border}`, borderBottom: "none",
            padding: "0 20px 32px",
            animation: "slide-up 0.28s ease",
        }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 18px" }}>
                <div style={{ width: 36, height: 4, borderRadius: 99, background: C.borderHi }} />
            </div>
            <p style={{ fontWeight: 800, fontSize: 17, margin: "0 0 6px" }}>What changed?</p>
            <p style={{ fontSize: 13, color: C.muted, margin: "0 0 20px", lineHeight: 1.5 }}>
                Help us keep your appliance list accurate.
            </p>
            {options.map(opt => (
                <button
                    key={opt.label}
                    onClick={opt.onClick}
                    style={{
                        width: "100%", background: C.bg,
                        border: `1px solid ${C.border}`, borderRadius: 14,
                        padding: "14px 16px", marginBottom: 10,
                        display: "flex", alignItems: "center", gap: 14,
                        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                    }}
                >
                    <span style={{ fontSize: 22 }}>{opt.emoji}</span>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 2 }}>{opt.label}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{opt.sub}</div>
                    </div>
                </button>
            ))}
            <button
                onClick={onClose}
                style={{ width: "100%", background: "none", border: "none", color: C.muted, fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 4, fontFamily: "inherit", padding: "8px" }}
            >
                Cancel
            </button>
        </div>
    );
}

// ─── Replace-select: pick which appliance to replace ─────────────────────────
function ReplaceSelectModal({ appliances, onSelect, onBack }) {
    return (
        <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 101,
            background: C.surface, borderRadius: "24px 24px 0 0",
            border: `1px solid ${C.border}`, borderBottom: "none",
            padding: "0 20px 32px",
            animation: "slide-up 0.28s ease",
        }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 18px" }}>
                <div style={{ width: 36, height: 4, borderRadius: 99, background: C.borderHi }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 18, padding: 0, lineHeight: 1 }}>←</button>
                <span style={{ fontWeight: 800, fontSize: 17 }}>Which was replaced?</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {appliances.map(app => {
                    const opt = ICON_OPTIONS.find(o => o.key === app.type) ?? ICON_OPTIONS[ICON_OPTIONS.length - 1];
                    const Icon = opt.Icon;
                    return (
                        <button
                            key={app.id}
                            onClick={() => onSelect(app)}
                            style={{
                                width: "100%", background: C.bg,
                                border: `1px solid ${C.border}`, borderRadius: 14,
                                padding: "14px 16px",
                                display: "flex", alignItems: "center", gap: 14,
                                cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                            }}
                        >
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${opt.color}18`, border: `1px solid ${opt.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon size={18} color={opt.color} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{app.name}</div>
                                <div style={{ fontSize: 11, color: C.muted }}>Since {app.since}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
            <button
                onClick={onBack}
                style={{ width: "100%", background: "none", border: "none", color: C.muted, fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 12, fontFamily: "inherit", padding: "8px" }}
            >
                Cancel
            </button>
        </div>
    );
}

// ─── Appliance card (swipe-to-delete + iOS delete mode) ───────────────────────
const SNAP = 72;

function ApplianceCard({ app, deleteMode, selected, onToggle, onRemove, swipedId, setSwipedId, shakeDelay }) {
    const startX = useRef(null);
    const isSwiped = !deleteMode && swipedId === app.id;
    const opt = ICON_OPTIONS.find(o => o.key === app.type) ?? ICON_OPTIONS[ICON_OPTIONS.length - 1];
    const Icon = opt.Icon;

    function pointerDown(clientX) {
        if (deleteMode) return;
        startX.current = clientX;
    }

    function pointerUp(clientX) {
        if (deleteMode || startX.current === null) return;
        const delta = clientX - startX.current;
        startX.current = null;
        if (delta < -38) setSwipedId(app.id);
        else if (delta > 10) setSwipedId(null);
    }

    function handleClick() {
        if (deleteMode) { onToggle(app.id); return; }
        if (isSwiped) setSwipedId(null);
    }

    return (
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden" }}>
            {/* Swipe-to-delete button (hidden behind, revealed on swipe) */}
            {!deleteMode && (
                <div style={{
                    position: "absolute", right: 0, top: 0, bottom: 0, width: SNAP,
                    background: C.red,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                    borderRadius: "0 16px 16px 0",
                }}>
                    <button
                        onClick={() => { onRemove(app.id); setSwipedId(null); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: 0 }}
                    >
                        <X size={22} strokeWidth={2.5} />
                        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.05em" }}>REMOVE</span>
                    </button>
                </div>
            )}

            {/* Card face */}
            <div
                onClick={handleClick}
                onMouseDown={e => pointerDown(e.clientX)}
                onMouseUp={e => pointerUp(e.clientX)}
                onTouchStart={e => pointerDown(e.touches[0].clientX)}
                onTouchEnd={e => pointerUp(e.changedTouches[0].clientX)}
                className={deleteMode ? "appliance-shake" : ""}
                style={{
                    background: selected ? `${C.red}18` : C.surface,
                    border: `1px solid ${selected ? C.red + "90" : C.border}`,
                    borderRadius: 16, padding: 16,
                    display: "flex", gap: 14, alignItems: "center",
                    transform: `translateX(${isSwiped ? -SNAP : 0}px)`,
                    transition: "transform 0.22s ease, background 0.15s, border-color 0.15s",
                    cursor: deleteMode ? "pointer" : "default",
                    userSelect: "none", WebkitUserSelect: "none",
                    position: "relative", zIndex: 1,
                    animationDelay: deleteMode ? shakeDelay : "0s",
                }}
            >
                {/* iOS minus indicator */}
                {deleteMode && (
                    <div style={{
                        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                        background: selected ? C.red : "transparent",
                        border: `2px solid ${selected ? C.red : C.muted}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                    }}>
                        {selected && <Minus size={10} color="#fff" strokeWidth={3} />}
                    </div>
                )}

                {/* Icon */}
                <div style={{
                    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${opt.color}18`, border: `1px solid ${opt.color}30`, color: opt.color,
                }}>
                    <Icon size={20} />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{app.name}</span>
                        {app.label && (
                            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, color: app.labelColor, background: `${app.labelColor}10`, border: `1px solid ${app.labelColor}20` }}>
                                {app.label}
                            </span>
                        )}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted }}>
                        {app.usage} · <span style={{ color: C.text }}>{app.cost}</span> · Since {app.since}
                    </div>
                </div>

                {/* Tick bars */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end", flexShrink: 0 }}>
                    <div style={{ display: "flex", gap: 2 }}>
                        {[1, 2, 3, 4, 5].map(t => (
                            <div key={t} style={{ width: 6, height: 14, borderRadius: 1, background: t <= app.ticks ? C.green : `${C.muted}30` }} />
                        ))}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: C.muted, ...mono }}>{app.ticks}-tick</span>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AppliancesPage() {
    const [appliances, setAppliances] = useState(INITIAL);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selected, setSelected] = useState(new Set());
    const [swipedId, setSwipedId] = useState(null);
    const [detectionDismissed, setDetectionDismissed] = useState(false);

    // null | "add" | "detection-choice" | "replace-select" | "replace-add"
    const [modal, setModal] = useState(null);
    const [replaceTarget, setReplaceTarget] = useState(null);

    // Register FAB with MobileShell
    const { setFab } = useFab();
    const openAdd = useCallback(() => setModal("add"), []);
    useEffect(() => {
        if (!deleteMode && modal === null) {
            setFab({ onClick: openAdd });
        } else {
            setFab(null);
        }
        return () => setFab(null);
    }, [deleteMode, modal, openAdd, setFab]);

    function addAppliance(data) {
        setAppliances(prev => [...prev, data]);
        setModal(null);
    }

    function replaceAppliance(data) {
        setAppliances(prev => prev.map(a => a.id === replaceTarget.id ? data : a));
        setReplaceTarget(null);
        setModal(null);
    }

    function removeAppliance(id) {
        setAppliances(prev => prev.filter(a => a.id !== id));
    }

    function toggleSelected(id) {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    function confirmDeleteSelected() {
        setAppliances(prev => prev.filter(a => !selected.has(a.id)));
        setSelected(new Set());
        setDeleteMode(false);
    }

    function cancelDeleteMode() {
        setDeleteMode(false);
        setSelected(new Set());
    }

    function closeModal() {
        setModal(null);
        setReplaceTarget(null);
    }

    const hasModal = modal !== null;

    return (
        <div style={{ padding: "20px", color: C.text, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", position: "relative", minHeight: "100%" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <Home size={24} style={{ color: C.blue }} />
                <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Appliance Intelligence</h1>
            </div>

            {/* Passive Detection Card */}
            {!detectionDismissed && (
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 20, marginBottom: 16, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, right: 0, width: 150, height: 150, background: `${C.blue}10`, filter: "blur(40px)", borderRadius: "50%", pointerEvents: "none" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, position: "relative", zIndex: 1 }}>
                        <Search size={14} style={{ color: C.blue }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.blue, fontFamily: "monospace", textTransform: "uppercase" }}>Passive Detection</span>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, position: "relative", zIndex: 1 }}>
                        We noticed your overnight baseline dropped by ~28W this week.
                    </p>
                    <p style={{ fontSize: 13, color: C.muted, marginBottom: 16, position: "relative", zIndex: 1 }}>
                        Did you replace an appliance or change a setting?
                    </p>
                    <div style={{ display: "flex", gap: 12, position: "relative", zIndex: 1 }}>
                        <button
                            onClick={() => setModal("detection-choice")}
                            style={{ flex: 1, background: `${C.blue}10`, color: C.blue, border: `1px solid ${C.blue}30`, padding: "8px 12px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                        >
                            Yes, log a change
                        </button>
                        <button
                            onClick={() => setDetectionDismissed(true)}
                            style={{ flex: 1, background: `${C.borderHi}30`, color: C.muted, border: `1px solid ${C.border}`, padding: "8px 12px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

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

            {/* Section header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.muted, ...mono }}>YOUR APPLIANCES</span>
                {deleteMode && (
                    <button onClick={cancelDeleteMode} style={{ background: "none", border: "none", color: C.blue, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        Cancel
                    </button>
                )}
            </div>

            {/* Appliance list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {appliances.map((app, i) => (
                    <ApplianceCard
                        key={app.id}
                        app={app}
                        deleteMode={deleteMode}
                        selected={selected.has(app.id)}
                        onToggle={toggleSelected}
                        onRemove={removeAppliance}
                        swipedId={swipedId}
                        setSwipedId={setSwipedId}
                        shakeDelay={`${i * 0.07}s`}
                    />
                ))}
                {appliances.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px 0", color: C.muted, fontSize: 14 }}>
                        No appliances yet.<br />Tap <strong style={{ color: C.text }}>+</strong> to add one.
                    </div>
                )}
            </div>

            {/* Delete mode — sticky confirmation bar */}
            {deleteMode && (
                <div style={{
                    position: "sticky", bottom: 0,
                    background: C.bg, borderTop: `1px solid ${C.border}`,
                    padding: "12px 0 8px",
                    display: "flex", gap: 10,
                }}>
                    <button
                        onClick={cancelDeleteMode}
                        style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 14, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDeleteSelected}
                        disabled={selected.size === 0}
                        style={{
                            flex: 2, background: selected.size > 0 ? C.red : `${C.red}30`,
                            color: selected.size > 0 ? "#fff" : `${C.red}60`,
                            border: "none", borderRadius: 14, padding: "12px",
                            fontSize: 14, fontWeight: 800,
                            cursor: selected.size > 0 ? "pointer" : "default",
                            fontFamily: "inherit", transition: "all 0.2s",
                        }}
                    >
                        {selected.size > 0
                            ? `Delete ${selected.size} appliance${selected.size > 1 ? "s" : ""}`
                            : "Select to delete"}
                    </button>
                </div>
            )}

            {/* ── Modals ── */}
            {hasModal && <Backdrop onClick={closeModal} />}

            {modal === "add" && (
                <ModalA
                    title="Add Appliance"
                    confirmLabel="Add Appliance"
                    onConfirm={addAppliance}
                    onCancel={closeModal}
                />
            )}

            {modal === "detection-choice" && (
                <DetectionChoiceModal
                    onRemove={() => { setModal(null); setDeleteMode(true); }}
                    onAdd={() => setModal("add")}
                    onReplace={() => setModal("replace-select")}
                    onClose={closeModal}
                />
            )}

            {modal === "replace-select" && (
                <ReplaceSelectModal
                    appliances={appliances}
                    onSelect={app => { setReplaceTarget(app); setModal("replace-add"); }}
                    onBack={() => setModal("detection-choice")}
                />
            )}

            {modal === "replace-add" && replaceTarget && (
                <ModalA
                    title={`Replace ${replaceTarget.name}`}
                    confirmLabel="Replace Appliance"
                    initial={replaceTarget}
                    onConfirm={replaceAppliance}
                    onCancel={() => { setModal("replace-select"); setReplaceTarget(null); }}
                />
            )}
        </div>
    );
}
