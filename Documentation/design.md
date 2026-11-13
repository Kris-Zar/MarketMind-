# MarketMind AI — UI/UX Design Specification

**Version:** 1.0  
**Status:** Initial design baseline for Phase 0 prototype  
**Last updated:** 12 November 2026  
**Related documents:** `PRD.md`, `architecture.md`, `rules.md`, `phases.md`  
**Visual references:** `docs/design-references/`

---

## 1. Purpose and authority

This document defines the visual direction, interaction principles, reusable interface patterns, and page-level expectations for MarketMind AI.

- `PRD.md` defines product behavior and requirements.
- `architecture.md` defines the technical structure.
- `rules.md` defines mandatory coding and agent behavior.
- `phases.md` defines what may be implemented in each phase.
- `design.md` defines how the product interface should look and behave.

This document does not authorize features outside the active phase. During Phase 0, build only the guide-ready prototype scope in `phases.md`. Later page specifications are design guidance, not permission to implement later-phase functionality early.

When a visual reference conflicts with this document, follow this document. When this document conflicts with product scope or security requirements, follow the source-of-truth rules in the other project documents and report the conflict rather than guessing.

## 2. Product design direction

### 2.1 Overall direction

Build a **clean, premium, approachable marketing SaaS workspace**. The interface should feel professional enough for a growing company but simple enough for a business owner who does not have a marketing team.

The selected direction is:

- Light application canvas with a deep navy sidebar.
- Indigo/violet as the primary action color.
- White or near-white cards with subtle borders and restrained shadows.
- Clear typography, generous spacing, and concise labels.
- Small, consistent icons rather than decorative illustrations everywhere.
- Real product previews as the visual focus of creative-generation screens.

Do not mix multiple visual themes. The dark sidebar is the main navigation surface; the workspace itself remains light. Dark mode is not part of the initial prototype unless separately approved.

### 2.2 Design principles

1. **Clarity over decoration:** every screen should have one obvious primary task.
2. **Workflow-first:** guide users from brand/product context to campaign, creative, review, and export.
3. **Brand consistency:** show the active brand and campaign context when generating content.
4. **Preview before action:** users should review generated content before saving, exporting, scheduling, or publishing.
5. **Explain important decisions:** recommendations must show a reason and evidence/source where available.
6. **Honest states:** distinguish real provider data, user-entered data, demo data, estimates, and unavailable integrations.
7. **Reusable patterns:** use the same buttons, fields, cards, tables, modals, status labels, and spacing rules throughout the application.

## 3. Visual references

The following generated images are inspiration boards, not pixel-perfect implementation specifications. Use them to understand the intended hierarchy, spacing, color direction, sidebar, cards, forms, content previews, and analytics composition.

### 3.1 Dashboard and design system direction

![Dashboard and design system reference](docs/design-references/01-dashboard-and-design-system.png)

Use this for the overall application shell, dashboard cards, quick actions, campaign list, content preview, and basic token direction.

### 3.2 Campaign creation and content editor direction

![Campaign creation and content editor reference](docs/design-references/02-campaign-creation-and-content-editor.png)

Use this for campaign setup, step-based forms, objective selection, content editing, creative preview, and variant generation.

### 3.3 Dashboard, content generation, and analytics direction

![Dashboard, content generation, and analytics reference](docs/design-references/03-dashboard-content-and-analytics.png)

Use this for the dashboard welcome area, quick actions, generation layout, KPI cards, and performance chart composition.

**Reference-image warning:** generated screen text, names, counts, metrics, product claims, profile details, and sample campaign results are illustrative placeholders. Do not copy them as real data, real analytics, or approved product copy. Replace with clearly labelled demo content in Phase 0 and real data only when supported by implemented functionality.

## 4. Design tokens

Use centralized design tokens or CSS variables. Do not scatter raw color values, spacing values, border radii, or shadows across components.

### 4.1 Color palette

| Token | Suggested value | Usage |
|---|---|---|
| `--color-primary` | `#635BFF` | Primary buttons, active navigation, focus accents |
| `--color-primary-hover` | `#5147E8` | Primary button hover |
| `--color-primary-soft` | `#EFEEFF` | Selected states and soft highlights |
| `--color-secondary` | `#8B5CF6` | Secondary accent, charts, tags |
| `--color-sidebar` | `#111827` | Main navigation background |
| `--color-sidebar-elevated` | `#1F2A44` | Active/hover sidebar item |
| `--color-background` | `#F7F8FC` | Main application background |
| `--color-surface` | `#FFFFFF` | Cards, dialogs, panels |
| `--color-border` | `#E5E7EB` | Dividers, input borders, card outlines |
| `--color-text` | `#172033` | Primary text |
| `--color-text-muted` | `#667085` | Secondary text and help copy |
| `--color-success` | `#16A34A` | Confirmed success and positive movement |
| `--color-warning` | `#D97706` | Warnings and pending attention |
| `--color-danger` | `#DC2626` | Errors and destructive actions |
| `--color-info` | `#2563EB` | Informational states |

