# g10dc — Skills Index

Canonical map of the g10dc skill library. Read this file **first**, before designing or
modifying any skill — it is the source of truth for overlap checks (Fase 1).

Update this file whenever a skill is published, renamed, deprecated, or gets a new
`When NOT to use` cross-reference. Re-sync the project after every update.

---

## Agent Skills (SKILL.md canon: name + description, MIT, portable Claude Code / Antigravity)

| skill | one-line purpose | exposed primitives | depends on | see also |
|---|---|---|---|---|
| `chisel` | In-flight context compression & pruning | `compress.js`, `memory.js`, `precision.js`, `output.js` | — | `portage`, `chronicle-session-memory` |
| `bonsai` | Code minimalism, YAGNI ladder enforcement | `ground.mjs` | scan primitive (see note) | `trellis` |
| `trellis` | Dependency graph & blast-radius analysis | `cli.mjs` (impact/index/pr) | — | `atlas-workspace-orchestrator`, `cartographer` |
| `loom` | Phase-gate workflow state machine | `engine.js` | — | `shipwright`, `portage` |
| `warden` | Trust boundary, prompt-injection defense, audit hash-chain | `keel` | — | `sentinel-egress-guard` (outbound counterpart) |
| `siege` | Authorized, sandboxed penetration testing | `recon.js` | — | `mirror`, `lookout` |
| `sieve` | Idempotent, schema-validated ETL pipelines | `etl.js` | — | `schema-lineage` |
| `scribe` | Schema-validated OCR extraction & repair | `ocr.js` | — | `alembic` (consumer) |
| `beacon` | Changelog generation from conventional commits | `changelog.js` | `pulse` (sequential, see note) | `pulse` |
| `pulse` | Code quality / health score synthesis | `quality.js` | `forge-mutation-tester` (see note) | `beacon` |
| `cartographer` | Visual architecture diagram generation | `diagrams.js` | `trellis` (graph source, see note) | `trellis` |
| `mirror` | Pre-commit multi-perspective code review | `security.js` | — | `lookout`, `siege` |
| `lookout` | Dependency security & license audit | `licenses.js` | — | `mirror`, `siege` |
| `anchor` | OpenAPI → Express boilerplate codegen | `api.js` | — | `strata` |
| `alembic` | Academic text distillation into study guides | `extract.py`, `chunk.py`, `merge.py`, `coverage.py` | **`scribe`** (OCR delegated, not reimplemented) | `scribe` |
| `portage` | Context handoff & clean agent restart | `handoff-template.md` | — | `chisel`, `chronicle-session-memory` |

## Infrastructure (libraries — deliberately outside the SKILL.md naming canon)

> **Naming policy note:** repos in this category are consumed *by* skills, they are not
> themselves skills, and are exempt from the one-word/metaphor naming rule in Fase 3. This is a
> deliberate distinction, not an inconsistency — document any new infra repo here explicitly so
> it isn't mistaken for a naming-canon violation.

| repo | role | consumed by |
|---|---|---|
| `prism-llm-router` | LLM gateway, load balancer, circuit breaker | all skills, via `artisan-chat` entry point |
| `chronicle-session-memory` | Session checkpointing & state hashing | `portage`, `loom` |
| `artisan-chat` | Agent persona, chat style, accents | entry point for all skills |
| `artisan` | Pedagogical layout & HTML/Katex rendering | `alembic` (rendering study guides), reporting flows |
| `tombstone` | Dead-code AST analysis | `trellis`, `smith-ast-codemod` |
| `schema-lineage` | SQL parsing & data lineage mapping | `sieve` |
| `prism-search` | Hybrid AST + Vector RAG codebase search | `bonsai` (reuse scan), `git-researcher` |
| `strata` | Cross-service RPC/gRPC contract topology | `anchor` |
| `archaeologist` | Zero-checkout Git history / temporal coupling mining | `trellis`, `pulse` |
| `hydra` | Map-reduce summarizer for ultra-large repos | `cartographer`, `alembic` |
| `git-researcher` | Automated repo discovery via agent cascades | `prism-search` |
| `atlas-workspace-orchestrator` | Multi-repo/monorepo dependency crawling | `trellis` (file-level graph reused at workspace scale) |
| `forge-mutation-tester` | Mutation testing / test-suite strength | `pulse` |
| `smith-ast-codemod` | AST-based refactoring engine | `trellis`, `tombstone`, `bonsai` |
| `shipwright` | Repo scaffolding, Husky/Commitlint/ESLint hooks | `loom` |
| `sentinel-egress-guard` | Outbound network firewall for sandboxes | `lookout` (post-execution gate) |

## Practice / Legacy (not indexed for overlap checks)

`Engammo`, `Python`, `ProvaGit` — experimental/learning repos, excluded from Fase 1 sovrapposizione checks.

---

## Known cross-reference debt (tracked, not yet fixed in source)

These pairs share an axis of overlap and need an explicit `When NOT to use` line in **both**
directions once their `SKILL.md` files are next touched:

- `trellis` ↔ `atlas-workspace-orchestrator` ↔ `cartographer` — same underlying dependency graph
  at three different scopes (file / workspace / diagram render). `cartographer` should consume
  `trellis index` output rather than parsing independently.
- `warden` ↔ `sentinel-egress-guard` — trust boundary in vs. out. Complementary, not overlapping,
  but undocumented as such.
- `sieve` ↔ `schema-lineage` — data pipeline vs. data lineage. Adjacent domain, distinct golden
  rule; needs explicit disambiguation once `schema-lineage` is evaluated for promotion to a
  full skill.
- `anchor` ↔ `strata` — contract generation vs. contract discovery. Same domain, opposite
  direction; same treatment as `sieve`/`schema-lineage` above.

## Changelog

- **This update**: added cross-references for `chisel`/`portage`/`chronicle-session-memory`,
  `mirror`/`lookout`/`siege`; fixed `alembic` to delegate OCR to `scribe` instead of
  reimplementing it; documented the Infrastructure naming-policy exception.
