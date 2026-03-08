"use client";

"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, Zap, TreePine, Smartphone, Plus, Sparkles } from "lucide-react";
import { FabProvider, useFab } from "./FabContext";

const navItems = [
    { id: "dashboard", href: "/dashboard", icon: Home, label: "Home" },
    { id: "grid", href: "/grid", icon: Zap, label: "Grid" },
    { id: "forest", href: "/forest", icon: TreePine, label: "Forest" },
    { id: "appliances", href: "/appliances", icon: Smartphone, label: "Devices" },
    { id: "optimiser", href: "/optimiser", icon: Sparkles, label: "Savings" },
];

function PhoneFrame({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { fab } = useFab();

    return (
        <div style={{
            width: "100%", maxWidth: 414,
            height: 896,
            background: "#07090f",
            borderRadius: 50,
            border: "2px solid #1a2535",
            boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px #0a0f1a, inset 0 1px 0 #1e2d45",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            transform: "translateZ(0)",
        }}>
            {/* Status bar */}
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 22px 6px",
            }}>
                <span style={{ color: "#eef2f8", fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>9:41</span>
                <div style={{ display: "flex", gap: 4 }}>
                    <span style={{ fontSize: 12 }}>📶</span>
                    <span style={{ fontSize: 12 }}>🔋</span>
                </div>
            </div>

            {/* Scrollable content */}
            <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", paddingBottom: 84 }}>
                {children}
            </div>

            {/* Floating Action Button — inside phone frame, above nav */}
            {fab && (
                <button
                    key="fab"
                    onClick={fab.onClick}
                    className="fab-pop"
                    style={{
                        position: "absolute",
                        bottom: 96,
                        right: 20,
                        width: 52, height: 52,
                        borderRadius: "50%",
                        background: "#00d68f",
                        border: "none",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 20px rgba(0,214,143,0.5), 0 0 0 1px rgba(0,214,143,0.2)",
                        color: "#fff",
                        zIndex: 200,
                    }}
                >
                    <Plus size={24} strokeWidth={2.5} />
                </button>
            )}

            {/* Bottom Nav */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: 84,
                background: "rgba(7,9,15,0.95)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid #1c2535",
                display: "flex", justifyContent: "space-around", alignItems: "center",
                padding: "12px 8px 20px",
                zIndex: 50,
            }}>
                {navItems.map((item) => {
                    const active = pathname?.startsWith(item.href);
                    return (
                        <button
                            key={item.id}
                            onClick={() => router.push(item.href)}
                            style={{
                                display: "flex", flexDirection: "column", alignItems: "center",
                                gap: 6, minWidth: 64,
                                color: active ? "#00d68f" : "#5a7090",
                                background: "none", border: "none", cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            <div style={{ position: "relative" }}>
                                <item.icon size={24} strokeWidth={active ? 2.5 : 2} />
                                {active && (
                                    <div style={{
                                        position: "absolute", inset: 0,
                                        background: "rgba(0,214,143,0.4)",
                                        filter: "blur(8px)", borderRadius: "50%",
                                    }} />
                                )}
                            </div>
                            <span style={{
                                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                borderBottom: active ? "3px solid #00d68f" : "none",
                                paddingBottom: active ? 2 : 0,
                            }}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function MobileShell({ children }) {
    return (
        <FabProvider>
            <div className="min-h-screen bg-[#04060c] flex items-center justify-center p-6"
                style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
                <PhoneFrame>
                    {children}
                </PhoneFrame>
            </div>
        </FabProvider>
    );
}
