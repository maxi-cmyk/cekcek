#!/bin/bash
# SP Energy Pulse — Live Demo Launcher
# Usage: bash demo.sh

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "  ╔══════════════════════════════════════╗"
echo "  ║     SP Energy Pulse — Demo Setup     ║"
echo "  ╚══════════════════════════════════════╝"
echo -e "${NC}"

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# ── 1. Check .env ────────────────────────────────────────────────────────────
echo -e "${YELLOW}[1/4] Checking .env...${NC}"
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo "  ✗  backend/.env not found."
    echo "     Create it with:"
    echo "       OPENAI_API_KEY=..."
    echo "       CLICKHOUSE_HOST=..."
    echo "       CLICKHOUSE_USER=..."
    echo "       CLICKHOUSE_PASSWORD=..."
    exit 1
fi
echo -e "  ${GREEN}✓  .env found${NC}"

# ── 2. Install dependencies ───────────────────────────────────────────────────
echo -e "${YELLOW}[2/4] Installing dependencies...${NC}"

pip install -r "$BACKEND_DIR/requirements.txt" -q
echo -e "  ${GREEN}✓  Python dependencies installed${NC}"

cd "$FRONTEND_DIR" && npm install --silent
echo -e "  ${GREEN}✓  Node dependencies installed${NC}"

# ── 3. Seed demo data ─────────────────────────────────────────────────────────
echo -e "${YELLOW}[3/4] Seeding demo data...${NC}"
cd "$BACKEND_DIR" && python data/seed.py
echo -e "  ${GREEN}✓  Demo state reset${NC}"

# ── 4. Start servers ──────────────────────────────────────────────────────────
echo -e "${YELLOW}[4/4] Starting servers...${NC}"

# Backend
cd "$BACKEND_DIR"
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
echo -e "  ${GREEN}✓  Backend running  →  http://localhost:8000  (PID $BACKEND_PID)${NC}"

# Frontend
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

sleep 4

echo ""
echo -e "${GREEN}"
echo "  ╔══════════════════════════════════════╗"
echo "  ║        Demo is live!                 ║"
echo "  ║                                      ║"
echo "  ║   Frontend  →  http://localhost:3000 ║"
echo "  ║   Backend   →  http://localhost:8000 ║"
echo "  ║                                      ║"
echo "  ║   Press Ctrl+C to stop both servers  ║"
echo "  ╚══════════════════════════════════════╝"
echo -e "${NC}"

# Open browser (works on Windows/Mac/Linux)
if command -v start &>/dev/null; then
    start http://localhost:3000
elif command -v open &>/dev/null; then
    open http://localhost:3000
elif command -v xdg-open &>/dev/null; then
    xdg-open http://localhost:3000
fi

# Wait and clean up on Ctrl+C
trap "echo ''; echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
