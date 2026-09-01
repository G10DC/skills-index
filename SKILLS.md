# g10dc — Skills Index

Canonical map of the g10dc skill library. Read this file **first**, before designing or
modifying any skill — it is the source of truth for overlap checks (Fase 1).

Update this file whenever a skill is published, renamed, deprecated, or gets a new
`When NOT to use` cross-reference. Re-sync the project after every update.

---

## Agent Skills (SKILL.md canon: name + description, MIT, portable Claude Code / Antigravity)

> **Primitives are verified against the code, not the docs.** Every path in the
> `exposed primitives` column below was read from the repository on 2026-08-24 (GitHub
> contents API / local clone), not carried over from a design note. Skills marked
> *documentary* ship no executable module at all: they are instructions an agent loads,
> which is a valid kind of skill, not a gap. Regenerate this column before trusting it:
> a stale primitive path makes callers import functions that do not exist.

| skill | one-line purpose | exposed primitives (verified) | depends on | see also |
|---|---|---|---|---|
| `chisel` | In-flight context compression & pruning | `lib/`: `compress.js`, `memory.js`, `output.js`, `precision.js`, `reads.js`, `symbols.js` | — | `portage`, `chronicle-session-memory` |
| `bonsai` | Code minimalism, YAGNI ladder enforcement | `scripts/ground.mjs` (also `run.mjs`, `guardrail.mjs`, `benchmark.mjs`) — **`scripts/`, not `lib/`** | scan primitive (see note) | `trellis` |
| `trellis` | Dependency graph & blast-radius analysis | `lib/`: 13 modules — `extract.js` (`buildGraph`), `graph.js` (`blastRadius`, `reachability`, `stats`, `dangling`, `scc`), `ast.js`, `gate.js`, `pr.js`, … **no `cli.mjs`; not a CLI** | `acorn` (npm) | `cartographer` |
| `loom` | Phase-gate workflow state machine | `lib/engine.js` (`createRun(intent, opts)`, `advance`, `runToCompletion`, `serialize`) + `phases.js`, `gates.js`, `adapters.js`, `budget.js`, `checkpoint.js`, `store.js`, `ux.js` | — | `shipwright`, `portage` |
| `warden` | Trust boundary, prompt-injection defense, audit hash-chain | **documentary** — `SKILL.md` + `docs/`, `refs/`; no `lib/` | — | `sentinel-egress-guard` (outbound counterpart) |
| `siege` | Authorized, sandboxed penetration testing | `lib/recon.js` | — | `mirror`, `lookout` |
| `sieve` | Idempotent, schema-validated ETL pipelines | **documentary** — `SKILL.md` + `refs/`; no `lib/` | — | `schema-lineage` |
| `scribe` | Schema-validated OCR extraction & repair | **documentary** — `SKILL.md` + `refs/`; no `lib/` | — | `alembic` (consumer) |
| `beacon` | Changelog generation from conventional commits | `lib/beacon.js` → `BeaconGenerator#parseCommits`, `#generateChangelog` | `pulse` (sequential, see note) | `pulse` |
| `pulse` | Code quality / health score synthesis | `lib/pulse.js` → `PulseSynthesizer#synthesize` | `mirror`, `lookout` (dynamic import); `forge` score supplied by caller | `beacon` |
| `cartographer` | Visual architecture diagram generation | `lib/cartographer.js` | `trellis` (graph source, see note) | `trellis` |
| `mirror` | Pre-commit multi-perspective code review | `lib/mirror.js` → `MirrorReviewer#reviewDiff` | — | `lookout`, `siege` |
| `lookout` | Dependency security & license audit | `lib/lookout.js` → `LookoutAuditor#auditPackageJson` | — | `mirror`, `siege` |
| `anchor` | OpenAPI → Express boilerplate codegen | `lib/anchor.js` | — | `strata` |
| `alembic` | Academic text distillation into study guides | `scripts/`: `extract.py`, `chunk.py`, `merge.py`, `coverage.py` — **`scripts/`, not `lib/`** | **`scribe`** (OCR delegated, not reimplemented) | `scribe` |
| `writing-flow` | Five writing skills: rough idea → spec → draft → handoff | `skills/`: `brief`, `scope-steps`, `prompt-eval`, `ship`, `handoff` (SKILL.md each); `lib/skill-contract.mjs` → `checkSkillContract(dir, opts)` | — | `loom` |
| `keel` | Trust boundary, step dispatcher, tamper-evident audit log | `src/`: `trust.mjs` (`separateInstructionData(messages) -> {instructions, data}`), `dispatcher.mjs`, `provider.mjs`, `store.mjs`, `sandbox.mjs`, `agent.mjs`, `mcp.mjs`, `cli.mjs` — **`src/`, not `lib/`** | — | `warden` (documents these primitives and ships none) |
| `almanac` | Financial seasonality & market-cycle inference | `scripts/almanac.py` plus `scripts/engine/`: `seasonality.py`, `cycles.py`, `statistics.py`, `backtest.py`, `forecaster.py`, `risk.py`, `spreads.py`, `data.py`, `reporter.py` — **`scripts/`, not `lib/`** | — | — |
| `harvester` | Polite, schema-validated web scraping | `scripts/harvester.py` — **`scripts/`, not `lib/`** | — | `sieve` (raw/staged/curated layout convention only; no shared code) |
| `spark` | Creative ideation & cross-domain synthesis | `spark/`: `engine.py`, `lenses.py`, `exporter.py`, `schema.py`, `skills_matrix.py`; entry point `scripts/ideate.py` | — | `loom` |
| `yt-digest` | YouTube transcript, frame selection & digest publishing | `lib/`: `yt-digest.js`, `make_pdf.py`, `make_html_pdf.py` — **mixed JS and Python in one `lib/`** | — | `alembic` |
| `skills-index` | This file: the canonical map of the library | **documentary** — `SKILL.md` + `SKILLS.md`; no `lib/` | — | — |
| `portage` | Context handoff & clean agent restart | **documentary** — `SKILL.md` + `assets/` | — | `chisel`, `chronicle-session-memory` |

