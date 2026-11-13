# MarketMind AI — System Architecture

**Version:** 1.0  
**Status:** Development baseline  
**Last updated:** 12 November 2026  
**Parent document:** `PRD.md`  
**Companion document:** `rules.md`

---

## 1. Purpose and authority

This document defines the technical structure of MarketMind AI: application boundaries, modules, data flow, persistence, integrations, and security boundaries. `PRD.md` defines **what** the product must do; this document defines the recommended structure for **how** it is built. `rules.md` defines implementation conventions that all contributors and coding agents must follow.

### Decision priority

1. Explicit, current instruction from the project owner.
2. `PRD.md` for product requirements and scope.
3. `architecture.md` for system structure and approved technical choices.
4. `rules.md` for coding and agent behavior.
5. Existing working code and tests, which must be inspected and preserved unless an approved change says otherwise.

If two sources conflict, do not silently guess. Report the conflict and request a decision. A later approved decision should be recorded in the relevant document.

## 2. Architecture principles

- **Modular monolith first:** one frontend application, one backend application, one primary relational database. Keep modules isolated internally; do not introduce microservices for the MVP.
- **Function-first code:** small, named, typed functions with one clear responsibility. Avoid giant components, controllers, utility files, and service methods.
- **Explicit boundaries:** UI, API routes, business logic, persistence, AI providers, storage, and platform integrations must not be mixed.
- **Provider independence:** external AI and social platforms are accessed through adapters, never directly from feature code.
- **Evidence and provenance:** metrics, trends, competitor observations, and recommendations retain their source and time/context.
- **Secure by default:** server-side ownership checks, validated inputs, protected secrets, and explicit approval for external actions.
- **Incremental delivery:** the MVP must work without publishing or live analytics credentials. Export is the fallback.

## 3. Recommended technology baseline

Use this baseline for a new repository. If the repository already has a working stack, inspect it first and preserve it. A stack change requires explicit approval and a documented migration plan.

| Layer | Recommended baseline | Responsibility |
|---|---|---|
| Frontend | React + TypeScript + Vite | Web interface and client-side interaction |
| Backend | Python + FastAPI | Versioned HTTP API and application orchestration |
| Validation | Pydantic | Request, response, and AI-output validation |
| ORM / database access | SQLAlchemy 2.x | Typed persistence and queries |
| Database | PostgreSQL | Durable product data and job/metric records |
| Migrations | Alembic | Versioned database schema changes |
| Background work | Redis + RQ worker, behind a job interface | Long-running generation and integration tasks |
| File storage | S3-compatible object storage; local MinIO for development | Uploaded and generated files |
| Testing | Pytest; Vitest and React Testing Library | Backend and frontend tests |
| Local services | Docker Compose where useful | Repeatable local development |

Do not add a package or service just because it is listed here. Add it only when the corresponding capability is being implemented. Keep provider/model choices in configuration; this architecture does not mandate a specific LLM, image model, or social platform.

## 4. High-level system view

```text
Browser
  └── React + TypeScript
        ├── Feature pages / components / hooks
        └── Typed API client
              │ HTTPS / JSON
              ▼
        FastAPI application
          ├── API routes (HTTP only)
          ├── Authentication / authorization
          ├── Feature services (business rules)
          ├── Repositories (database access)
          ├── Provider adapters
          │     ├── Text / image AI
          │     ├── Social platforms
          │     ├── Trend / competitor sources
          │     └── Object storage
          └── Job dispatcher
                │
                ▼
           Redis queue → Worker → Feature services / adapters

Persistence:
  PostgreSQL: users, workspaces, brands, products, campaigns,
              assets, jobs, connections, publishing, metrics,
              trends, competitors, recommendations, experiments

  Object storage: uploaded files, logos, product images,
                  generated images, exports
```

The backend is the trust boundary. The browser must never call privileged provider APIs with server secrets or make authorization decisions on behalf of the server.

## 5. Repository structure

Keep the repository recognizable and shallow. The following is the target structure for a greenfield implementation; adapt names to the existing repository without duplicating equivalent folders.

