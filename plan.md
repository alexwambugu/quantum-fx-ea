# Implementation Plan - Advanced Forex Trading Signal System (Web Dashboard)

This project involves building a professional, high-fidelity React-based Forex Trading Dashboard. It will visualize an "Advanced Forex Buy & Sell Signal System" by simulating real-time market data, trend analysis, and signal generation based on specific technical criteria (EMA crosses, RSI, MACD, Volume, and Market Structure).

## Scope Summary
- **Professional Trading UI:** Dark-mode dashboard with a professional "Quant" aesthetic.
- **Smart Trend Detection:** Dynamic calculation and visualization of EMA (50, 200, 800) relationships.
- **Signal Engine (Simulated):** Core logic implementation for high-probability BUY/SELL signals based on 7+ confirmation criteria.
- **SMC Visuals:** Identification and display of Smart Money Concepts like Order Blocks, FVG, and BOS on a live chart.
- **Multi-Timeframe Analysis:** Dashboard panel showing confluence across timeframes from M1 to Daily.
- **AI Confidence Score:** Real-time signal strength meter.
- **Risk Management & Utilities:** Interactive lot size calculator, global session clocks, and an economic calendar news filter.

## Non-Goals
- **Live MT5 Integration:** No direct bridge to a local MT5 terminal (out of scope for web).
- **Real Broker Execution:** No actual financial transactions; simulated execution only.
- **Persistent Backend:** No user accounts or remote database (Session-based/LocalStorage only).

## Assumptions
- The application will utilize a simulated price feed (random walk with bias) to drive the indicators.
- `lightweight-charts` will be used for professional-grade technical visualization.

## Affected Areas
- **Frontend Components:** Dashboard layout, Trading Chart (SMC/Indicators), Signal Cards, Risk Calculator, News Feed.
- **State Management:** Custom hooks for data simulation and technical indicator processing.

## Ordered Phases

### Phase 1: Core Dashboard Shell & Theme
- **Deliverables:** Main dark-mode layout, sidebar navigation, and header with trading session clocks.
- **Owner:** frontend_engineer
- **Dependencies:** None

### Phase 2: Signal Engine & Data Simulation
- **Deliverables:** `useSignalEngine` hook for tick generation and technical indicator math (EMA, RSI, MACD).
- **Owner:** frontend_engineer
- **Dependencies:** Phase 1

### Phase 3: SMC Charting & Visualization
- **Deliverables:** Integrated chart with EMA overlays and SMC detection markers (Order Blocks, FVG).
- **Owner:** frontend_engineer
- **Dependencies:** Phase 2

### Phase 4: Signal UI & Confluence Panels
- **Deliverables:** Signal alert cards (Entry/SL/TP) and Multi-Timeframe status grid.
- **Owner:** frontend_engineer
- **Dependencies:** Phase 2

### Phase 5: Risk Management & News Filter
- **Deliverables:** Lot size calculator and simulated economic calendar with "Trade Blocked" logic.
- **Owner:** quick_fix_engineer
- **Dependencies:** Phase 1

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Setup layout, engine, chart, and signal UI.
2. quick_fix_engineer — Implement calculators, session clocks, and news filters.

**Per-agent instructions:**

### 1. frontend_engineer
- **Phases:** 1, 2, 3, 4
- **Scope:** 
    - Build the `useSignalEngine` hook to simulate EURUSD data and calculate EMA 50/200/800, RSI, and MACD.
    - Implement the exact Buy/Sell logic provided (7 criteria for Buy, 7 for Sell).
    - Use `lightweight-charts` for the main price visualization with EMA lines.
    - Implement the "SMC" visual markers (Rectangles for Order Blocks/FVG).
    - Create the Signal cards showing Confidence, Entry, SL, and TPs.
- **Files:** `src/hooks/useSignalEngine.ts`, `src/components/TradingChart.tsx`, `src/components/SignalCard.tsx`, `src/components/Dashboard.tsx`
- **Acceptance criteria:** Signal cards appear ONLY when all conditions are met. Chart reflects simulated price movement in real-time.

### 2. quick_fix_engineer
- **Phases:** 5
- **Scope:** 
    - Create a `RiskCalculator` component (inputs: Balance, Risk %, SL pips -> output: Lot Size).
    - Create a `SessionClock` component showing Sydney, Tokyo, London, NY status based on UTC.
    - Create a `NewsFilter` component that blocks trading (visual flag) during simulated high-impact events.
- **Files:** `src/components/RiskCalculator.tsx`, `src/components/NewsFilter.tsx`, `src/components/SessionClock.tsx`
- **Depends on:** frontend_engineer (integration into Dashboard)
- **Acceptance criteria:** Risk calculator uses correct forex lot formulas. News filter correctly flags "Trade Blocked" based on simulated event times.