> **None of these skills is a CLI.** No repository in this table ships a shebang, a
> `main`-guard, or a `bin` field in `package.json`. They are ES-module libraries (or plain
> documentation) meant to be imported by an agent or a host harness. A caller that shells
> out to them gets nothing; a caller that imports them must know the export name, which is
> why the column above lists classes and methods rather than file names alone.

## Infrastructure (libraries — deliberately outside the SKILL.md naming canon)

> **Naming policy note:** repos in this category are consumed *by* skills, they are not
> themselves skills, and are exempt from the one-word/metaphor naming rule in Fase 3. This is a
> deliberate distinction, not an inconsistency — document any new infra repo here explicitly so
> it isn't mistaken for a naming-canon violation.

| repo | role | entry module (verified) | consumed by |
|---|---|---|---|
| `chronicle-session-memory` | Session checkpointing & state hashing | `lib/chronicle.js` | `portage`, `loom` |
| `artisan` | Pedagogical layout & HTML/Katex rendering | `lib/`: `artisan.js`, `srs.js`, `tts.js` | `alembic`, reporting flows |
| `tombstone` | Dead-code AST analysis | `lib/tombstone.js` → `TombstoneHunter#findDeadCodeCandidates(trellisIndex)` | `trellis`, `smith-ast-codemod` |
| `schema-lineage` | SQL parsing & data lineage mapping | `lib/schema-lineage.js` | `sieve` |
| `strata` | Cross-service RPC/gRPC contract topology | `lib/strata.js` | `anchor` |
| `archaeologist` | Zero-checkout Git history / temporal coupling mining | `lib/archaeologist.js` → `ArchaeologistAnalyzer#analyzeGitHistory(dir, limit)` | `trellis`, `pulse` |
| `git-researcher` | Automated repo discovery via agent cascades | `src/` (no `lib/`) | — |
| `forge-mutation-tester` | Mutation testing / test-suite strength | `lib/forge.js` → `runMutationTests(sourceFile, testCommand)` — **first argument is a file, not a directory** | `pulse` |
| `smith-ast-codemod` | AST-based refactoring engine | `lib/smith.js` | `trellis`, `tombstone`, `bonsai` |
| `shipwright` | Repo scaffolding, Husky/Commitlint/ESLint hooks | `lib/shipwright.js` → `validateCommitMessage`, `runSafetyCheck`, `generateBoilerplate`, … | `loom` |
| `sentinel-egress-guard` | Outbound network firewall for sandboxes | `lib/sentinel.js` → `SentinelGuard#activate` / `#deactivate` — **stateful: pair every activate with a deactivate** | `lookout` (post-execution gate) |

