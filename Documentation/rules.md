# MarketMind AI — Engineering and Coding-Agent Rules

**Version:** 1.0  
**Status:** Mandatory development rules  
**Last updated:** 12 November 2026  
**Applies to:** Developers, Antigravity, and any AI coding agent

---

## 1. Purpose

These rules keep MarketMind AI understandable, modular, secure, testable, and easy to debug. The code must be concise without hiding behavior. Every feature should be identifiable by its module and its named functions.

## 2. Read before coding

Before every task, the coding agent MUST:

1. Read the relevant requirements in `PRD.md`.
2. Read the relevant architecture decisions in `architecture.md`.
3. Follow this `rules.md`.
4. Inspect the existing files, dependencies, tests, and Git changes related to the task.
5. Identify the smallest set of files and functions that need to change.

Do not recreate, restructure, rename, or replace working code just because a different layout is preferred. Do not overwrite user changes. If a requirement is unclear or documents conflict on security, data integrity, external actions, or architecture, stop and report the exact ambiguity before making a risky assumption.

## 3. Non-negotiable project rules

- Build a **modular monolith** unless the project owner explicitly approves a different architecture.
- Keep frontend, API routes, business logic, repositories, integrations, and background jobs separate.
- Use small, reusable, clearly named functions.
- Keep one source of truth for shared business rules, types, configuration, and provider capabilities.
- Validate all untrusted input, including AI output and external API responses.
- Enforce authentication and authorization on the backend, not only in the UI.
- Keep secrets out of source code, frontend bundles, logs, prompts, screenshots, and Git history.
- Require explicit user approval for publishing or any other external action.
- Never fake a successful AI generation, upload, publication, analytics retrieval, trend detection, or integration connection.
- Clearly label development mocks and sample data; never mix them with real user data or live metrics.
- Do not add future-scope features before the approved MVP workflow works end to end.

## 4. Code organization rules

### 4.1 One module, one domain

Keep each feature's code inside its feature/domain folder. Examples: brand logic belongs in `brands`, publishing logic belongs in `publishing`, and trend scoring belongs in `trends`.

A module may expose a small public service interface. Other modules must call that interface rather than importing its private repository or database model directly.

### 4.2 Function-first design

- A function MUST perform one identifiable task.
- Prefer descriptive `verb_object` names in Python and `verbObject` names in TypeScript.
- Use explicit input and output types for non-trivial functions.
- Separate pure calculations from I/O and external side effects.
- Keep route handlers and UI event handlers thin; delegate work to service functions/hooks.
- Split functions that have multiple unrelated responsibilities, excessive branching, or multiple independent side effects.
- Do not create meaningless wrappers or split every single line into a separate function. Reuse should have a real purpose.
- Avoid giant files. Split by feature and responsibility before a file becomes difficult to navigate.

Good names:

```python
create_brand()
get_brand_by_id()
validate_brand_ownership()
build_campaign_context()
generate_caption_variants()
validate_generated_copy()
create_generation_job()
normalize_insight_metrics()
calculate_trend_growth()
match_trend_to_brand()
```

Avoid names such as:

```python
process_data()
handle_request()
run_all()
do_ai()
common_helper()
```

### 4.3 Side-effect boundaries

Every function should make it obvious whether it:

- Calculates or transforms data only.
- Reads from or writes to the database.
- Calls an AI or external provider.
- Reads/writes a file or object store.
- Enqueues or executes a job.

Do not hide network requests, database writes, or filesystem operations inside generic helpers or model properties.

### 4.4 No dumping-ground files

- Do not put unrelated functions into `utils.py`, `helpers.py`, `common.py`, or one giant `services.py`.
- Shared code belongs in a shared module only when at least two real consumers need it and the behavior is genuinely common.
- Keep constants and configuration separate from business logic.
- Avoid circular imports. Shared contracts should live in a neutral contracts/types location.

## 5. Backend rules

### 5.1 Layer responsibilities

