const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function get(path) {
    const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
    return res.json();
}

export function fetchInsights() {
    return get("/api/insights/");
}

export function fetchSpike() {
    return get("/api/spike/");
}

export function fetchGrid() {
    return get("/api/grid/");
}

export function fetchAppliances() {
    return get("/api/appliances/");
}

export function fetchGamification() {
    return get("/api/gamification/");
}

export function fetchForecast() {
    return get("/api/forecast/");
}

export function fetchOptimiser() {
    return get("/api/optimiser/");
}