## Practice / Legacy (not indexed for overlap checks)

`Engammo`, `Python`, `ProvaGit` — experimental/learning repos, excluded from Fase 1 sovrapposizione checks.

---

## Known cross-reference debt (tracked, not yet fixed in source)

These pairs share an axis of overlap and need an explicit `When NOT to use` line in **both**
directions once their `SKILL.md` files are next touched:

- `trellis` ↔ `cartographer` — same underlying dependency graph at two different scopes
  (file / diagram render). `cartographer` should consume `trellis index` output rather than
  parsing independently.
- `warden` ↔ `sentinel-egress-guard` — trust boundary in vs. out. Complementary, not overlapping,
  but undocumented as such.
- `sieve` ↔ `schema-lineage` — data pipeline vs. data lineage. Adjacent domain, distinct golden
  rule; needs explicit disambiguation once `schema-lineage` is evaluated for promotion to a
  full skill.
- `anchor` ↔ `strata` — contract generation vs. contract discovery. Same domain, opposite
  direction; same treatment as `sieve`/`schema-lineage` above.

## Changelog

- **2026-09-01**: removed five repositories from the Infrastructure table —
  `prism-llm-router`, `atlas-workspace-orchestrator`, `prism-search`, `hydra` and
  `artisan-chat`, all archived on GitHub. Four were retired on 2026-08-31 as covered by
  `Grep`, `trellis` and the shell. An index that lists an archived repository as a live
  dependency is worse than an index with a hole in it: a reader checking for overlap
  against `prism-search` finds a design constraint that no longer exists. Their inbound
  cross-references went with them — `trellis`'s see-also, `git-researcher`'s consumer, and
  the `trellis ↔ atlas ↔ cartographer` debt item, now a pair.
  Added `writing-flow`, published the same day.

  **Not fixed here, and worth stating rather than leaving to be discovered:** this file
  claims to be canonical and is not complete. `keel`, `almanac`, `harvester`, `spark`,
  `yt-digest`, `strata`, `siege` and others are either missing or appear only as a
  dependency of something else. The primitives column carries a date for exactly this
  reason; the coverage does not, and should.

- **2026-08-24**: realigned every `exposed primitives` entry with the code. Nine of sixteen
  Agent Skills listed primitives that do not exist — `mirror` was documented as `security.js`
  (real: `lib/mirror.js`), `pulse` as `quality.js` (`lib/pulse.js`), `lookout` as `licenses.js`
  (`lib/lookout.js`), `beacon` as `changelog.js` (`lib/beacon.js`), `cartographer` as
  `diagrams.js`, `anchor` as `api.js`, `trellis` as a `cli.mjs` that was never there, and
  `warden` as `keel` when it ships no module at all. `sieve` and `scribe` were listed with
  `etl.js` / `ocr.js` but are documentary. `bonsai` and `alembic` live under `scripts/`, not
  `lib/`. Added entry modules to the Infrastructure table and stated explicitly that none of
  these repos is a CLI, since that assumption produces callers that shell out and get nothing.
- **Previous**: added cross-references for `chisel`/`portage`/`chronicle-session-memory`,
  `mirror`/`lookout`/`siege`; fixed `alembic` to delegate OCR to `scribe` instead of
  reimplementing it; documented the Infrastructure naming-policy exception.