| Layer | Allowed responsibility | Must not do |
|---|---|---|
| `router.py` | HTTP input/output, dependency injection, status codes | Business logic, direct provider SDK calls, complex database queries |
| `schemas.py` | Input/output validation and serialization | Database access, network calls |
| `service.py` | One business use-case and orchestration | Vendor-specific SDK logic or unrelated feature ownership |
| `repository.py` | Database queries and persistence | Prompt construction, HTTP response handling |
| `models.py` | Database entities and relationships | API orchestration or external calls |
| `integrations/*` | Provider-specific request/response translation | Product workflow decisions outside the adapter contract |

### 5.2 Backend conventions

- Use type hints for function parameters and return values.
- Use Pydantic schemas at API and AI-output boundaries.
- Use SQLAlchemy through repositories; never build SQL by concatenating user input.
- Keep transactions explicit and short. Do not hold a database transaction open during a slow AI or social-platform request.
- Use dependency injection for database sessions, authenticated users, and provider adapters.
- Use a single consistent error/result convention. Translate internal errors to safe HTTP responses at the API boundary.
- Do not use bare `except:`. Catch specific expected exceptions, log safe context, and re-raise or return a defined failure result.
- Do not return ORM objects directly from endpoints.
- Add pagination and bounded limits to list endpoints.
- Apply workspace/resource ownership filters in every repository query that reads or mutates private records.
- Create database migrations for schema changes; never edit production schema manually.

Example thin route:

```python
@router.post("/brands", response_model=BrandResponse)
def create_brand_endpoint(
    payload: BrandCreate,
    user: CurrentUser = Depends(get_current_user),
    service: BrandService = Depends(get_brand_service),
) -> BrandResponse:
    return service.create_brand(user_id=user.id, payload=payload)
```

The example is illustrative. Follow the repository's actual sync/async conventions consistently; do not mix them casually.

## 6. Frontend rules

- Use TypeScript; avoid `any`. Use `unknown` at uncertain boundaries, then validate/narrow it.
- Keep pages responsible for layout and composition, not complex business rules.
- Put feature-specific UI in the feature folder and genuinely shared UI in `shared/components`.
- Put API calls in feature API modules or a typed API client, not scattered through components.
- Keep server state separate from temporary UI state. Do not duplicate the same server record in several unrelated global stores.
- Use reusable form schemas and validation where appropriate.
- Components should be small enough to understand independently; extract repeated or logically distinct sections.
- Handle loading, empty, success, error, and disabled states explicitly.
- Do not display a success notification until the server/provider confirms success.
- Never put provider secrets, access tokens, or privileged API keys in frontend environment variables or browser code.
- Render model-generated content as untrusted text. Do not use unsafe HTML rendering for model output.

## 7. Naming conventions

| Item | Convention | Example |
|---|---|---|
| Python file / module | `snake_case` | `brand_service.py` |
| Python function / variable | `snake_case` | `create_campaign()` |
| Python class | `PascalCase` | `CampaignService` |
| TypeScript function / variable | `camelCase` | `createCampaign()` |
| React component | `PascalCase` | `CampaignCard` |
| TypeScript type / interface | `PascalCase` | `CampaignResponse` |
| Constant | `UPPER_SNAKE_CASE` | `MAX_UPLOAD_BYTES` |
| API route | plural resource nouns | `/api/v1/campaigns` |
| Database table | repository convention; use consistent plural `snake_case` if greenfield | `campaign_assets` |
| Test | name behavior under test | `test_user_cannot_read_other_workspace_brand` |

Prefer domain-specific identifiers over ambiguous names such as `data`, `item`, `result2`, or `temp` when the value has a meaningful business role.

## 8. Security rules

Security checks are required at every trust boundary.

### 8.1 Identity and authorization

- Authenticate every protected API request.
- Verify workspace membership and record ownership on the server for every read, update, delete, export, and external action.
- Never trust a `user_id`, `workspace_id`, `brand_id`, or account ID supplied by the browser without checking it against the authenticated user.
- Prevent insecure direct object reference (IDOR) by scoping queries to authorized workspaces.
- Apply least privilege. A user should receive only the permissions required for the requested operation.

### 8.2 Secrets and tokens

