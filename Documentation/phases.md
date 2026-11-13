# MarketMind AI — Development Phases

**Version:** 1.0  
**Status:** Proposed delivery roadmap  
**Last updated:** 12 November 2026  
**Parent document:** `PRD.md`  
**Technical reference:** `architecture.md`  
**Implementation rules:** `rules.md`

---

## 1. Purpose

This document divides MarketMind AI into clear, reviewable development phases. It defines what should be built, what must be demonstrated, and what must be true before moving to the next phase.

The roadmap has one additional opening phase for a **guide-ready prototype**. This prototype comes before the product MVP and is intended to communicate the product idea, validate the main user journey, and collect feedback from the project guide. It is not the production MVP and must not be presented as a complete implementation of the product.

The remaining phases follow the release strategy already defined in `PRD.md`:

- Phase 1 — Core Usable Product (MVP)
- Phase 2 — Integrations and Measurement
- Phase 3 — Market Intelligence and Optimization

The roadmap does not authorize all phases to be implemented at once. Only the currently approved phase may be developed. Work on a later phase requires an explicit go-ahead from the project owner.

## 2. Authority and scope rules

Use the documents in this order:

1. `PRD.md` defines product requirements and acceptance criteria.
2. `architecture.md` defines application structure, module boundaries, technology baseline, and system contracts.
3. `rules.md` defines mandatory coding, security, testing, and AI-agent behavior.
4. `phases.md` defines delivery order, phase scope, dependencies, and exit gates.

If these documents appear to conflict, do not silently choose one. Report the exact conflict and wait for a decision before making a change that affects product scope, data, security, or architecture.

### 2.1 Rules that apply to every phase

- Preserve the modular-monolith architecture unless the project owner approves a change.
- Keep code concise, function-first, reusable, and separated by responsibility.
- Implement only the features assigned to the active phase.
- Do not create future-phase modules as empty placeholders merely to match the architecture tree.
- Do not introduce a second implementation of logic that already exists.
- Use provider adapters and documented interfaces for AI, storage, trend sources, and social platforms.
- Validate all user input, AI output, and external provider responses.
- Enforce authentication, ownership, and authorization on the backend for protected operations.
- Never expose API keys, tokens, passwords, or other secrets in frontend code, logs, prompts, screenshots, or Git history.
- Never present sample data, mock output, estimates, or simulated results as live provider data or real campaign performance.
- Never claim that content has been published until a supported provider confirms the operation.
- Never claim that a trend is detected unless permitted source data and evidence support it.
- Keep existing working code and user changes. Inspect before editing; do not regenerate the project from scratch.
- Every phase must leave the repository in a runnable, testable state.

## 3. Phase overview

| Phase | Name | Primary outcome | Status before approval |
|---|---|---|---|
| 0 | Guide-Ready Prototype | Demonstrable product concept and validated core user journey | First phase; build this first |
| 1 | Core Usable Product (MVP) | Working product-to-campaign workflow with saved and exportable assets | Not started until Phase 0 is reviewed |
| 2 | Integrations and Measurement | Verified publishing integrations and source-backed campaign analytics | Requires approved MVP foundation |
| 3 | Market Intelligence and Optimization | Evidence-backed trends, competitor observations, and explainable recommendations | Requires the relevant data and source access |

**Important distinction:** Phase 0 is an additional prototype milestone. It does not replace, merge with, or rename Phase 1 of the PRD. The PRD's Phase 1 remains the first end-to-end MVP.

---

# Phase 0 — Guide-Ready Prototype

**Goal:** Build a small but coherent, interactive prototype that allows the project guide to understand MarketMind AI, experience its main workflow, and provide feedback before full implementation begins.

**Primary question to answer:** Can a user understand how to go from a brand and product profile to a draft marketing campaign and reviewable creative assets?

This phase focuses on product communication and workflow validation. It must be deliberately limited. Do not attempt to build all 13 feature areas in the prototype.

## 0.1 In scope

### A. Application shell and navigation

- Create the MarketMind AI application shell using the frontend baseline in `architecture.md`.
- Provide a clear navigation structure for the prototype's included screens.
- Use a consistent visual design system for typography, spacing, colors, buttons, forms, cards, and status indicators.
- Provide responsive layouts for the main demonstration screens.

### B. Brand profile and basic Brand Kit screen

