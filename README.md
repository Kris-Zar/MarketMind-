# MarketMind AI — Phase 0 Guide-Ready Prototype

**Active Milestone:** Phase 0 — Guide-Ready Prototype  
**Product Vision:** Connected digital marketing campaign creation and intelligence platform for small businesses and lean teams.  
**Purpose:** Interactive, runnable prototype to validate the central user journey and gather project guide feedback before starting the Phase 1 Core MVP.

---

## 1. Phase 0 Scope & Product Truth

Phase 0 implements the core demonstration journey from brand setup to reviewable campaign assets:

- **Application Shell & Navigation:** Clean SaaS workspace with deep navy sidebar (`#111827`), light workspace canvas (`#F7F8FC`), and responsive layout.
- **Brand Kit Management:** Reusable Brand Kit with voice/tone, category, description, primary & secondary colors (`#635BFF` / `#1F2A44`), logo upload (data-URL) + sample SVGs, and live mini brand card preview.
- **Product Profile Library:** Manage product descriptions, pricing, key benefits, offers, target audience, and product images (sample visuals or upload).
- **AI Campaign Planning & Reviewable Brief:** Step-based campaign builder connecting brand and product context to marketing objectives (Awareness, Engagement, Traffic, Product Launch, Promotion, Leads) with a reviewable brief summary before generation.
- **Two Visibly Differentiated Creation Modes:**
  - **Individual Content:** Focused single-format asset generation with candidate variations.
  - **Do My Campaign:** Coordinated 3-asset package under one brief (Hero Launch Post, Value Banner, Call-to-Action copy).
- **Interactive Studio with Live In-Place Copy Editing:** Edit headline, caption, CTA, and hashtags in real time with instant preview updates on the visual creative card.
- **At Least One Brand-Aware Template-Based Visual:** Rendered visuals (`HeroProductCard`, `PromoSplitBanner`, `MinimalQuoteCard`) dynamically use the entered brand colors, logo, product visual, and edited copy.
- **Variant Regeneration:** Regenerate single variant copy without altering sibling assets.
- **Real File Exports (Never Faked):** Download formatted campaign briefs (`.md`), structured campaign data packages (`.json`), and standalone vector banner graphics (`.svg`).
- **Guide Demonstration Script & Scope Truth:** In-app walkthrough guide with an honest capability matrix and guide feedback questions.

### What is explicitly NOT implemented in Phase 0 (Roadmap Only):
- **Live Social OAuth & Publishing:** Social connections are marked as deferred to Phase 2.
- **Live Social Analytics:** KPI cards display clear `Demo Data` labels or neutral placeholders (`—`). No fake metrics or conversion attribution claims.
- **Live Trend Scraping or Competitor Snooping:** Deferred to Phase 3.
- **Autonomous Video Generation / Foundation Model Training:** Out of scope.

---

## 2. Architecture & Project Layout

MarketMind AI is built as a **modular monolith** following `Documentation/architecture.md`:

```text
marketmind-ai/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application entrypoint
│   │   ├── api/v1/router.py         # Versioned route registration & prototype meta
│   │   ├── core/                    # Validated settings & dependency injection
│   │   ├── db/                      # Prototype JSON store & seeded demo data
│   │   ├── integrations/ai/         # TextGenerationProvider contract & MockDemo provider
│   │   ├── modules/                 # Modular domain features
│   │   │   ├── brands/              # schemas, repository, service, router
│   │   │   ├── products/            # schemas, repository, service, router
│   │   │   ├── campaigns/           # schemas, repository, service, router
│   │   │   └── content/             # schemas, repository, service, router
│   │   └── common/errors.py         # Global error handlers
│   ├── tests/                       # Pytest test suite (100% passing)
│   ├── requirements.txt             # Pinned backend dependencies
│   └── pytest.ini
│
├── frontend/
│   ├── src/
│   │   ├── shared/                  # AppShell, UI primitives, types, API client
│   │   ├── styles/                  # design.md tokens and global styles
│   │   └── features/
│   │       ├── dashboard/           # Welcome area, honest KPIs, quick actions
│   │       ├── brands/              # Brand Kit management & live card preview
│   │       ├── products/            # Product Profile library & summary cards
│   │       ├── campaigns/           # Step-based Campaign Planner & Brief Review
│   │       ├── studio/              # Content Studio, modes, live editor, SVG export
│   │       └── guide/               # Guide demo script, capability matrix, questions
│   ├── tests/                       # Vitest component test suite (100% passing)
│   ├── package.json
│   └── vite.config.ts
│
├── Documentation/                   # PRD, architecture, rules, phases, design, memory
└── README.md
```

---

## 3. Quickstart & Local Development

### Prerequisites
- **Node.js** v18+ (tested with v24.12.0) & **npm**
- **Python** 3.10+ (tested with v3.11.9)

### Step 1: Start the Backend API (FastAPI)
From the project root:

```powershell
# Activate backend virtual environment
.\backend\.venv\Scripts\Activate.ps1

# Run the FastAPI server via Uvicorn
$env:PYTHONPATH="backend"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be available at:
- Root API: `http://127.0.0.1:8000/api/v1`
- Swagger Documentation: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/api/v1/health`

### Step 2: Start the Frontend Application (Vite)
In a separate terminal:

```powershell
cd frontend
npm run dev
```

Open your browser at:
`http://localhost:5173`

---

## 4. Running the Automated Tests

### Backend Tests (Pytest)
```powershell
$env:PYTHONPATH="backend"
.\backend\.venv\Scripts\pytest.exe backend/tests -c backend/pytest.ini -v
```
*Result: 4 passed in 1.2s covering health, demo seed isolation, Brand Kit hex/logo validation, and full end-to-end journey.*

### Frontend Tests (Vitest)
```powershell
cd frontend
npm run test
```
*Result: 6 passed in 0.2s covering UI primitives, AppShell navigation, template rendering, and SVG banner generation.*

### Frontend Production Build Check
```powershell
cd frontend
npm run build
```
*Result: Clean compilation (`tsc -b && vite build`) with zero errors.*

---

## 5. Phase 0 Demonstration Script

To present MarketMind AI to the project guide:

1. **Open Dashboard (`/`):** Point out the workspace welcome banner, quick action tiles, and clearly labelled `Demo Data` KPI cards.
2. **Review Brand Kit:** Switch to the Brand Kit tab. Review the seeded demo brand (*LumaBrew Roasters*) or create a new brand with custom colors and logo. Show the live brand identity mini-card preview.
3. **Review Product Profile:** Switch to Products. Show *Aurora Cold Brew Concentrate* with its benefits, price, and visual.
4. **Plan Campaign Brief:** Switch to Campaigns. Walk through selecting the Brand, Product, Objective (*Product Launch*), Channel (*Instagram*), Tone, and Key Message. Show the reviewable Campaign Brief card on the right.
5. **Demonstrate Creation Modes:** Select **Do My Campaign** or **Individual Content** and click *Review & Generate Drafts*.
6. **Live In-Place Copy Editing:** In the Content Studio, edit the headline or CTA text. Notice that the creative preview card on the right immediately updates with the new text!
7. **Regenerate Variant:** Click *Regenerate Variant* to demonstrate generating an alternative without altering other campaign assets.
8. **Real File Export:** Click *Brief (.md)*, *Data (.json)*, or *Banner (.svg)* to download real marketing files directly to your computer.
9. **Review Guide & Scope Tab:** Walk through the capability matrix and review the feedback questions.