- Read secrets from environment variables or a secrets manager.
- Commit only placeholder entries in `.env.example`; never commit real `.env` files.
- Encrypt provider access/refresh tokens at rest and limit code paths that can decrypt them.
- Never return tokens or secrets in API responses.
- Redact authorization headers, cookies, keys, passwords, and sensitive prompt data from logs.
- If a secret is accidentally committed or exposed, treat it as compromised: stop, notify the project owner, rotate/revoke it, and remove it from active use. Deleting the line alone is not sufficient.

### 8.3 Input and file safety

- Validate types, sizes, lengths, enum values, and required relationships on the server.
- Sanitize filenames and generate random storage object names.
- Check file extension, MIME type, size, and file signature where practical.
- Reject unexpected file formats and oversized uploads.
- Store uploads outside the public web root; use authorization checks or short-lived signed URLs for private files.
- Treat user-provided URLs as untrusted. Validate scheme, host, redirects, and destination to reduce SSRF risk; block localhost, private-network, and cloud metadata destinations unless specifically required and safely controlled.

### 8.4 AI and external content safety

- Treat prompts, uploads, retrieved pages, model responses, and provider responses as untrusted data.
- Do not execute generated code, SQL, shell commands, HTML, URLs, or tool instructions from model output.
- Do not allow external content to override system/developer instructions or authorization policy.
- Validate AI structured output against an explicit schema; reject or repair invalid output through a bounded process.
- Keep brand/product facts grounded in user-supplied or verified information. Mark suggestions as suggestions.
- Do not generate or publish unsupported price, discount, certification, ingredient, guarantee, performance, or competitor claims as facts.
- Recommendations must include their rationale, evidence/source references, and whether they are observed, inferred, estimated, or heuristic.

### 8.5 External actions

- Require explicit user confirmation for publishing, scheduling, account changes, or other externally visible actions.
- Check ownership, platform capability, permission status, asset constraints, and current connection status immediately before submission.
- Use idempotency keys where supported to prevent duplicate publishing on retries.
- Store the verified provider response and expose the actual state: queued, pending, published, failed, or unsupported.
- Never infer successful publication from a successful local database write or job enqueue.

## 9. AI and provider integration rules

- Provider SDKs are allowed only inside `integrations/` adapters.
- Feature services use application-level provider interfaces, not vendor SDK objects.
- Keep provider, model, endpoint, timeout, and retry settings in validated configuration.
- Do not hard-code model names throughout the codebase.
- Use structured prompts with explicit context sections and expected output schemas.
- Send only the minimum context required for the task; do not mix data from different workspaces or brands.
- Bound prompt size, output size, retries, and provider timeouts.
- Record safe job metadata, provider/model identifier, status, timing, and sanitized error information.
- Track usage/cost where supported and enforce configurable limits before expensive jobs.
- A mocked provider is for development/testing only and must be labelled. It must never masquerade as a live provider in a user-facing production environment.

## 10. Database and data integrity rules

- Use stable identifiers and foreign keys for related records.
- Store timestamps in UTC.
- Keep ownership/workspace scope explicit.
- Use migrations for every schema change.
- Preserve data on failed AI/provider jobs; write new asset versions rather than silently overwriting approved assets.
- Distinguish draft, approved, scheduled, published, failed, archived, demo, and live states where relevant.
- Keep source and retrieval timestamps for trend, competitor, and analytics observations.
- Store metric name, value, unit, source, reporting window, and retrieval time; do not compare incompatible metrics as if equivalent.
- Do not silently delete child records. Define archive/cascade behavior deliberately and test it.
- Avoid storing large files in the relational database; store file metadata and secure object references.

## 11. Error handling and logging

- Handle expected failures explicitly: validation, authorization, not-found, provider timeout, rate limit, invalid provider response, storage failure, and job failure.
- Return safe, actionable error messages to the user; keep internal stack traces on the server only.
- Preserve user input and existing saved work after failures.
- Use structured logs and correlation IDs for requests and jobs.
- Never log secrets or unnecessary personal data.
- Do not swallow exceptions or return fabricated fallback success data.
- Retry only transient failures with bounded exponential backoff and jitter where suitable.
- Do not retry non-idempotent external actions unless an idempotency/reconciliation strategy exists.