- Allow the demonstrator to enter a brand name, category, description, and brand voice.
- Allow entry or selection of primary and secondary brand colors.
- Allow a logo upload or a clearly labelled sample logo.
- Display the saved brand information in a readable Brand Kit summary.
- Use a seeded demo brand when helpful, clearly marked as demo content.

### C. Product profile screen

- Allow entry of a product name and description.
- Allow one or more product images to be selected for the prototype flow.
- Display optional price, benefits, offer, and target audience fields.
- Show a product summary before campaign creation.

### D. Campaign setup

- Allow the demonstrator to select a brand and product.
- Provide a small set of campaign objectives, such as awareness, engagement, traffic, or product launch.
- Allow a target audience, channel, tone, and campaign message to be entered or selected.
- Present a reviewable campaign brief before moving to content generation.

### E. Two campaign modes

- **Individual Content:** select one content format and preview one requested content item or a small set of variants.
- **Do My Campaign:** preview a coordinated draft package containing a campaign brief, proposed copy, and a limited set of creative assets.
- Make the difference between the two modes obvious in the UI.
- Keep all generated or sample content in draft/review state; the prototype must not publish anything externally.

### F. Creative preview and asset area

- Display draft captions, headlines, CTAs, and a small selection of creative previews.
- Include at least one template-based static banner or social-post preview that uses the entered brand/product information.
- Allow the demonstrator to edit visible text fields and see the preview update where practical.
- Provide a clear indication of which assets are editable and which are flattened previews.
- Provide a prototype export or download action only when it creates a real file or content package.

### G. Prototype data and service boundaries

- Use the backend and frontend structure defined in `architecture.md`; do not create a throwaway structure that must be discarded for the MVP.
- Use a clearly isolated demo-data or mock-provider adapter for any unavailable AI or external service.
- Clearly label all mock-generated content and seeded records as **Demo** or **Sample**.
- If a real AI provider is configured, it may be used through the approved provider adapter; it must not be called directly from UI components.
- Do not create pretend social-account connections, fabricated publishing states, fake analytics, or fabricated trend detections.
- Keep demo data separate from any future live-user records.

## 0.2 Explicitly out of scope

The following are not required for Phase 0:

- Production authentication, account recovery, or full workspace administration.
- Production-grade database persistence for all product entities.
- Full Brand Kit management and every brand-guideline option.
- Full multi-format image/video generation or autonomous video generation.
- Live social account OAuth connections.
- Publishing or scheduling to any external social platform.
- Live campaign analytics or conversion attribution.
- Live trend collection or competitor monitoring.
- Predictive ranking, machine learning optimization, A/B testing, or bandit allocation.
- Multi-user collaboration, approval workflows, agency features, or enterprise permissions.
- Production deployment or claims of production readiness.

A feature may be shown as a future capability in a clearly marked roadmap view, but it must not look operational if it is not implemented.

## 0.3 Suggested demonstration journey

The prototype should be demonstrable from start to finish in this order:

1. Open the MarketMind AI dashboard.
2. Create or select a demo Brand Kit.
3. Create or select a product profile and review its details.
4. Start a campaign and select an objective, audience, channel, and tone.
5. Choose **Individual Content** or **Do My Campaign**.
6. Review the draft copy and creative previews.
7. Edit or regenerate where the prototype supports it.
8. Save the draft within the prototype's supported persistence mechanism or create a real export.
9. Explain which parts are functional, which use demo data, and which are planned for later phases.

## 0.4 Deliverables

- An interactive, navigable web prototype.
- A consistent application shell and initial visual design system.
- Brand profile / basic Brand Kit screen.
- Product profile screen.
- Campaign setup and brief review screen.
- Individual Content and Do My Campaign flows.
- Creative preview with at least one brand-aware template-based visual.
- A clearly labelled demo-data strategy and isolated mock adapter, if mocks are needed.
- A short guide-demo script and a list of feedback/questions for the project guide.
- A prototype limitations list showing what is not yet connected or implemented.

## 0.5 Exit criteria — Phase 0 is complete only when