```text
marketmind-ai/
├── frontend/
│   ├── src/
│   │   ├── app/                 # app shell, routes, providers
│   │   ├── features/            # one folder per product feature
│   │   │   ├── auth/
│   │   │   ├── brands/
│   │   │   ├── products/
│   │   │   ├── campaigns/
│   │   │   ├── content/
│   │   │   ├── creative/
│   │   │   ├── publishing/
│   │   │   ├── analytics/
│   │   │   ├── trends/
│   │   │   ├── competitors/
│   │   │   ├── recommendations/
│   │   │   └── assets/
│   │   ├── shared/
│   │   │   ├── api/              # API client, error mapping
│   │   │   ├── components/       # reusable UI primitives
│   │   │   ├── hooks/            # genuinely shared hooks
│   │   │   ├── lib/              # small pure helpers
│   │   │   └── types/
│   │   └── styles/
│   └── tests/
│
├── backend/
│   ├── app/
│   │   ├── main.py               # app construction only
│   │   ├── api/v1/               # route registration / versioned routers
│   │   ├── core/                 # config, auth, permissions, logging
│   │   ├── db/                   # session, base, migrations support
│   │   ├── modules/               # domain modules (one folder per feature)
│   │   │   ├── brands/
│   │   │   ├── products/
│   │   │   ├── campaigns/
│   │   │   ├── content/
│   │   │   ├── creative/
│   │   │   ├── publishing/
│   │   │   ├── analytics/
│   │   │   ├── trends/
│   │   │   ├── competitors/
│   │   │   ├── recommendations/
│   │   │   └── assets/
│   │   ├── integrations/
│   │   │   ├── ai/
│   │   │   ├── social/
│   │   │   ├── trend_sources/
│   │   │   └── storage/
│   │   ├── jobs/                 # queue setup and worker entry points
│   │   └── common/               # shared errors, result types, constants
│   ├── migrations/
│   └── tests/
│
├── docs/
│   ├── PRD.md
│   ├── architecture.md
│   └── rules.md
├── .env.example
├── docker-compose.yml            # only if local services need it
└── README.md
```

### 5.1 Standard backend feature module

Each backend domain module should use this structure when the module needs the relevant layer:

```text
brands/
├── router.py       # HTTP endpoints; no business rules
├── schemas.py      # Pydantic request / response contracts
├── models.py       # SQLAlchemy entities for this module
├── repository.py   # database queries only
├── service.py      # use-cases / business rules
└── dependencies.py # module-specific dependency wiring, if needed
```

Do not create empty files just to match the tree. Add a file when there is real code for that responsibility. Small modules may combine closely related items, but must preserve the boundaries.

### 5.2 Standard frontend feature module

```text
brands/
├── pages/          # route-level screens
├── components/     # brand-specific UI
├── hooks/          # feature state and reusable UI behavior
├── api.ts          # typed calls to backend endpoints
├── schemas.ts      # client validation where useful
└── types.ts        # feature-specific types
```

A feature must not duplicate the global API client, authentication logic, or shared UI primitives.

## 6. Domain modules and responsibilities

| Module | Owns | Must not own |
|---|---|---|
| Auth / Workspace | Identity, session, workspace membership, access rules | Brand or campaign business logic |
| Brands | Brand profile, visual identity, brand assets metadata | Provider credentials or generated campaign output |
| Products | Product/service facts and product image references | Campaign execution logic |
| Campaigns | Campaign brief, objective, audience, channel selection, workflow status | Direct AI-provider calls |
| Content | Text content, variants, editing and approval state | Image file bytes or platform tokens |
| Creative | Image/design generation orchestration and creative metadata | Direct publication to social platforms |
| Assets | File metadata, ownership, versions, export operations | Brand or campaign decisions |
| Publishing | Authorized account connections, publish jobs, schedules, status | Campaign generation or secret handling in UI |
| Analytics | Normalized metrics and reporting windows | Fabricated metrics or unsupported attribution |
| Trends | Trend observations, score, source, freshness, enrichment | Brand-specific recommendation decisions |
| Competitors | User-selected competitor references and permitted observations | Unauthorized scraping or private account data |
| Recommendations | Explainable suggestions and supporting evidence references | Untraceable or automatic external actions |
| Experiments | Candidate set, allocation, outcomes, experiment status | Unapproved production experimentation |