Use semantic tokens (`success`, `warning`, `danger`, `info`) only when the meaning is accurate. Do not use green merely as decoration or to imply that a metric is real or verified.

### 4.2 Typography

- Primary font: **Inter**, with a system sans-serif fallback.
- Page title: 28–32px, semibold/bold.
- Section heading: 18–20px, semibold.
- Card heading: 14–16px, semibold.
- Body text: 14–16px, regular.
- Labels and helper text: 12–13px, medium/regular.
- KPI value: 26–32px, semibold/bold.

Use a consistent type scale. Avoid overly large marketing-style headings inside operational screens.

### 4.3 Spacing, shape, and elevation

Use a 4px base spacing scale. Common values: 4, 8, 12, 16, 20, 24, 32, 40, and 48px.

- Card radius: 12px.
- Input/button radius: 8px.
- Modal radius: 14px.
- Standard control height: 40px; compact controls may use 32px.
- Card border: 1px solid `--color-border`.
- Shadows: subtle and used sparingly, mainly for floating menus and dialogs.
- Avoid heavy glassmorphism, excessive gradients, large blurred shadows, and unnecessary animation.

### 4.4 Iconography

Use one consistent outline icon library across the product. Icons must have labels or accessible names where their meaning is not obvious. Do not mix emoji icons with the core navigation icon set.

## 5. Application shell and navigation

### 5.1 Desktop layout

The desktop application uses:

- A persistent left sidebar, approximately 220–248px wide.
- A main workspace filling the remaining width.
- A top utility bar for page context, search where appropriate, notifications, help, and account menu.
- A centered page content region with a sensible maximum width on very wide screens.

The sidebar should support a compact/collapsed state only if it can be implemented accessibly without breaking navigation.

### 5.2 Navigation structure

Use these primary navigation items, subject to the active phase:

1. Dashboard
2. Brand Kit
3. Products
4. Campaigns
5. Content Studio
6. Publishing
7. Analytics
8. Market Trends
9. Competitor Insights
10. Recommendations
11. Asset Library
12. Settings

For Phase 0, show only the routes/screens actually represented by the prototype. Later-phase items may be shown as clearly marked disabled/“Coming later” navigation entries only when that helps the guide understand the product roadmap. Do not make disabled items look functional.

### 5.3 Responsive behavior

- Desktop is the primary layout target for the guide-ready prototype.
- At tablet widths, collapse the sidebar to an accessible drawer or compact rail.
- At mobile widths, use a menu drawer and a single-column content layout.
- KPI cards should wrap naturally; tables should have a deliberate mobile treatment rather than overflowing the viewport.
- Campaign editing must remain usable on a narrow viewport, with preview and controls stacked vertically.

## 6. Page and feature design specifications

The following describes the intended product interface. Phase eligibility is governed by `phases.md`.

### 6.1 Dashboard

**Purpose:** Give the user a quick overview and clear next actions.

Recommended structure:

- Welcome/header area with current workspace or brand context.
- Primary action: `Create Campaign`.
- KPI cards for supported summary metrics.
- Recent campaigns with status and last-updated information.
- Recent or top-performing content preview when real or clearly labelled demo data exists.
- Quick actions: create campaign, generate content, manage Brand Kit, view analytics.
- Optional recommendation preview only when the recommendation has a reason and source.

Do not show fabricated revenue, reach, engagement, conversion, or growth figures as live data. For Phase 0, label all sample metrics as demo data or use neutral placeholders such as `—`.

### 6.2 Brand Kit

**Purpose:** Capture and reuse a brand's identity.

Recommended sections:

- Brand name, business category, description, website (optional).
- Logo upload and logo preview.
- Primary, secondary, and accent colors.
- Typography preferences.
- Brand voice/tone and writing guidance.
- Audience and positioning notes.
- Tagline, key messages, and prohibited wording (optional).
- Save/cancel actions and a visible saved state.

Keep the form grouped into short sections. Show a live mini-preview of color, typography, and logo usage where feasible. Never invent a brand fact; any AI suggestion must be editable and explicitly confirmed by the user before becoming saved brand guidance.

### 6.3 Product profile

**Purpose:** Store reusable information for a product or service.

Include:

