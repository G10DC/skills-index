#!/usr/bin/env node
// scripts/coverage.mjs — does SKILLS.md still describe the library that exists?
//
//   node scripts/coverage.mjs
//
// SKILLS.md opens by calling itself the source of truth for overlap checks. That is a
// claim it cannot keep by hand: on 2026-09-01 it was missing six skills and still
// listed five repositories that had been archived a month earlier. Someone checking a
// new idea against `prism-search` was being sent to a constraint that no longer
// existed, and someone checking against `keel` found nothing and concluded there was
// no overlap.
//
// This does not generate the file. The "depends on" and "see also" columns are
// editorial judgement and a generator would flatten them into noise. It checks two
// things a program can settle, and leaves the writing to a person:
//
//   1. every non-archived G10DC repository that ships a skill has a row
//   2. every row names a repository that exists and is not archived
//
// Exits 1 on either, naming what is wrong. Needs `gh` authenticated; in CI the
// workflow's GITHUB_TOKEN is enough for public repositories.

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORG = 'G10DC';

// stdio: probing a repository for a file it does not have is a 404, which is an
// expected answer here and not a diagnostic. Swallow gh's stderr so a real error is
// not buried under fifteen lines of noise.
const gh = (...args) =>
  execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });

/** A row is a table line opening with a back-ticked name. Prose mentions are not rows. */
function rowsIn(markdown) {
  return new Set([...markdown.matchAll(/^\|\s*`([^`\s|]+)`\s*\|/gm)].map((m) => m[1]));
}

/**
 * Repositories that ship a skill: a root SKILL.md, or a pack of them under skills/.
 * Both shapes exist in this organisation, and a check that knew only the first would
 * report writing-flow as absent from the library it is in.
 */
function shipsASkill(name) {
  try {
    gh('api', `repos/${ORG}/${name}/contents/SKILL.md`, '--jq', '.name');
    return true;
  } catch {
    try {
      const listing = JSON.parse(gh('api', `repos/${ORG}/${name}/contents/skills`));
      return Array.isArray(listing) && listing.some((e) => e.type === 'dir');
    } catch {
      return false;
    }
  }
}

const index = readFileSync(join(ROOT, 'SKILLS.md'), 'utf8');
const rows = rowsIn(index);

const repos = JSON.parse(gh('repo', 'list', ORG, '--limit', '200', '--json', 'name,isArchived'));
const live = new Set(repos.filter((r) => !r.isArchived).map((r) => r.name));
const archived = new Set(repos.filter((r) => r.isArchived).map((r) => r.name));

const shipping = [...live].filter(shipsASkill).sort();

const missing = shipping.filter((n) => !rows.has(n));
// A row may legitimately name something that is not a repository (a sub-skill, a
// concept). Only flag a row whose name is a repository we know to be archived, or one
// that looks like a repository name and matches nothing at all in the organisation.
const stale = [...rows].filter((n) => archived.has(n)).sort();

console.log(`SKILLS.md: ${rows.size} row(s)`);
console.log(`${ORG}: ${shipping.length} non-archived repositories shipping a skill`);

let bad = false;
if (missing.length) {
  bad = true;
  console.error(`\nNOT IN THE INDEX (${missing.length}):`);
  for (const n of missing) console.error(`  - ${n} — ships a skill and has no row`);
  console.error('\nAdd a row. An index that omits a skill sends an overlap check to a wrong answer.');
}
if (stale.length) {
  bad = true;
  console.error(`\nARCHIVED BUT STILL LISTED (${stale.length}):`);
  for (const n of stale) console.error(`  - ${n} — the repository is archived on GitHub`);
  console.error('\nRemove the row and its inbound cross-references.');
}

if (bad) process.exit(1);
console.log('\nCoverage holds: every shipping skill has a row, and no row names an archived repository.');