Feature services may call another module's public service interface. They must not reach into another module's private repository or ORM internals.

## 7. Function-first implementation model

This project should be easy to navigate and debug by searching for a function name.

### 7.1 Layer responsibilities

- **Router/controller:** parse HTTP input, call one service function, map the result to an HTTP response.
- **Schema:** validate and serialize data; no database calls or business decisions.
- **Service/use-case:** implement one business operation and coordinate repositories/adapters.
- **Repository:** perform database reads/writes; no prompt construction or business policy.
- **Adapter:** translate the application's internal contract to/from an external provider.
- **Pure helper:** deterministic transformation with no I/O, suitable for direct unit testing.

### 7.2 Naming pattern

Use explicit verb + object names. Examples:

```python
create_brand()
get_brand_by_id()
update_brand_identity()
archive_product()
create_campaign_draft()
build_generation_context()
generate_caption_variants()
validate_generated_copy()
create_creative_job()
get_generation_job_status()
adapt_asset_for_platform()
request_publish_confirmation()
submit_publish_job()
normalize_platform_metrics()
calculate_trend_growth()
consolidate_trend_topics()
match_trend_to_brand()
create_recommendation()
```

Avoid vague names such as `process_data()`, `handle_all()`, `do_ai()`, `manager()`, or `utils()`.

### 7.3 Function contract

Every non-trivial function should have:

- One responsibility and a descriptive name.
- Typed parameters and a typed return value.
- A clear side-effect profile (pure, database, external API, filesystem, or queue).
- Explicit error behavior.
- A short docstring when intent or constraints are not obvious.

Prefer small composable functions. Split a function when it has multiple reasons to change, multiple unrelated side effects, or too many branches. Do not split code into meaningless one-line wrappers.

## 8. Core data model and relationships

The full database schema should be maintained separately if it becomes substantial. This section defines the minimum conceptual relationships from the PRD.

```text
User ──< WorkspaceMembership >── Workspace
Workspace ──< Brand ──< BrandAsset
Brand ──< Product
Brand ──< Campaign >── Product (optional)
Campaign ──< ContentAsset ──< AssetVersion
ContentAsset ──< GenerationJob
Workspace ──< PlatformConnection ──< PublishJob
Campaign / ContentAsset ──< PerformanceMetric
Trend ──< TrendEvidence
Competitor ──< CompetitorObservation
Recommendation ──< RecommendationEvidence
Campaign ──< Experiment ──< ExperimentArm / ExperimentOutcome
```

Rules:

