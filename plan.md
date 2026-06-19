# Plan: Link MT5 Accounts (Real & Demo)

Allow users to securely link their MetaTrader 5 (MT5) real and demo accounts to the dashboard for real-time tracking and trade execution.

## Scope & Non-Goals
- **In-scope:**
  - Database schema for MT5 accounts (login, server, type, encrypted password placeholder).
  - UI for account management (listing, adding, deleting accounts).
  - Mock integration layer (Edge Function stubs) for MT5 connectivity.
  - State management to toggle between active accounts in the dashboard.
- **Non-goals:**
  - Real MT5 binary protocol implementation (requires external middleware/bridge).
  - Multi-user authentication (assuming a single-user dashboard for this phase, but built with `user_id` for future-proofing).

## Auth & RLS model
**Auth in scope:** no
**Model:** no_auth_public_read
**RLS strategy:** All users can read/write for now (demo mode).
**Frontend implication:** Toasts for connection status; simple dropdown to switch "active" MT5 account.

## Migration baseline
**Local migrations in project:** none
**User confirmed proceed on connected DB:** yes

## Affected Areas
- **Database:** New `mt5_accounts` table.
- **Frontend:**
  - `src/components/views/SettingsView.tsx` (new) - Manage accounts.
  - `src/components/Dashboard.tsx` - Sidebar update and account switcher.
  - `src/hooks/useMT5.ts` (new) - Hook for account management and simulated balance/equity updates.

## Phases

### Phase 1: Database Schema (supabase_engineer)
- Create `mt5_accounts` table: `id`, `account_login` (text), `account_server` (text), `account_password` (text), `account_type` (demo/real), `balance` (numeric), `equity` (numeric), `is_active` (boolean).
- Enable RLS and add public policies for CRUD.

### Phase 2: MT5 Management UI (frontend_engineer)
- Create `src/components/views/SettingsView.tsx`.
- Implement form to add MT5 account (Login, Password, Server, Type).
- Implement list of connected accounts with "Delete" and "Set Active" actions.
- Update `Dashboard.tsx` to include "Settings" in the sidebar navigation.

### Phase 3: Integration Hook (frontend_engineer)
- Create `src/hooks/useMT5.ts` to fetch and manage MT5 accounts from Supabase.
- Integrate with `Dashboard.tsx` to show current active account balance/equity.

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. supabase_engineer — Create account management schema.
2. frontend_engineer — Build UI and integration hooks.

**Per-agent instructions:**
### 1. supabase_engineer
- **Phases:** Phase 1
- **Scope:** Create `mt5_accounts` table.
- **Files:** `supabase/migrations/20240619000000_mt5_accounts.sql`
- **Depends on:** none
- **Acceptance criteria:** Table exists with necessary columns. RLS allows public access.

### 2. frontend_engineer
- **Phases:** Phase 2, Phase 3
- **Scope:** Build account management UI and hook. Run `bun add @supabase/supabase-js`.
- **Files:** `src/components/views/SettingsView.tsx`, `src/hooks/useMT5.ts`, `src/components/Dashboard.tsx`.
- **Depends on:** supabase_engineer
- **Acceptance criteria:** User can add a demo/real account and see it in the terminal dashboard.

IS_SUPABASE_REQUIRED: false