## 12. Testing rules

Every meaningful feature change must include tests appropriate to its risk.

- **Unit:** pure functions, validators, business rules, text/metric normalization, scoring, and permission helpers.
- **Repository:** ownership filters, queries, transactions, and data constraints.
- **API:** success, validation failures, authentication, authorization, and error responses.
- **Adapter:** request/response mapping, timeouts, rate limits, and provider error handling using fixtures/mocks.
- **Integration:** database, object storage, worker, and queue interactions.
- **End-to-end:** critical user journey affected by the change.
- **Security:** cross-workspace access, IDOR, malicious uploads, secret leakage, and unauthorized publishing.

Minimum checks before a task is considered complete:

1. Relevant tests pass.
2. Type checking and linting pass where configured.
3. Build succeeds where applicable.
4. The changed user journey is manually or automatically verified.
5. Any untested provider behavior is explicitly reported as unverified.

Do not delete or weaken a test simply to make a change pass. Fix the implementation or explain the test conflict.

## 13. Dependency and configuration rules

- Inspect existing dependencies before adding new ones.
- Prefer the standard library or an existing dependency when sufficient.
- Add a new dependency only when it provides a clear capability that is not already available.
- Pin or constrain dependencies using the repository's established package-management convention.
- Document new environment variables in `.env.example` and the setup guide.
- Validate required configuration at application startup and fail with a clear message if critical configuration is missing.
- Never place secrets or environment-specific URLs in source constants.

## 14. UI and product-truth rules

- A feature is not complete merely because its UI exists.
- Do not show publishing, analytics, trends, competitors, or AI results as live unless backed by a verified source/provider response.
- Label demo/sample data clearly and keep it isolated from real accounts and metrics.
- Show the source and freshness of market/competitor observations where available.
- Show uncertainty and limitations for recommendations; do not promise outcomes.
- Keep generated content as draft until user approval.
- Confirm destructive or externally visible actions.
- Provide a manual export path when direct publishing is unavailable.

## 15. Change-management protocol for Antigravity

For each task, the agent MUST follow this sequence:

### Before editing

1. Restate the requested outcome in one or two lines.
2. Inspect relevant files and current Git status.
3. Identify the requirements and modules involved.
4. List the smallest intended file/function changes.
5. Note assumptions, risks, and any unresolved blocker.

### While editing

1. Make focused, incremental changes.
2. Reuse existing patterns and shared functions.
3. Do not rewrite unrelated files or perform broad formatting churn.
4. Do not change public API contracts or database structure without an explicit need and migration.
5. Keep mocks and development-only shortcuts isolated and visibly labelled.

### After editing

1. Run relevant tests, lint, type checks, and build commands discovered in the repository.
2. Inspect the final diff for accidental deletions, secrets, unrelated changes, and generated files.
3. Verify the changed workflow and failure paths.
4. Update documentation if architecture, environment variables, endpoints, data models, or behavior changed.
5. Report what changed, the files/functions touched, the checks run, results, and remaining limitations.

### Stop and ask before

- Replacing the frontend/backend framework or database.
- Introducing microservices or a new infrastructure platform.
- Changing authentication, authorization, token storage, or workspace boundaries.
- Deleting/migrating user data or changing core relationships.
- Enabling a social platform integration or external action that has not been verified.
- Adding a paid provider or material recurring cost.
- Changing the product scope or implementing a future-scope feature at the expense of the MVP.

## 16. Definition of done

A task is complete only when:

- It satisfies the relevant PRD requirement and architecture boundary.
- Code is placed in the correct feature/module and uses clear, reusable functions.
- Inputs and outputs are typed and validated at appropriate boundaries.
- Authorization and error handling are implemented where relevant.
- Tests and configured quality checks pass, or failures are clearly reported.
- No unrelated working behavior or user data has been damaged.
- Documentation and `.env.example` are updated when needed.
- No fake success state, secret exposure, or unverified integration claim remains.

## 17. Change log

| Version | Date | Change |
|---|---|---|
| 1.0 | 12 Nov 2026 | Initial coding, modularity, security, testing, and Antigravity rules. |