- [x] The application starts using the documented local development commands (FastAPI on 8000, Vite on 5173).
- [x] The main prototype journey can be completed without broken navigation.
- [x] A user can enter and review brand information.
- [x] A user can enter and review product information.
- [x] A user can prepare a campaign brief.
- [x] Both campaign modes are distinguishable and demonstrable (Individual Content vs Do My Campaign).
- [x] The prototype displays coherent copy and creative previews linked to the selected brand/product context.
- [x] At least one template-based creative preview visibly uses the brand/product information entered by the user (HeroProductCard, PromoSplitBanner, MinimalQuoteCard).
- [x] Demo or mock content is clearly labelled and cannot be mistaken for live AI/provider output.
- [x] No external publishing, live analytics, or live trend capability is falsely represented as working.
- [x] Main screens work at the agreed desktop presentation size and a narrower responsive width.
- [x] Basic tests or documented manual checks cover the prototype's main user journey (4 pytest tests + 6 vitest tests passing).
- [ ] The project guide has been shown the prototype and feedback has been recorded (Pending guide demonstration).
- [ ] The project owner approves moving to Phase 1 (Pending project owner decision; Phase 0 remains active).

## 0.6 Phase 0 handover

Before Phase 1 begins, record:

- Guide feedback and approved changes.
- Screens and workflows accepted for the MVP.
- Any changes to the PRD or architecture, with reasons.
- Which prototype components can be retained and which are explicitly temporary.
- Known defects and limitations.
- The approved first MVP implementation slice.

Do not automatically discard the prototype. Reuse working components where they meet the architecture and coding rules. Refactor only when needed and document any breaking change.

---

# Phase 1 — Core Usable Product (MVP)

**Goal:** Turn the validated prototype into a usable product with a complete, persistent workflow from user and brand setup to saved, reusable, and exportable campaign assets.

This phase corresponds to **Phase 1 — Core usable product (MVP)** in `PRD.md`.

## 1.1 In scope

### A. Foundation

- Implement user authentication and a basic personal workspace.
- Establish PostgreSQL persistence, SQLAlchemy models, Alembic migrations, and validated API contracts.
- Implement backend ownership checks for every private resource.
- Implement structured logging, configuration management, error handling, and health checks appropriate to the MVP.
- Establish automated backend and frontend test foundations.

### B. Core brand and product workflows

- Implement full Brand Kit create, read, update, and delete/archive workflows required by the PRD.
- Persist brand voice, identity description, messaging, colors, logo, and supported brand assets.
- Implement product/service profile management and association with a brand.
- Store uploaded media through the storage adapter, with ownership and file validation.
- Ensure user-approved brand and product facts are not silently overwritten by AI suggestions.

### C. Campaign planning and generation

- Implement campaign creation, editing, and draft persistence.
- Implement campaign objectives, audience, channel, message, and selected formats.
- Implement Individual Content mode.
- Implement Do My Campaign mode with coordinated draft assets.
- Implement caption, headline, hook, CTA, and hashtag generation through configured AI provider adapters.
- Implement initial static creative generation using configured image-generation services and/or branded templates.
- Implement carousel slide concepts or template-based carousel assets where feasible.
- Limit video work to template-based concepts, scripts, storyboards, or a small feasible rendering workflow; autonomous video generation is not an MVP requirement.
- Allow user review, editing, regeneration, and explicit approval of generated content.

### D. Asset and cross-platform export

- Implement asset metadata, ownership, campaign association, and version preservation.
- Implement selected platform/placement presets for dimensions, aspect ratios, copy length, and format rules.
- Keep source assets and adapted assets distinguishable.
- Implement real download/export for supported content types.
- Ensure reopening a saved campaign restores its saved brief and assets.

## 1.2 Explicitly out of scope

- Live publishing and scheduling integrations; these belong to Phase 2.
- Live platform analytics; these belong to Phase 2.
- Market trend collection and competitor intelligence; these belong to Phase 3.
- Predictive performance ranking, bandit optimization, and automatic creative selection.
- Full autonomous video generation.
- Enterprise/agency roles, billing, and extensive multi-team administration.

The application must remain useful without social-platform credentials. Export is the complete fallback for this phase.

## 1.3 Deliverables

- Authenticated web application with personal workspace.
- Persistent Brand Kit and Product Profile modules.
- Persistent Campaign Planner.
- Working Individual Content and Do My Campaign flows.
- Configured AI text generation and a supported visual-generation/template workflow.
- Asset library with basic campaign organization and version safety.
- Selected cross-platform adaptation presets and real export/download.
- API and data contracts documented in code and API documentation.
- Automated tests for core services, API routes, authorization, and main frontend flows.

## 1.4 Exit criteria — Phase 1 is complete only when

