# Campus ERP — Project Documentation

A school/campus management system built on the **Frappe Framework**, using the **Education** app as a base, with a custom Frappe app (`campus_erp`) for school-specific business logic and a standalone **Next.js** frontend (`esti_erp_frontend`).

---

## 1. Overview

| | |
|---|---|
| **Framework** | Frappe v15.117.0 (bench) |
| **Base ERP modules** | ERPNext v15.119.0, Education v17.0.0-dev, HRMS v17.0.0-dev |
| **Custom backend app** | `campus_erp` |
| **Custom frontend** | `esti_erp_frontend` (Next.js 16, React 19) |
| **Default site** | `education.localhost` |
| **Bench root** | `~/frappe-bench` |
| **OS** | Ubuntu (WSL — `DESKTOP-NFC6MFG`) |

**Architecture in one line:** Frappe/ERPNext/Education/HRMS provide the core ERP + database + REST API layer; `campus_erp` extends them with school-specific DocTypes and APIs; `esti_erp_frontend` is a separate Next.js app that talks to the Frappe backend as an API client (not a Frappe "app" served by the framework's own UI).

---

## 2. Project (Bench) File Structure

```
frappe-bench/
├── Procfile                  # Process definitions (web, worker, redis, socketio, watch, scheduler)
├── apps/                     # All installed Frappe apps live here
│   ├── frappe/                # Frappe Framework core (v15.117.0)
│   ├── erpnext/                # ERPNext core ERP app (v15.119.0)
│   ├── education/              # Education domain app (v17.0.0-dev)
│   ├── hrms/                   # HR Management app (v17.0.0-dev)
│   ├── campus_erp/             # ⭐ Custom app — school-specific logic
│   └── esti_erp_frontend/      # ⭐ Custom Next.js frontend (separate from Frappe apps dir by convention, but co-located here)
├── config/                   # Redis configs, PIDs, supervisor/scheduler process files
├── env/                      # Python virtualenv (Python 3.12) for the bench
├── logs/                     # bench.log, database.log(.N), worker logs, scheduler.log, backup.log
├── sites/                    # Site data
│   ├── apps.txt               # List of installed apps
│   ├── apps.json               # App versions + git resolution (branch/commit)
│   ├── common_site_config.json # Shared bench-wide config (ports, redis, workers)
│   ├── assets/                  # Compiled/bundled frontend assets per app
│   └── education.localhost/     # The actual site: private files, public files, logs, config
├── package.json              # Root-level JS deps (React Query, React Hook Form, Sonner, TS)
└── node_modules/
```

---

## 3. Installed Frappe Apps (`sites/apps.txt`)

1. **frappe** — v15.117.0 — core framework (ORM, REST API, auth, UI framework, job queue)
2. **erpnext** — v15.119.0 — general ERP (accounting, stock, assets, purchasing)
3. **education** — v17.0.0-dev — student/curriculum management base
4. **hrms** — v17.0.0-dev — HR & payroll base
5. **campus_erp** — custom — school-specific extensions (see §4)

---

## 4. Custom App: `campus_erp`

**Purpose:** Custom Frappe app built for a school management system migration, extending Education/ERPNext with campus-specific modules.

**Location:** `apps/campus_erp/campus_erp/`

### 4.1 Module Structure

```
campus_erp/
├── hooks.py                  # App hooks (events, overrides, fixtures, etc.)
├── modules.txt
├── patches.txt / patches/    # Data migration patches
├── setup/
│   ├── custom_fields.py         # Custom field definitions
│   └── custom_fields_finance.py
├── api/                       # Custom REST endpoints
│   ├── auth.py
│   ├── finance_billing.py
│   ├── finance_purchasing.py
│   └── registrar.py
├── administration/            # Module: Administration
│   └── doctype/ → sms_code, sms_statutory_contribution_bracket
├── asset/                     # Module: Asset management
├── finance_billing/           # Module: Billing / Finance
│   └── doctype/ → sms_discount, sms_past_receivable, sms_student_assessment,
│                   sms_student_assessment_detail, sms_wallet_account, sms_wallet_transaction
├── finance_purchasing/        # Module: Purchasing
│   └── doctype/ → sms_canteen_pcv, sms_canteen_pcv_detail
├── library/                   # Module: Library (doctypes not yet listed)
├── personnel/                 # Module: Personnel/HR
│   └── doctype/ → personnel_info
├── registrar/                 # Module: Registrar (largest module)
│   └── doctype/ → sms_certificate_of_enrollment, sms_certificate_of_grades, sms_cogmc,
│                   sms_credential, sms_credit, sms_curriculum, sms_curriculum_subject,
│                   sms_diploma_issuance, sms_grading_period, sms_graduation_batch,
│                   sms_graduation_candidate, sms_honorable_dismissal, sms_id_card_batch,
│                   sms_id_card_batch_student, sms_permit, sms_permit_subject,
│                   sms_report_signatory, sms_service_request, sms_student_credential,
│                   sms_student_rfid_tag, sms_transcript, sms_transcript_detail,
│                   sms_transfer_credential, sms_transfer_credential_student,
│                   sms_transferee_grade
└── templates/pages/           # Web page templates (Jinja/Frappe portal pages)
```

> Naming convention: most DocTypes are prefixed `sms_` (Student Management System), grouped by business module.

### 4.2 Modules Summary

| Module | Responsibility | Key DocTypes |
|---|---|---|
| **Administration** | System-level config (codes, contribution brackets) | `sms_code`, `sms_statutory_contribution_bracket` |
| **Asset** | Asset tracking | (doctype folder present, no entries listed yet) |
| **Finance – Billing** | Student billing, discounts, wallets, assessments | `sms_discount`, `sms_past_receivable`, `sms_student_assessment(_detail)`, `sms_wallet_account`, `sms_wallet_transaction` |
| **Finance – Purchasing** | Canteen/purchase cash vouchers | `sms_canteen_pcv`, `sms_canteen_pcv_detail` |
| **Library** | Library management | (doctype folder present) |
| **Personnel** | Staff/employee info | `personnel_info` |
| **Registrar** | Enrollment, curriculum, credentials, grading, graduation | 20+ doctypes — see §4.1 |

### 4.3 API Layer (`campus_erp/api/`)

Custom whitelisted endpoints consumed by the Next.js frontend:
- `auth.py` — authentication (login, session handling)
- `finance_billing.py` — billing/wallet/assessment endpoints
- `finance_purchasing.py` — purchasing/PCV endpoints
- `registrar.py` — enrollment/curriculum/student record endpoints

### 4.4 Install / Contribute

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch develop
bench install-app campus_erp
```

Uses `pre-commit` (ruff, eslint, prettier, pyupgrade) for linting/formatting:
```bash
cd apps/campus_erp
pre-commit install
```

License: MIT

---

## 5. Frontend: `esti_erp_frontend`

**Purpose:** Standalone Next.js web client for Campus ERP (package name: `campus_erp_frontend`), consuming the Frappe backend as an API.

**Stack:** Next.js 16.3.1 · React 19.2.8 · TypeScript 5 · Tailwind CSS 4 · React Hook Form + Zod · TanStack React Query · Axios · shadcn/ui (Radix + Base UI primitives) · Sonner (toasts)

### 5.1 Structure

```
esti_erp_frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (app)/                     # Authenticated app route group
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── administration/page.tsx
│   │   │   ├── asset/page.tsx
│   │   │   ├── finance/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── assessments/
│   │   │   │   ├── discounts/
│   │   │   │   └── wallets/
│   │   │   ├── library/page.tsx
│   │   │   ├── personnel/
│   │   │   │   ├── page.tsx
│   │   │   │   └── employees/
│   │   │   └── registrar/
│   │   │       ├── page.tsx
│   │   │       ├── curriculum/
│   │   │       ├── enrollment/
│   │   │       ├── permits/
│   │   │       └── students/
│   │   ├── login/page.tsx
│   │   ├── portal/                    # Separate portal route group
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/page.tsx
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Root page
│   │   └── globals.css
│   ├── components/
│   │   ├── login-form.tsx
│   │   ├── sms/                       # Domain-specific reusable components
│   │   │   ├── ChildTableGrid.tsx        # Renders Frappe child-table data
│   │   │   ├── DialogScreen.tsx
│   │   │   ├── DynamicField.tsx          # Renders a field based on DocType metadata
│   │   │   ├── EntryListScreen.tsx       # List view for a DocType
│   │   │   ├── EntryScreen.tsx           # Create/edit view for a DocType
│   │   │   ├── MasterDetailScreen.tsx
│   │   │   ├── PhotoUploadField.tsx
│   │   │   ├── RecordDetailView.tsx
│   │   │   ├── ReportScreen.tsx
│   │   │   └── WizardFormLayout.tsx      # Multi-step form layout
│   │   └── ui/                        # shadcn/ui primitives (button, dialog, form, table, etc.)
│   ├── lib/
│   │   ├── frappe.ts                  # Frappe API client (likely Axios wrapper for REST calls)
│   │   ├── utils.ts
│   │   └── forms/                     # Form schemas/config per module
│   │       ├── finance.ts
│   │       ├── personnel.ts
│   │       ├── registrar.ts
│   │       └── types.ts
│   └── providers/
│       ├── AuthProvider.tsx           # Auth/session context
│       └── QueryProvider.tsx          # TanStack Query provider
├── public/
├── package.json
└── tsconfig.json / next.config.ts / eslint.config.mjs / components.json (shadcn config)
```

### 5.2 Route Map

| Route group | Routes | Purpose |
|---|---|---|
| `(app)` | `/dashboard`, `/administration`, `/asset`, `/finance`, `/finance/assessments`, `/finance/discounts`, `/finance/wallets`, `/library`, `/personnel`, `/personnel/employees`, `/registrar`, `/registrar/curriculum`, `/registrar/enrollment`, `/registrar/permits`, `/registrar/students` | Main authenticated back-office app, mirrors `campus_erp` modules 1:1 |
| `portal` | `/portal/dashboard` | Separate-layout portal (likely student/parent-facing) |
| root | `/`, `/login` | Landing + auth |

### 5.3 Key Reusable Components (`components/sms/`)

These form a generic **DocType-driven UI toolkit** — likely why one component set covers all modules:
- `EntryListScreen` / `EntryScreen` — generic list & create/edit screens for any DocType
- `DynamicField` — renders the right input based on field metadata (a Frappe pattern)
- `ChildTableGrid` — editable grid for Frappe child tables
- `WizardFormLayout` — multi-step forms (e.g. enrollment)
- `ReportScreen` / `MasterDetailScreen` / `RecordDetailView` — reporting & detail views

### 5.4 Run Locally

```bash
cd apps/esti_erp_frontend
npm run dev     # http://localhost:3000
# or: yarn dev / pnpm dev / bun dev
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

---

## 6. Frontend Code Reference — What Each File Actually Does

The frontend is built around a **spec-driven architecture**: instead of hand-coding a bespoke React screen per DocType (which would mean 100+ nearly-identical files for a legacy system this size), each screen is described as a plain-object "spec" (`lib/forms/*.ts`), and a small set of generic template components in `components/sms/` render whatever spec they're given. A page file is often just a few lines: import a spec, pass it to a template component.

This directly maps the legacy desktop app's screen types (per internal migration docs referred to in the code as "the blueprint"):

| Legacy screen type | Approx. count | New generic component |
|---|---|---|
| Master/Detail (list + add/edit panel) | ~115 | `MasterDetailScreen` |
| Transaction entry (header + line-items grid) | ~23 | `EntryScreen` / `EntryListScreen` |
| Filter panel + Crystal Report viewer | ~85 | `ReportScreen` |
| Small modal prompts (password change, toggles, overrides) | ~19 | `DialogScreen` |

### 6.1 `lib/frappe.ts` — API Client

Thin Axios wrapper (`baseURL: "/"`, `withCredentials: true`) around the Frappe REST/RPC API.
- Keeps a module-level **CSRF token** (`setCSRFToken`) and attaches it to every outgoing request via an Axios request interceptor — the comment notes this was a deliberate fix (`Issue #9`) so the token reliably attaches to *all* subsequent calls, not just the first.
- `getErrorMessage(error)` unwraps Frappe's nested error shape: it digs into Axios's `error.response.data._server_messages` (a JSON-stringified array of JSON-stringified message objects — a Frappe quirk) to pull out a human-readable message, falling back gracefully if parsing fails.
- Exposes higher-level methods used elsewhere (`frappe.list(...)`, `frappe.call(...)`, `frappe.me()` — seen in call sites) that presumably wrap Frappe's `/api/resource` and `/api/method` endpoints.

### 6.2 `lib/utils.ts`
One helper: `cn(...inputs)` — merges `clsx` + `tailwind-merge`, the standard shadcn/ui utility for conditionally combining Tailwind classes without conflicts.

### 6.3 `lib/forms/types.ts` — The Spec Language
Defines the shared TypeScript types that every screen spec is written against:
- `FieldType` — union of supported field types (`Data`, `Text`, `Int`, `Float`, `Currency`, `Date`, `Datetime`, `Check`, `Link`, `Select`, `Attach Image`, etc.) — mirrors Frappe's own fieldtypes.
- `FieldSpec` — one form field: `fieldname`, `label`, `fieldtype`, `options` (Link target doctype, or newline-joined Select choices), `required`, `readOnly`, `inListView` (whether it shows as a list column).
- `FormSpec`, `EntrySpec`, `ReportSpec`, `ChildTableSpec`, `WizardLayout` (referenced by other files) — the shapes for each of the four screen archetypes above.

### 6.4 `lib/forms/registrar.ts`, `finance.ts`, `personnel.ts` — Screen Specs
Data-only files, no UI logic. Each exports `FormSpec`/`EntrySpec` objects describing one DocType's fields for the frontend, e.g.:
- `registrar.ts` → `studentSpec` (`Student` doctype: name, contact info, LRN, status, branch, etc.)
- `personnel.ts` → `employeeSpec` (`Personnel Info` doctype: employee ID, RFID, department dropdown with actual department list, employment status, etc.) plus `employeeWizardLayout` for a multi-step version.
- `finance.ts` → specs for `SMS Discount` and other billing doctypes.

Code comments note these field lists intentionally mirror the real installed Frappe DocTypes (including PH-specific custom fields from `campus_erp/setup/custom_fields.py`), and flag deliberate scope decisions (e.g. `naming_series`/`amended_from` omitted since they're not needed for data entry; ERPNext's native `payment_schedule` child table left out of the current migration pass).

### 6.5 `components/sms/` — The Generic Template Components

| Component | Lines | What it does |
|---|---|---|
| **`DynamicField.tsx`** | 93 | Renders a single form field (`Input`, `Select`, etc.) from a `FieldSpec`, wired into `react-hook-form`'s `Control`. This is the atomic building block every other form-based component uses. |
| **`ChildTableGrid.tsx`** | 82 | Editable grid for a Frappe **child table** (e.g. line items). Manages add/remove/edit-cell row logic locally and calls `onChange` with the updated array — used inside `EntryScreen`. |
| **`PhotoUploadField.tsx`** | 104 | "Attach Image" field rendered as a circular avatar preview + dashed upload box. **Currently preview-only** — it stores a local `URL.createObjectURL()` blob, not a real upload. A `TODO` comment flags that real upload needs `frappe.uploadFile()` wired to `/api/method/upload_file`, with open questions about whether `docname` exists yet at upload time and public vs. private file visibility. |
| **`EntryListScreen.tsx`** | 95 | List view for `EntrySpec`-backed doctypes. Fetches rows via `useQuery` + `frappe.list()`, uses `inListView`-flagged fields as columns (falls back to first 4 fields), and links each row to a full detail page (not a modal — entry documents need room for a child-table grid). |
| **`EntryScreen.tsx`** | 156 | The create/edit screen for a transaction-style doctype: a header form (via `DynamicField`) plus a `ChildTableGrid` for line items. Loads existing data by `name` prop, or starts blank for a new record; submits via `useMutation`, then navigates to `${basePath}/${newName}` on create. Business rules are *not* here — the component only collects input and calls whitelisted API methods, per its own doc-comment. |
| **`MasterDetailScreen.tsx`** | 188 | The most-used template (~115 legacy screens map to this): a list + Add/Edit panel for one DocType. Supports two render modes — an inline step-by-step **wizard** (via `WizardFormLayout`, if a `wizard` prop is passed) or the default flat dialog — chosen so adding a wizard to one screen doesn't change any other screen's existing behavior. |
| **`WizardFormLayout.tsx`** | 150 | Renders a `FormSpec` as a multi-step wizard: groups fields into `WizardStepSection`s with configurable column counts (1/2/3/4), shows section titles, and silently skips any fieldname listed in a section that doesn't exist in `spec.fields` (guards against typos rather than crashing). Delegates individual fields to `DynamicField`/`PhotoUploadField`. |
| **`ReportScreen.tsx`** | 127 | Generic filter-panel + results-table screen replacing the legacy Crystal Reports viewers. Renders filter fields via `DynamicField`, runs `spec.method` through `useMutation` on submit, and dumps whatever rows/columns the server method returns into a table — any grouping/subtotal logic that Crystal used to compute client-side must now live server-side in the report's Python `get_data`. |
| **`DialogScreen.tsx`** | 74 | Small single-column modal form for the ~19 legacy "prompt" screens (password change, settings toggle, override confirmation) — one primary action, not a full page. |
| **`RecordDetailView.tsx`** | 36 | Read-only, two-column key/value display of a record (via `FormSpec.fields`), with "Close"/"Edit" buttons — the non-editable detail view used before switching to edit mode. |

### 6.6 `components/login-form.tsx`
Login form using `react-hook-form` + `zod` (`loginSchema` requires non-empty `usr`/`pwd`). On submit calls `login()` from `AuthProvider`, shows a spinner while `submitting`, and surfaces errors via `sonner` toasts.

### 6.7 `providers/AuthProvider.tsx`
React Context wrapping auth state:
- `AuthUser` shape: `user`, `full_name`, `roles`, `modules` (the list of Frappe modules this user can access — drives the dashboard's module cards).
- On mount, calls `frappe.me()` via `useQuery` (`queryKey: ["auth", "me"]`); on success stores the returned CSRF token via `setCSRFToken`.
- Exposes `login`, `logout`, and `hasModule(module)` for role/module-based UI gating.

### 6.8 `providers/QueryProvider.tsx`
Sets up a single `QueryClient` (via `useState` so it's stable across re-renders) with `staleTime: 30_000`, `retry: 1`, `refetchOnWindowFocus: false`, and wraps children in `QueryClientProvider`. Composed with `AuthProvider` in the root layout to give the whole app React Query + auth context.

### 6.9 Example Pages — How Thin They Are

- **`registrar/students/page.tsx`** (8 lines total): imports `MasterDetailScreen` + `studentSpec`, renders `<MasterDetailScreen spec={studentSpec} />`. That's the entire page — all list/add/edit behavior comes from the generic component + spec.
- **`dashboard/page.tsx`** (33 lines): reads `user` from `useAuth()`, greets by `full_name`, and renders one placeholder `Card` per module in `user.modules` — explicitly a **scaffold**, with each card's body noting "screens land here module by module" per the phased rollout plan.
- **`finance/wallets/page.tsx`** (217 lines) is the exception — a bespoke page (not spec-driven) for wallet balance lookup/top-up/payment. Notable details: a `toBalance()` helper loosely unwraps server responses that may come back as either a raw number or `{ balance: number }`, and an `isWalletFeatureDisabled()` check that string-matches error messages to detect when the wallet feature itself is turned off server-side, rather than treating it as a generic error.

### 6.10 Known TODOs / In-Progress Areas (from code comments)

- **Photo/image upload is not wired to the backend yet** (`PhotoUploadField.tsx`) — currently local-preview only.
- **`ReportScreen`** throws a clear error if a `ReportSpec` is used before its backing `method` is configured, rather than failing silently.
- **`WizardFormLayout`** intentionally fails soft (skips unknown fields) instead of crashing on spec/section mismatches.
- Dashboard is a placeholder — real per-module screens are being built out incrementally.

---

## 7. Configuration & Services

### 6.1 `sites/common_site_config.json`

| Setting | Value |
|---|---|
| Default site | `education.localhost` |
| Web server port | `8000` |
| Socket.IO port | `9000` |
| File watcher port | `6787` |
| Redis cache | `redis://127.0.0.1:13000` |
| Redis queue | `redis://127.0.0.1:11000` |
| Redis socketio | `redis://127.0.0.1:13000` |
| Gunicorn workers | `9` |
| Background workers | `1` |
| Live reload | enabled |

### 6.2 `Procfile` — Process Types

| Process | Command |
|---|---|
| `redis_cache` | `redis-server config/redis_cache.conf` |
| `redis_queue` | `redis-server config/redis_queue.conf` |
| `web` | `bench serve --port 8000` |
| `socketio` | `bench socketio` |
| `watch` | `bench watch` (asset rebuild on change) |
| `schedule` | `bench schedule` (cron-like scheduled jobs) |
| `worker` | `bench worker` (background job queue, logs → `logs/worker.log`) |

All started together via `bench start` (which reads the Procfile).

---

## 8. Setup / Installation (from scratch)

```bash
# 1. Install bench CLI (prereq: Python 3.10+, Node, Redis, MariaDB/Postgres, wkhtmltopdf)
pip install frappe-bench

# 2. Init a new bench (creates apps/frappe, env/, config/, etc.)
bench init frappe-bench --frappe-branch version-15
cd frappe-bench

# 3. Get the core/base apps
bench get-app erpnext --branch version-15
bench get-app education --branch develop
bench get-app hrms --branch develop

# 4. Get the custom app
bench get-app campus_erp $URL_OF_CAMPUS_ERP_REPO --branch develop

# 5. Create the site and install apps on it
bench new-site education.localhost
bench --site education.localhost install-app erpnext
bench --site education.localhost install-app education
bench --site education.localhost install-app hrms
bench --site education.localhost install-app campus_erp

# 6. Start all backend services (web, worker, redis, socketio, scheduler, watch)
bench start

# 7. Frontend (separate terminal)
cd apps/esti_erp_frontend
npm install
npm run dev
```

---

## 9. Common Bench Commands (reference)

```bash
bench start                          # Start all services from Procfile
bench --site education.localhost migrate     # Run pending migrations/patches
bench --site education.localhost console     # Open Python/Frappe shell for the site
bench --site education.localhost backup      # Backup the site (→ logs/backup.log)
bench build                          # Build/bundle frontend assets for Frappe apps
bench update                         # Pull + migrate + build all apps
bench --site education.localhost list-apps   # List apps installed on the site
bench version                        # Show bench CLI version
```

---

## 10. Notes & Open Items

- `library` and `asset` modules in `campus_erp` have `doctype/` folders present but no DocTypes were listed yet — confirm if these are in progress or empty scaffolds.
- `esti_erp_frontend` has its own `.git` — it's tracked as a **separate repository** nested inside the bench's `apps/` folder, not a Frappe-registered app (it's not in `apps.txt`).
- `apps.json` doesn't list `campus_erp`'s own version/commit — worth double-checking `campus_erp`'s git remote for the deployed commit hash.
- No `.env.example` was found for the frontend, only a local `.env.local` — worth documenting required env vars (e.g. Frappe API base URL) separately since `.env.local` wasn't pasted here.