- Product/service name and description.
- One to three product images in the initial workflow.
- Optional features, benefits, price, offer, and audience.
- Brand association.
- Save, edit, and archive actions.

Image upload should show file type/size guidance, preview, replace/remove controls, and upload progress. Product claims and prices must come from user input or verified source data.

### 6.4 Campaign planner

**Purpose:** Turn a product and objective into a campaign brief.

Use a simple step-based flow:

1. Choose product/brand.
2. Enter campaign name and objective.
3. Select target audience, platform(s), tone, and optional offer.
4. Choose a campaign mode: `Individual Content` or `Do My Campaign`.
5. Review the brief before generation.

Keep the number of required fields small. Explain optional fields and provide sensible editable defaults. Do not start costly generation until the user explicitly requests it.

### 6.5 Content Studio

**Purpose:** Generate and refine individual creative assets or a coordinated campaign package.

The two modes must be visually distinct:

- **Individual Content:** user selects one output type, such as caption, banner, carousel, or a supported video-ad concept.
- **Do My Campaign:** system prepares a coordinated package of multiple assets based on one campaign brief.

Recommended layout:

- Left/control panel: campaign context, content type, platform, tone, goal, and generation settings.
- Main canvas: generated creative preview.
- Variant area: alternative results with selection controls.
- Action area: edit, regenerate, save, download/export, and use in campaign.

Show a clear generation state, failure state, and retry path. Keep prompts and generated copy editable. Clearly distinguish a real generated asset from a static prototype placeholder.

### 6.6 Creative editor and review

- Provide tabs or sections for Text, Design, and Preview only when those areas are implemented.
- Keep the source creative and current revision identifiable.
- Show variant history and allow a user to select a preferred version.
- Provide explicit save and discard actions for edits.
- Do not overwrite the original asset silently.
- Display export dimensions and file format before download.

### 6.7 Publishing hub

- Show connected account/provider, authorization state, and supported capabilities.
- Distinguish draft, ready, scheduled, publishing, published, and failed states.
- Show platform-specific caption and media preview.
- Ask for explicit confirmation before scheduling or publishing.
- Display the provider response and external post ID when available.
- Offer download/manual-publishing fallback when direct publishing is unavailable.

A disconnected or unsupported provider must never be shown as connected or published. Publishing controls are not functional in Phase 0 unless a specifically approved sandbox integration exists.

### 6.8 Analytics

- Show only metrics actually returned by a connected platform or entered through a documented source.
- Identify source platform, reporting period, and last synchronization time.
- Offer campaign/post filters when data exists.
- Use line charts for trends over time and compact tables for comparisons.
- Distinguish zero from unavailable: `0` means a measured zero; `—` means not available.
- Avoid presenting unlike metrics as directly comparable across platforms.

For Phase 0, charts and KPI cards may use clearly labelled demonstration data solely to explain the intended experience.

### 6.9 Market Trends and Competitor Insights

Recommended layout:

- Search/filter row for industry, platform, region, and observation period where supported.
- Trend cards with topic, category, growth/strength signal, observation window, and source.
- Evidence panel containing source links and the data timestamp.
- Trend detail view with summary, example creative patterns, and limitations.
- Competitor observations kept separate from verified campaign-performance data.

A trend must not be described as detected unless source evidence supports it. Do not scrape restricted sources or imply access to private competitor analytics. In Phase 0, use labelled illustrative examples only.

### 6.10 Recommendations

Each recommendation card should include:

- Suggested action or creative direction.
- Why it is being recommended.
- Supporting trend, brand, or campaign evidence.
- Confidence/strength label only if the scoring method is defined.
- Relevant campaign/product context.
- Actions to accept, dismiss, or save for later.

Do not display an unsupported numeric probability or claim that a recommendation will improve sales. In the prototype, clearly mark recommendations as illustrative.

### 6.11 Asset Library

Use a searchable, filterable grid/list with thumbnail, asset name, type, linked brand/campaign, creation date, and status. Provide preview, download, and safe archive/delete actions. Preserve the original asset when creating a new revision.

## 7. Reusable component system

Build shared components once and reuse them. Keep components small, typed, and focused. Avoid page-specific copies of common controls.

Suggested shared components:

- `AppShell`, `Sidebar`, `Topbar`, `PageHeader`
- `PrimaryButton`, `SecondaryButton`, `IconButton`
- `TextField`, `TextArea`, `SelectField`, `FileUpload`
- `Card`, `MetricCard`, `StatusBadge`, `EmptyState`, `ErrorState`
- `CampaignCard`, `CreativeCard`, `VariantCard`, `TrendCard`, `RecommendationCard`
- `DataTable`, `ChartPanel`, `FilterBar`, `DateRangePicker`
- `ConfirmDialog`, `Modal`, `DropdownMenu`, `Toast`
- `LoadingSkeleton`, `ProgressIndicator`, `InlineValidation`