- [ ] A test user can sign up/sign in and access their own workspace.
- [ ] A user can create, save, retrieve, and update a Brand Kit.
- [ ] A user can create and retrieve a product/service profile linked to a brand.
- [ ] A user can create and save a campaign brief.
- [ ] Individual Content mode generates the requested content type.
- [ ] Do My Campaign mode creates a coordinated draft package.
- [ ] AI provider failures produce clear errors and preserve user inputs and existing assets.
- [ ] Users can review, edit, regenerate, approve, and save assets without accidental data loss.
- [ ] A user can close the session, sign in again, reopen a campaign, and retrieve its assets.
- [ ] Supported assets can be exported or downloaded as real files.
- [ ] Backend authorization prevents access to another user's private records.
- [ ] All demo fixtures and development mocks remain clearly separated from live product data.
- [ ] The first end-to-end MVP acceptance criteria in `PRD.md` pass.
- [ ] The project owner approves moving to Phase 2.

---

# Phase 2 — Integrations and Measurement

**Goal:** Connect MarketMind AI to a verified set of external social platforms and display real campaign performance information returned by authorized integrations.

This phase corresponds to **Phase 2 — Integrations and measurement** in `PRD.md`.

## 2.1 In scope

### A. Platform capability verification

- Select target platforms based on project value, available developer access, account eligibility, API permissions, and implementation effort.
- Maintain a platform capability matrix covering account types, permissions, supported media, publishing operations, scheduling operations, insight metrics, review requirements, rate limits, and known restrictions.
- Do not expose a platform operation in the UI until its actual provider flow and required permissions are verified.

### B. Account connection and publishing

- Implement official authorization flows such as OAuth where provided by the platform.
- Store provider credentials securely using the approved credential-storage approach.
- Implement account connection status, token refresh/reconnection, revocation handling, and permission checks where supported.
- Implement publishing and scheduling through platform adapters for the verified capabilities only.
- Require explicit user confirmation for every external publishing/scheduling action.
- Use idempotency or duplicate-protection controls where the provider permits them.
- Record provider response, publish status, timestamps, target account, and sanitized errors.
- Preserve manual export as a fallback for unsupported operations.

### C. Analytics and measurement

- Retrieve platform insights only for connected, eligible accounts with the required permissions.
- Normalize returned metrics while retaining source-specific definitions and provenance.
- Track source, post/campaign reference, reporting period, retrieval time, and metric availability.
- Build a dashboard for verified metrics such as reach, impressions, views, engagement, clicks, and conversions only when supported by the connected source and tracking setup.
- Display missing, delayed, unsupported, or permission-restricted metrics clearly.
- Compare campaigns or creatives only where metric definitions and reporting windows are sufficiently comparable.
- Keep imported, demo, simulated, and live metrics explicitly separated.

## 2.2 Explicitly out of scope

- Universal publishing to all social platforms.
- Unsupported media or account types.
- Paid-ad budget management and cross-channel conversion attribution unless separately scoped and authorized.
- Claims of guaranteed reach, sales, conversion, or return on ad spend.
- Market trend intelligence and advanced recommendations; these belong to Phase 3.

## 2.3 Deliverables

- Documented platform capability matrix.
- At least one fully verified publishing integration, with additional integrations added only when feasible and approved.
- Secure account connection and reconnection workflow.
- Publishing/scheduling job flow with genuine provider statuses and error handling.
- Analytics ingestion and normalized metric storage for supported sources.
- Dashboard showing only verified data with source and period context.
- Integration tests using provider-approved test facilities and manual verification with an eligible account where required.

## 2.4 Exit criteria — Phase 2 is complete only when

- [ ] Every enabled platform integration has documented capabilities and restrictions.
- [ ] OAuth/authorization and credential handling have been reviewed for security.
- [ ] Publishing is shown as successful only after provider confirmation.
- [ ] Failed, pending, expired, revoked, and unsupported states are handled correctly.
- [ ] Duplicate publish attempts are mitigated with the provider's available safeguards.
- [ ] At least one supported publishing flow has been verified with a real eligible account or the provider's accepted production-equivalent verification process.
- [ ] Every displayed live metric is traceable to an authorized source and reporting period.
- [ ] Unsupported metrics are shown as unavailable, not fabricated.
- [ ] Demo metrics cannot be confused or mixed with live metrics.
- [ ] The project owner approves moving to Phase 3.

---

# Phase 3 — Market Intelligence and Optimization