- Every private record must be scoped to a workspace or have an explicit owner relationship.
- Use stable UUIDs (or the repository's established stable ID type) for externally referenced records.
- Store timestamps in UTC; convert to the user's timezone only for display and schedule input/output.
- Use foreign keys and indexes for ownership, relationship, status, and frequently queried time fields.
- Use soft deletion/archive for entities whose history or child records must remain available.
- Store file bytes in object storage, not as large binary database columns; store metadata and object keys in PostgreSQL.
- Store provider tokens encrypted or in a suitable secrets vault; store only a credential reference in ordinary application records.
- Keep live, imported, simulated, and demo metrics explicitly distinguishable.

## 9. API design

- Prefix backend endpoints with `/api/v1`.
- Use resource-oriented nouns and HTTP methods; use action endpoints only for explicit workflow actions.
- Validate all request bodies, path parameters, and query parameters with typed schemas.
- Return consistent response shapes and consistent error codes; do not expose stack traces or provider secrets.
- Paginate list endpoints; enforce page-size limits and stable ordering.
- Use idempotency keys for operations that may be retried, especially publishing and job creation.
- Do not expose internal ORM models directly as API responses.
- Keep endpoint handlers thin; business logic belongs in services.

Example endpoint map (illustrative contracts, not proof that endpoints already exist):

| Method | Endpoint | Purpose |
|---|---|---|
| GET / POST | `/api/v1/brands` | List / create brands |
| GET / PATCH / DELETE | `/api/v1/brands/{brand_id}` | Read / update / archive a brand |
| GET / POST | `/api/v1/products` | List / create products |
| GET / POST | `/api/v1/campaigns` | List / create campaigns |
| POST | `/api/v1/campaigns/{campaign_id}/generate` | Start campaign generation job |
| GET | `/api/v1/jobs/{job_id}` | Read job status |
| GET / POST | `/api/v1/assets` | List / register asset metadata |
| POST | `/api/v1/publishing/jobs` | Request an approved publish/schedule job |
| GET | `/api/v1/analytics/campaigns/{campaign_id}` | Retrieve available campaign metrics |
| GET | `/api/v1/trends` | List stored, sourced trend observations |
| GET | `/api/v1/recommendations` | List explainable recommendations |

Do not implement every endpoint at once. Implement only the endpoints required by the current approved feature milestone.

## 10. AI provider architecture

All model access must go through a provider adapter and a feature-level service. Feature code must not instantiate SDK clients directly.

```text
Feature service
  └── AI capability interface
        └── Provider adapter
              └── External model API
```

Define capability-level contracts such as:

- `TextGenerationProvider.generate_text(request) -> TextGenerationResult`
- `ImageGenerationProvider.generate_image(request) -> ImageGenerationResult`
- `ImageUnderstandingProvider.describe_image(request) -> ImageDescriptionResult`

The actual interfaces may be adjusted to the selected provider, but callers should depend on application-level contracts, not vendor response shapes.

Required behavior:

- Provider name/model, timeout, retry policy, and limits come from validated configuration.
- Validate structured model output against a Pydantic schema before persistence or display.
- Store generation job status, safe input metadata, output reference, provider/model identifier, timings, and sanitized failure details.
- Never persist secrets in prompts, logs, job payloads, or model output.
- Treat uploaded text, external web content, and model responses as untrusted input; do not execute them as code or instructions.
- Retry only transient failures, with bounded attempts and backoff. Do not blindly retry non-idempotent external actions.
- Track token/image usage and estimated cost when the provider exposes enough data.
- Keep generated output as draft until user approval.

## 11. External integration architecture

### 11.1 Social platforms

Each platform must implement a common application-facing adapter, for example:

```python
connect_account()
refresh_connection()
get_capabilities()
validate_publish_request()
publish_content()
schedule_content()
get_publish_status()
fetch_insights()
```

Only implement methods supported by the actual provider. Unsupported capabilities must return an explicit `not_supported` result; do not create fake success behavior.

Maintain a capability matrix per platform: eligible account types, permissions, supported media, publishing/scheduling operations, insight metrics, rate limits, review requirements, and known restrictions.

Publishing flow:

1. User chooses connected account, asset, destination, and time/action.
2. Backend checks ownership, connection status, permissions, capability, and asset constraints.
3. User confirms the exact external action.
4. Backend creates an idempotent publish job.
5. Adapter submits the request and stores the verified provider response.
6. UI displays pending, published, failed, or unavailable based on actual job/provider state.

Never request social-media passwords. Never mark content published before provider confirmation.

### 11.2 Trend and competitor sources

Each source adapter must return normalized observations with:

- Source identifier and source reference/URL where available.
- Observed topic/entity/content and category.
- Observation/collection time and freshness.
- Source coverage or sampling notes when known.
- Evidence references supporting the observation.

A trend score must identify its method and data window. Do not describe a narrow source sample as a complete view of the market. Do not infer competitor private metrics.

### 11.3 Storage

Use a storage adapter for upload, download, delete, and signed URL generation. Validate file type, file size, content ownership, and authorization before serving files. Use short-lived signed URLs for private objects where supported.

## 12. Background jobs and state handling

Long-running AI generation, media processing, trend collection, and platform operations should use persisted jobs when appropriate.

Minimum job state machine:

```text
queued → running → succeeded
                 ↘ failed
                 ↘ cancelled (only where cancellation is supported)
```

Rules:

- Persist job status and timestamps in PostgreSQL.
- Queue messages should contain identifiers and minimal non-sensitive data, not secrets or large files.
- Workers load the record, re-check authorization and current state, then execute the task.
- Use idempotency/deduplication for retryable jobs.
- Record sanitized errors and a correlation ID.
- Preserve user inputs and previous successful versions when a job fails.
- Do not mark a job successful until its outputs are stored and validated.

## 13. Security architecture

- Enforce authentication and workspace/resource authorization on the backend for every protected operation.
- Use centralized permission dependencies such as `require_authenticated_user()` and `require_workspace_access()`; resource services must still verify that referenced records belong to the authorized workspace.
- Keep secrets in environment variables or a secrets manager. Commit only `.env.example` with placeholder values.
- Encrypt provider credentials at rest and restrict access to the integration service that needs them.
- Use HTTPS in deployed environments; configure CORS for known frontend origins only.
- Validate file uploads by extension, MIME type, size, and actual file signature where practical; randomize storage object names.
- Prevent SQL injection through parameterized ORM/query APIs; avoid string-built SQL from user input.
- Prevent XSS by using safe rendering and sanitization for user/model-generated rich text; never render raw model HTML as trusted code.
- Protect state-changing browser requests against CSRF when cookie-based authentication is used.
- Apply rate limits to authentication, generation, upload, and integration endpoints.
- Do not log passwords, access/refresh tokens, API keys, private prompts containing sensitive information, or raw authorization headers.
- Provide token revocation/disconnection and user-data deletion workflows.

## 14. Observability and diagnostics

Use structured logs with fields such as `request_id`, `job_id`, `workspace_id` (non-sensitive internal identifier), `module`, `operation`, `status`, and duration. Avoid logging full user content unless specifically necessary and approved.

Track at minimum:

- API request failures and latency.
- AI generation success/failure, latency, and usage where available.
- Job queue depth, retries, and failed jobs.
- Publishing outcomes by provider and capability.
- Analytics/trend-source retrieval failures and freshness.
- Authorization denials and suspicious repeated failures.

Errors returned to the frontend must be safe and actionable. Detailed exceptions belong in protected server logs, with secrets and personal data removed.

## 15. Testing architecture

- **Unit tests:** pure functions, validation, permissions, business rules, normalization, ranking/scoring logic.
- **Repository tests:** database queries, ownership filters, transactions, and constraints.
- **API tests:** authentication, authorization, request validation, response contracts, and error behavior.
- **Adapter contract tests:** provider request/response mapping using fixtures or mocks; clearly distinguish these from live integration verification.
- **Integration tests:** real database/queue/storage interactions in a controlled test environment.
- **End-to-end tests:** critical journeys from brand setup through campaign asset export.
- **Security tests:** cross-workspace access attempts, invalid file uploads, secret leakage checks, and publish authorization checks.

A mocked provider test does not prove that a live provider integration works. Live integration status must be documented separately.

## 16. Deployment shape

For the MVP, deploy a small set of independently startable processes that share the same codebase:

1. Frontend static/web application.
2. FastAPI backend.
3. Background worker (only when durable jobs are enabled).
4. PostgreSQL.
5. Redis (when the queue is enabled).
6. S3-compatible object storage.

Use separate development, test, and production configuration. Do not commit credentials or production data. Add health/readiness checks for the backend and worker. Back up the database and important object storage according to the chosen hosting provider's capabilities.

## 17. Decisions to finalize before production deployment

The following decisions remain configuration/deployment choices, not established product capabilities:

- Authentication/session provider and exact authentication mechanism.
- Hosting provider and production object-storage service.
- AI text, image-generation, and image-understanding providers/models.
- First verified social publishing and analytics integrations.
- Permitted trend and competitor data sources.
- Usage quotas, rate limits, and cost budgets.
- Production retention, backup, and deletion policies.

Do not fabricate credentials, API scopes, account permissions, provider endpoints, or successful integration states. Verify current provider documentation and record the verified capability before implementation.

## 18. Change log

| Version | Date | Change |
|---|---|---|
| 1.0 | 12 Nov 2026 | Initial modular-monolith architecture and function-first structure. |