Use a shared component only when its structure or behavior is genuinely repeated. Do not create generic abstractions with many unrelated boolean flags. Prefer a small component with clear props and a focused responsibility.

## 8. Interaction and state conventions

- Use consistent primary, secondary, tertiary, and destructive action styles.
- Every user action must have a visible result: success, validation feedback, loading, or error.
- Disable actions only when the reason is clear; explain the requirement nearby.
- Preserve form input when a non-destructive request fails.
- Confirm destructive actions and external side effects.
- Use optimistic UI only when rollback and error handling are implemented.
- Do not make controls decorative or non-functional while presenting them as working features.
- Avoid surprise navigation, silent regeneration, or automatic publication.

### 8.1 Status labels

Use a consistent set of semantic labels:

- `Draft`
- `Needs review`
- `Approved`
- `Scheduled`
- `Publishing`
- `Published`
- `Failed`
- `Unavailable`
- `Demo data`

Only use statuses supported by the relevant workflow.

## 9. Accessibility and usability

- Meet WCAG 2.1 AA contrast targets where practical.
- All interactive controls must be keyboard accessible.
- Provide visible focus indicators.
- Associate labels and validation messages with form controls.
- Give meaningful alternative text to informative images; decorative images should be ignored by assistive technology.
- Do not communicate status or chart meaning using color alone.
- Use readable text sizes and comfortable click/tap targets.
- Respect reduced-motion preferences.
- Charts must include a textual summary or accessible tabular alternative.

## 10. Design behavior for loading, empty, and error states

Every data-driven page must define:

- **Loading:** skeleton or progress indicator, with no misleading placeholder values.
- **Empty:** explain what belongs here and offer the next useful action.
- **Error:** explain what failed in user-friendly language and offer retry when safe.
- **Unavailable:** distinguish missing integration/permission from an empty result.
- **Partial data:** show what loaded and what did not.

Never hide an error by substituting fake success data.

## 11. Phase 0 prototype requirements

Phase 0 is a guide-ready prototype. Its priority is to communicate the product clearly and demonstrate the central user journey, not to pretend every backend integration already exists.

The prototype should include the screens and interactions approved in `phases.md`, especially:

1. Dashboard and application navigation.
2. Brand Kit setup.
3. Product profile creation.
4. Campaign brief and campaign mode selection.
5. Individual Content and Do My Campaign flows.
6. Creative preview, variant selection, and basic editing states.
7. Save/export confirmation or a clearly labelled simulated export interaction.

Prototype data may be local or static, but it must be visibly marked as demonstration data where it could be mistaken for real business information. Do not connect real social accounts or claim live analytics/publishing during Phase 0 unless separately approved.

## 12. Frontend implementation guidance

- Follow the existing architecture and coding rules; do not invent a parallel frontend structure.
- Use the shared design tokens for colors, spacing, typography, radius, and shadows.
- Use reusable typed components and feature-focused page modules.
- Keep page components focused on composition; move repeated stateful behavior into focused hooks and business logic into the appropriate layer.
- Keep API access in the typed API client layer, not scattered through components.
- Keep mock/demo data separate from API-backed data and label its origin.
- Add component and interaction tests for important reusable controls and prototype flows.
- Avoid adding UI libraries or dependencies without checking the existing package set and documenting the reason.

## 13. Definition of design completion

A screen is design-complete for its active phase when:

- It follows the shared shell and design tokens.
- Its primary task and next action are obvious.
- Its normal, loading, empty, and error/unavailable states are considered.
- Interactive controls work or are clearly marked as unavailable/demo-only.
- It is responsive at the target breakpoints.
- It is keyboard accessible and has visible focus states.
- It uses real data or clearly labelled demo content.
- It does not contradict `PRD.md`, `architecture.md`, `rules.md`, or `phases.md`.

---

## 14. Agent instructions

Before implementing any screen, the coding agent MUST:

1. Read this document and the relevant section of `phases.md`.
2. Check the current repository and preserve existing working components.
3. Identify which design references apply to the screen.
4. Reuse existing shared tokens and components before creating new ones.
5. Implement only the active-phase scope.
6. Verify responsive layout, keyboard behavior, loading/error states, and tests.
7. Report any design or requirement conflict instead of silently inventing a new pattern.

**Do not reproduce the reference collages literally.** Build real, maintainable application screens using the shared design system. The references demonstrate visual direction; this document and the product requirements define the implementation.