**Goal:** Add evidence-backed market and competitor insights, then use brand context, trend evidence, and available campaign history to create explainable recommendations.

This phase corresponds to **Phase 3 — Market intelligence and optimization** in `PRD.md`.

## 3.1 In scope

### A. Market Trend Intelligence

- Identify and approve permitted, documented trend sources and access methods.
- Implement source adapters that normalize trend observations and retain provenance.
- Store trend topic/name, category, source reference, observation time, detection time, freshness, and supporting evidence where available.
- Implement topic categorization, deduplication, and semantic consolidation where useful.
- Where time-series data exists, calculate growth relative to a defined baseline and document the calculation window and method.
- Distinguish emerging activity from evergreen popularity or a one-off spike.
- Present trend summaries as model-generated interpretations, separate from directly observed source data.
- Disclose source coverage, sampling limitations, and last-updated time.

### B. Competitor Analysis

- Allow users to define competitors and permitted public source references.
- Collect only information available through approved, permitted sources.
- Store observations with source and observation date.
- Summarize publicly observable messaging, product positioning, visible offers, and creative patterns.
- Distinguish sourced observations from AI interpretation.
- Do not infer private metrics, budgets, sales, or audience information as facts.

### C. Explainable AI Recommendation Engine

- Assemble relevant brand, product, campaign, trend, and available performance context.
- Recommend testable creative directions such as messaging hooks, content formats, layouts, CTAs, and campaign adjustments.
- Include the reason for each recommendation and its supporting evidence or input references.
- Begin with transparent rules and statistical comparisons where data is limited.
- Allow users to accept, dismiss, save, or act on a recommendation.
- Record recommendation status and subsequent observable outcomes where available.
- Separate measured performance, source-derived observations, model estimates, and heuristic suggestions.

### D. Controlled creative experimentation — conditional extension

- Define an experiment only when the product has a suitable objective, trackable outcome, enough eligible traffic, and permission to run it.
- Begin with simple, controlled variant comparisons and a documented baseline.
- Consider learned ranking or adaptive allocation only when sufficient relevant and permissioned historical data exists.
- Evaluate candidate-set recall, final selected-variant quality, and experimentation cost where the data supports those measures.
- Do not automatically deploy a predicted winner based solely on an offline score.
- Require user approval and respect platform experimentation constraints.

The concepts of trend burst detection and enrichment are informed by the Snapchat trend-detection paper. Performance-guided candidate generation and adaptive testing are informed by the Meta offline-to-online creative optimization paper. These papers inform design choices; they do not prove that MarketMind AI's implementation will produce the same results.

## 3.2 Explicitly out of scope unless separately approved

- Training a large foundation model from scratch.
- Claiming platform-wide trend detection from a limited set of sources.
- Unauthorized scraping, private account access, or bypassing platform restrictions.
- Guaranteed prediction of campaign success or conversion outcomes.
- Fully autonomous campaign changes or publishing without user approval.
- Complex multi-armed bandit optimization where data volume and experimentation access are insufficient.

## 3.3 Deliverables

- Documented source registry and data-access limitations.
- Trend collection, normalization, freshness, and evidence workflow.
- Trend intelligence interface with traceable source records.
- Competitor observation workflow using permitted public/authorized sources.
- Explainable recommendation workflow combining brand context, trend evidence, and available historical performance.
- A documented evaluation dataset, baseline, and evaluation protocol.
- Optional creative experimentation workflow, only if data and platform access meet the prerequisites.

## 3.4 Exit criteria — Phase 3 is complete only when

- [ ] Every trend source is documented and permitted for the implemented use.
- [ ] Every displayed trend has evidence/provenance or is explicitly labelled as a hypothesis.
- [ ] Trend freshness, observation window, and source limitations are visible.
- [ ] Duplicate topics and broad/noisy topics are handled according to documented rules.
- [ ] Competitor observations identify their source and observation date.
- [ ] Competitor interpretations are not presented as verified private facts.
- [ ] Each recommendation includes its rationale and supporting inputs.
- [ ] Heuristic scores are not presented as measured probabilities or guaranteed outcomes.
- [ ] Recommendations can be accepted, dismissed, or saved by the user.
- [ ] Evaluation compares the recommendation workflow with a defined baseline.
- [ ] Any experiment or adaptive allocation feature meets its data, traffic, consent, and platform prerequisites.
- [ ] The project owner approves the complete feature scope and final evaluation report.

---

## 4. Cross-phase quality gates

The following quality requirements apply throughout development. They are not postponed until the final phase.

### 4.1 Code quality and architecture

- A feature must live in its domain module.
- Routes/controllers remain thin; business logic lives in service functions.
- Database operations live behind repositories or the approved persistence boundary.
- Provider-specific code lives behind adapters.
- Functions should have one clear responsibility, descriptive names, typed inputs/outputs, and explicit side effects.
- Shared code must have real reuse; avoid dumping unrelated logic into `utils.py`, `helpers.py`, or giant service files.
- Each phase must preserve the established repository structure unless an approved architecture change is recorded.

### 4.2 Security and data integrity

- Validate user input, uploaded files, AI responses, and external API responses.
- Enforce resource ownership and workspace authorization on the backend.
- Keep secrets out of source code and logs.
- Use migrations for database schema changes.
- Preserve user-approved content and prior asset versions.
- Use UTC timestamps for persisted times and explicit time-zone conversion for display/scheduling.
- Treat external content and model output as untrusted data.

### 4.3 Testing and observability

- Add tests with each feature; do not leave all testing to the end.
- Test success, validation failure, authorization failure, provider failure, and retry behavior where relevant.
- Use structured, sanitized logs and correlation/job IDs for asynchronous work.
- Do not log secrets, tokens, passwords, or sensitive user content unnecessarily.
- Keep the application runnable after each completed task.

### 4.4 Product truth

- Label prototype/demo data clearly.
- Do not mix mock and live records.
- A generated asset is successful only after a real provider or renderer produces and stores a valid output.
- A publishing operation is successful only after a provider confirms it.
- A live metric must have source and period metadata.
- A trend must be traceable to permitted evidence or labelled as a hypothesis.
- A recommendation must distinguish facts, inferences, and heuristics.

---

## 5. Phase execution protocol for Antigravity

Antigravity and other coding agents MUST follow this procedure for every implementation task.

1. **Confirm the active phase.** Read this file and identify the currently approved phase. If no active phase is explicitly stated, do not assume permission to start the next phase.
2. **Read requirements.** Inspect the relevant PRD requirements, architecture section, and rules before editing.
3. **Inspect the repository.** Review the current folder structure, relevant files, Git status/diff, dependencies, and tests. Never assume the repository is empty.
4. **Propose a bounded change.** List the files/modules to be created or changed, the functions involved, expected behavior, and tests. Keep the plan limited to the task.
5. **Implement incrementally.** Make small, reviewable changes. Do not rewrite unrelated modules or generate the entire application in one pass.
6. **Validate.** Run the relevant tests, type checks, linting, and application startup checks available in the repository.
7. **Summarize.** Report what changed, files touched, commands/tests run, results, known limitations, and any decision required from the project owner.
8. **Wait at phase gates.** Do not begin the next phase until the current phase's exit criteria are reviewed and the project owner explicitly approves progression.

### 5.1 Change-control requirements

- Any change to phase scope, technology baseline, architecture, database ownership model, authentication, permissions, external publishing behavior, or data provenance requires explicit project-owner approval.
- Update the relevant document when an approved decision changes a requirement or design.
- Do not silently mark an incomplete feature as complete.
- Do not delete or replace working functionality to satisfy a new visual or structural preference without documenting the impact and obtaining approval where necessary.

---

## 6. Project completion criteria

MarketMind AI can be considered complete for the agreed project scope when:

- The Phase 1 end-to-end MVP acceptance criteria in `PRD.md` pass.
- Approved Phase 2 integrations are verified and their actual capability limits are documented.
- Approved Phase 3 trend, competitor, and recommendation workflows have source/evidence tracking and a documented evaluation.
- Security, authorization, data integrity, error handling, and tests have been reviewed across implemented modules.
- The application can be deployed using documented configuration and setup instructions.
- The project includes a final demonstration, limitations statement, and evaluation report.

Completion does not require implementing items marked future scope or capabilities that lack necessary data, permissions, or platform access. Any such items must be documented honestly as limitations or future work.

---

## 7. Change log

| Version | Date | Change |
|---|---|---|
| 1.0 | 12 November 2026 | Initial roadmap. Added a guide-ready prototype as Phase 0 and retained the PRD's three delivery phases for MVP, integrations/measurement, and market intelligence/optimization. |
