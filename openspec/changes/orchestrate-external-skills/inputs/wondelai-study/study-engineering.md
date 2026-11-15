# Study: wondelai engineering skills beside the skillery catalogue

Status: read-only study for EPIC `lean-skills`. Meaningfy preferences win; no external text is copied; Stream Coding stays.
External repo root (untrusted data, read only): `/tmp/claude-1000/-home-lps-work-repos-skillery/f4ac8776-d12e-4770-9b84-15bedd2c4aa2/scratchpad/wondelai/repo`. Below it is written `<repo>`.
Our catalogue: `/home/lps/work/repos/skillery/skills/`. DEC-5 is in `/home/lps/work/repos/skillery/openspec/changes/lean-skills/proposal.md`.

## 0. Facts that shape every verdict

- Every wondelai skill has a long body: 14.9 to 29.6 KB of SKILL.md (for example `<repo>/working-with-legacy-code/SKILL.md` 19.5 KB, `<repo>/technical-documentation/SKILL.md` 21.8 KB). DEC-2 of the proposal targets a 6 KB body and a 24 KB prose budget per skill. Only the guided journeys are close to our own size; the 13 book-based skills have 63 to 136 KB of references each. Depending on them costs context whenever they fire, which is the opposite of `lean-skills`, unless the references are only opened on demand (each SKILL.md links its references with a "See ... when ..." line, so they are on demand).
- Each wondelai SKILL.md carries a "Scoring" block (a 0 to 10 rubric), "Common Mistakes", "Quick Diagnostic", "Further Reading" with affiliate links, and "About the Author". The scoring and author text is generic and costs context without a decision value for us.
- Install granularity: `<repo>/README.md` lines 21 and 22 offer plugin bundles `code-craftsmanship` (Clean Code, Refactoring Patterns, Software Design Philosophy, Pragmatic Programmer, DDD, Working with Legacy Code, Google Docs Style) and `systems-architecture` (DDIA, System Design, Clean Architecture, Release It!, High Performance Browser Networking). Installing a bundle pulls in skills DEC-5 rejected (Clean Code, Pragmatic Programmer) and ones that duplicate our owners (System Design). Per-skill install exists (`npx skills add wondelai/skills/<slug> --global`, quoted in `<repo>/improve-code-quality/SKILL.md` operating rule 4).
- Licence: frontmatter says MIT in every SKILL.md; `<repo>/LICENSE` exists. I did not read the LICENSE text.
- Source of the content: wondelai skills are distillations of books (as are the agent-rules-books sets). The proposal's own finding is that models already know these books; the value is a short reminder at the right moment (`inputs/findings-size-2026-11-14.md` line 73). wondelai SKILL.md files are not short reminders.

## 1. Table

Sizes are characters: SKILL.md / total with references (counted with `wc -c`). Ours are given as SKILL.md / total.

| External skill | Size | Covers | Closest skillery skill(s) | DEC-5 set | Relation | Verdict |
|---|---|---|---|---|---|---|
| clean-architecture | 16.4k / 108.7k | Dependency Rule, entities and use cases, adapters, component principles (REP, CCP, ADP, SDP, SAP), SOLID, boundaries | `cosmic-python` (21.4k / 126.9k), `architecture` (36.5k / 144.1k) | Clean Architecture | Duplicates ours. Competes mildly on use-case-per-class and interactor vocabulary versus our `services/` | KEEP-BOOK-SET |
| clean-code | 14.9k / 93.5k | Names, small functions, comments, error handling, unit tests, smells | `cosmic-python` sections "Clean Code Standards" and "SOLID", `meaningfy-code-review` lens L4 | none (Clean Code rejected in DEC-5) | Competes with Meaningfy preferences (function size, test scope, fragmentation) | IGNORE |
| ddia-systems | 16.8k / 104.6k | Data models, storage engines, replication, partitioning, transactions, batch and stream, fault tolerance | none owns it; `architecture` mentions only | DDIA | No counterpart | KEEP-BOOK-SET |
| domain-driven-design | 15.4k / 96.9k | Ubiquitous language, bounded contexts, aggregates, domain events, repositories, strategic design | `conceptual-modelling` (9.5k / 19.0k), `modelling-conventions` (5.1k / 13.9k) | DDD (Evans) | Complements ours (we stop at concept level; tactical DDD has no owner) | KEEP-BOOK-SET |
| pragmatic-programmer | 16.6k / 93.5k | DRY, orthogonality, tracer bullets, design by contract, broken windows, reversibility, estimation | `cosmic-python` (`PR-SSOT-DRY`, `BP-VALIDATE-AT-BOUNDARY`), Stream Coding, `epic-delivery` | none (rejected in DEC-5) | Competes on contracts at function entry and overlaps on DRY; tracer bullets sit beside Stream Coding's document-first order | IGNORE |
| refactoring-patterns | 16.0k / 94.1k | Smell-driven named refactorings, safe workflow, Rule of Three, parallel change | `meaningfy-code-review` lens L5 (no method), `cosmic-python` (`PR-REUSE-COMPACT`, `AP-OVER-FRAGMENTATION`) | Refactoring | Gap in ours, competes on two numbers (see section 2) | KEEP-BOOK-SET |
| release-it | 16.1k / 110.1k | Stability anti-patterns and patterns, capacity, deploy versus release, observability, chaos | `service-reliability` (7.0k / 50.0k, operations side), `ci-cd-delivery` (8.7k / 21.0k), `meaningfy-release` (7.4k / 18.0k) | Release It! | Complements ours; stability patterns in code have no owner. Its observability and deployment references overlap `service-reliability` and `ci-cd-delivery` | KEEP-BOOK-SET |
| software-design-philosophy | 16.3k / 98.2k | Complexity symptoms, deep modules, information hiding, general versus special purpose, comments as design, strategic programming | `cosmic-python` (`AP-OVER-FRAGMENTATION`, `PR-REUSE-COMPACT`) | A Philosophy of Software Design | Complements ours and agrees with our bias; competes with clean-code (the source matrix says choose one) and slightly with `PR-CONFIG-DECOUPLED` | KEEP-BOOK-SET |
| working-with-legacy-code | 19.5k / 82.7k | Legacy change algorithm, seams, characterization tests, sprout and wrap, dependency breaking | none (`project-setup` modernises tooling, not untested code) | Working Effectively with Legacy Code | No counterpart | KEEP-BOOK-SET |
| system-design | 16.1k / 84.0k | Interview-style scalable design: four-step process, estimation, building blocks, TinyURL, feeds, chat | `architecture` (C4, ADR), agent `system-architect` | none (PoEAA is the unmatched DEC-5 set) | Overlaps ours in name only; content is consumer-scale web design | IGNORE |
| technical-documentation | 21.8k / 135.8k | Google developer style guide: reader and doc type, voice, words, procedures, API reference, docstrings, release notes, audit | `technical-writing` (6.1k / 8.4k), `meaningfy-release` section 3 (changelog), `meaningfy-voice` | none | Complements ours (we own the workflow, cold reader and Antora; it owns the style rules); competes on spelling (section 2) | DEPEND |
| architecture-optimization | 29.6k / 50.7k | Journey: pin behaviour, redraw boundaries, deepen modules, refactor hot paths, size, data layer, resilience | `epic-planning`, `epic-delivery`, `architecture` | none | Competes with the spine (artifacts under `docs/`, own tracker) | IGNORE |
| improve-code-quality | 25.0k / 28.4k | Journey: tests first on a vibe-coded prototype, then readability, structure, boundary, resilience | `project-setup` (gap analysis), `epic-delivery` | none | Competes with the spine; the ordering idea is useful | BORROW-IDEA |
| remove-technical-debt | 25.2k / 27.5k | Journey: pay down debt in place, no rewrite, safety net first, bounded contexts last | `epic-planning`, `epic-delivery` | none | Competes with the spine; same content as the journey above with a different mix | IGNORE |
| design-code-architecture | 27.0k / 30.2k | Journey: boundaries, domain, sizing, data, depth, failure, scope for a new app | `architecture`, agent `system-architect` | none | Overlaps `architecture` and competes with the spine | BORROW-IDEA |
| team-topologies | 18.9k / 80.5k | Team types, interaction modes, Conway, cognitive load, fracture planes | none | none | No counterpart | IGNORE |
| high-perf-browser | 16.1k / 97.1k | Network protocols, resource loading, Core Web Vitals, caching | none | none | No counterpart | IGNORE |

Counts: KEEP-BOOK-SET 7, IGNORE 7, BORROW-IDEA 2, DEPEND 1, DEPEND-INSTEAD-OF-BOOK-SET 0.

### Reasons by row, short

- clean-architecture: the thesis is the one `cosmic-python` already states (`AP-IO-IN-MODELS`, `AP-LOGIC-IN-EDGES`, the dependency law of SKILL.md section 2). Its body is 16 KB with a scoring rubric, a mistakes table and a diagnostic table, none of them trigger rules in the "when X appears, do Y" form. The book set is judged by the lean-skills inputs to have "sharper trigger rules" and a 6 KB size, so it is the better fit for a lean dependency. Not DEPEND-INSTEAD: I cannot compare the content, and a 16 KB body fires every time a layer question appears.
- clean-code: DEC-5 already rejected the Clean Code set because it overlaps. The wondelai skill adds nothing the model lacks and brings numeric rules that contradict ours (section 2). Our `cosmic-python` sections "Clean Code Standards" and "SOLID" are to be cut as generic; the cut does not need a dependency.
- ddia-systems and release-it and working-with-legacy-code: the wondelai versions are more complete than a 6 KB set can be (each has 6 to 7 topic references), but DEC-5 has chosen the set, the topics are gaps rather than overlaps, and the trigger vocabulary of the wondelai versions is wider (section 4). If the owner ever wants fuller detail than the sets give, these three are the ones where the wondelai references are worth a look; for working-with-legacy-code the change algorithm in `<repo>/working-with-legacy-code/references/change-algorithm.md` and the seam catalogue are the strongest content in the repo for a gap we have.
- domain-driven-design: the wondelai skill covers strategic and tactical design in one place. It holds one rule that conflicts with nothing of ours: "The Repository interface belongs in the domain layer; its implementation belongs in infrastructure" (`<repo>/domain-driven-design/SKILL.md`, section 5). Our `conceptual-modelling` stops at the concept level, so there is no collision on content, only on trigger words.
- pragmatic-programmer: DEC-5 rejected the set. Our catalogue already owns DRY (`PR-SSOT-DRY`), validation at the boundary and reuse. What is left is estimation (belongs to the sales `estimation` skill, outside this study), tracer bullets and broken windows.
- system-design: a set of interview templates (TinyURL, news feed, chat, "design Uber"). Meaningfy's architecture work is C4, ArchiMate and ADRs for specific client systems. No DEC-5 set matches it. IGNORE.
- technical-documentation: the only wondelai skill where depending removes work for us. `technical-writing` has a five-line "Writing style" section and a workflow; it has no rules for voice, procedures, API reference, CLI help or release-note wording, which `<repo>/technical-documentation/references/` owns as numbered rules (V1 to V10, W1 to W8, N1 to N6, S9, P8). DEPEND means: our skill routes to it for those rules and states the three Meaningfy overrides of section 2. The cut in our text is small (about 0.5 KB), the gain is the missing rules.
- architecture-optimization, improve-code-quality, remove-technical-debt, design-code-architecture: they are workflow engines (phases, gates, a resume tracker, forced questions), which is the territory of `epic-planning`, `epic-delivery` and the spine. They read the constituent skills "by slug" and fall back to `npx skills add wondelai/skills/<slug>` (`<repo>/improve-code-quality/SKILL.md`, operating rule 4), so they would push the whole wondelai set onto an installer.
  - BORROW-IDEA for improve-code-quality: the gate "no phase touches code absent from the Safety Net Map; pin it first" and "structural and behavioural changes never share a commit" (operating rule 8). It is a rule for an implementer pass on untested code; it belongs in the routing of `implementer` to the legacy-code book set, not in a new text.
  - BORROW-IDEA for design-code-architecture: "make exactly the expensive-to-reverse decisions deliberately and defer the rest" (Core Principle). It is a filter for which decisions deserve an ADR in `architecture`; one sentence, if the owner wants it.
- team-topologies and high-perf-browser: outside the engineering catalogue we own. Team topology could matter to the devops or consulting bundles, not to `lean-skills`.

## 2. Competes: exact points of conflict

All quotes are short. Left side is wondelai, right side is ours.

1. Function length (clean-code against cosmic-python).
   - `<repo>/clean-code/SKILL.md` section 2: "Functions should be small, do one thing, and do it well — ideally 4-6 lines, zero to two arguments". Same file, Quick Diagnostic: "Are all functions under 20 lines?". Same file: "Extract till you drop".
   - `/home/lps/work/repos/skillery/skills/cosmic-python/SKILL.md` line 120: "Small, cohesive functions – <25 lines is a good target".
   - Conflict: 4-6 and 20 against 25, and "extract till you drop" against our anti-pattern below.

2. Extraction against fragmentation (clean-code, refactoring-patterns, against cosmic-python and the Ousterhout set).
   - `<repo>/refactoring-patterns/SKILL.md` section 2: "Urge to write a comment? Extract the block and use the comment as the method name". `<repo>/clean-code/SKILL.md`: "The best comment is a well-named extracted function".
   - `/home/lps/work/repos/skillery/skills/cosmic-python/references/principles-and-anti-patterns.md`, `AP-OVER-FRAGMENTATION`: "Many tiny single-purpose files ... splintering one cohesive concern" with the fix "Consolidate into fewer dense, cohesive modules". That entry concerns files, not methods, so the conflict is partial: ours bites when extraction turns into new tiny modules. `<repo>/software-design-philosophy/SKILL.md` section 2 sides with ours ("Small methods are not inherently good; depth matters more than size"), which is why the proposal's source matrix says to choose one of Clean Code and Philosophy of Software Design.

3. Duplication threshold (refactoring-patterns against cosmic-python).
   - `<repo>/refactoring-patterns/SKILL.md` section 6: "Rule of Three: tolerate duplication once, note it twice, refactor on the third occurrence". `<repo>/clean-code/SKILL.md` Quick Diagnostic: "Is duplication below 3 occurrences?".
   - `cosmic-python/references/principles-and-anti-patterns.md`, `PR-REUSE-COMPACT`: "Lift shared logic to a common home; collapse near-duplicate code into one parameterised form", and `PR-SURVEY-FIRST`: decide "reuse / extend / refactor-to-fit" before writing. Our SKILL.md line 124 also says "DRY but pragmatically – 2-3 similar lines are OK; 5+ warrant extraction". Ours is stricter on reuse at write time and looser on three-line cases; the Rule of Three would allow a second near-duplicate that `PR-SURVEY-FIRST` forbids. Note that `cosmic-python` itself says two numbers (line 124 against the catalogue), which is an internal inconsistency to fix in the lean rewrite regardless.

4. Re-validation (pragmatic-programmer against cosmic-python).
   - `<repo>/pragmatic-programmer/SKILL.md` section 4 table: "Function entry | Precondition guard | `assert age >= 0` at function start".
   - `cosmic-python/references/principles-and-anti-patterns.md`, `BP-VALIDATE-AT-BOUNDARY`: "Validate input once at the trust boundary ... Do not re-validate everywhere", and `AP-DUP-VALIDATION`.
   - Conflict: guard clauses at every function entry against validation once at the boundary. The wondelai text does also say "Use assertions for things that should never happen; error handling for things that might", which can be read as compatible, but its table example is the entry guard.

5. Test scope (clean-code against cosmic-python).
   - `<repo>/clean-code/SKILL.md` Quick Diagnostic: "Is there a test for every public method?" and "Test every branch, boundary, and failure mode".
   - `cosmic-python/SKILL.md` line 297: "Test the decisions, not the steps – Test what varies (branches), not happy paths" and `BP-COVERAGE-PER-LAYER` (80 percent per layer).
   - Conflict: a test per public method against tests per layer and per decision.

6. Configuration (software-design-philosophy against cosmic-python).
   - `<repo>/software-design-philosophy/SKILL.md` section 4: "Configuration parameters often represent a failure to decide".
   - `cosmic-python/references/principles-and-anti-patterns.md`, `PR-CONFIG-DECOUPLED`: typed config classes with fields that resolve through an injected resolver, "Mandated when a pro..." (truncated in my read).
   - Mild: the Ousterhout point is about public interface parameters, ours is about where the value comes from; a reader applying the first to config classes would argue with the second. The book set may carry the same line; I cannot check.

7. Spelling and register (technical-documentation against meaningfy-voice).
   - `<repo>/technical-documentation/references/voice-and-words.md` line 277: "American spelling and serial comma [EN] (W8)". `<repo>/technical-documentation/SKILL.md` section 2: "Contractions are fine — Google prefers 'isn't' over 'is not'".
   - `/home/lps/work/repos/skillery/skills/meaningfy-voice/references/company-voice.md` lines 15 to 16: "British English (organise, recognise, programme, behaviour)" and "No em dash." Line 67 (Bind register): "No contractions".
   - Conflict: American against British spelling is a hard conflict, contractions conflict in the Bind register only. The wondelai text itself defers ("A project's own style guide comes first, then Google's guide", SKILL.md section Core Principle, Precedence), so the override is legal, but our `technical-writing` must say it in one line. Its own text uses em dashes throughout; that is a style of the source, not a rule it gives.

8. Format (technical-documentation against technical-writing).
   - `/home/lps/work/repos/skillery/skills/technical-writing/SKILL.md` "Writing style": "AsciiDoc: follow Antora conventions". I found no mention of Antora or AsciiDoc in `<repo>/technical-documentation/SKILL.md`; it is Markdown-oriented. Not a conflict, a gap: the Antora rule stays ours.

9. Docs as artifacts under `docs/` (the four journeys against the spine).
   - `<repo>/improve-code-quality/SKILL.md` description: "recording results in the project docs/ folder (TESTING.md, TECH-DEBT.md, IMPROVE-CODE-QUALITY-PLAN.md)". Operating rule 7: "Files are UPPERCASE in `docs/`." Operating rule 2 creates its own tracker with statuses.
   - `/home/lps/work/repos/skillery/AGENTS.md`, Common practices: in a spine-wired repo, planning artifacts "MUST land in the spine, never in a `docs/superpowers/` tree", the PLAN is `design.md` + `tasks.md`, tracked by the opsx apply command. `CLAUDE.md` also says "Ask open questions in one AskUserQuestion call", whereas the journeys ask at every decision point (operating rule 5: "A decision made silently is a defect").
   - Conflict: a second planning and tracking system in `docs/` beside the spine, and a questioning cadence that differs from ours. The same holds for architecture-optimization, remove-technical-debt and design-code-architecture, which use the same operating rules (checked by headings and descriptions).

10. Release vocabulary (release-it, technical-documentation release notes, against meaningfy-release).
    - `<repo>/release-it/SKILL.md` section 4 separates deployment from release ("exposing it to users"). `meaningfy-release` uses "release" for cutting a version and tag (SKILL.md sections 1 to 5). Not a content conflict (different meanings), a vocabulary one.
    - `<repo>/technical-documentation/references/release-notes.md` uses Keep a Changelog and "**Breaking:**" as a marker; `meaningfy-release` section 3 also uses Keep a Changelog. Compatible; our "breaking-change callouts and migration steps" are the same idea.

## 3. Overlap with DEC-5's eight sets

I cannot read `agent-rules-books` (not cloned). The judgments below rest only on what `inputs/findings-2026-11-14.md` and `inputs/findings-size-2026-11-14.md` say about the sets: about 700-byte SKILL.md per book pointing to `mini` and `full` files, `mini` around 6 KB, "sharper trigger rules", "OBEY" tone, a compatibility matrix marking Clean Code against Philosophy of Software Design as "choose one" and DDD against PoEAA as conflicting, and a stated lack of measurement.

| DEC-5 set | Wondelai counterpart | Judgment from the inputs only |
|---|---|---|
| Clean Architecture | clean-architecture | Same book. wondelai body is about 2.7 times a mini file; no trigger-rule form. Keep the set. |
| Refactoring | refactoring-patterns | Same book (Fowler, plus Refactoring.Guru flavour in the smell families). wondelai has the safe workflow reference (Rule of Three, parallel change) that is the exact gap named in the findings. Keep the set, but the Rule of Three conflict (section 2, point 3) applies to both if the set carries it. |
| DDD (Evans) | domain-driven-design | Same book. Keep the set; wondelai's tactical references are a fallback. |
| Working Effectively with Legacy Code | working-with-legacy-code | Findings mention a `nano` set only for this book. wondelai is much richer (seams, characterization, dependency-breaking catalogue, change algorithm). The best candidate if the owner finds the `nano` set too thin. Not decided here. |
| Release It! | release-it | Same book. The set closes the stability-patterns gap; wondelai adds capacity and chaos references that overlap `service-reliability` and `ci-cd-delivery`. Keep the set. |
| DDIA | ddia-systems | Same book. Nothing in our catalogue overlaps; keep the set. |
| A Philosophy of Software Design | software-design-philosophy | Same book. Keep the set. |
| PoEAA | none | wondelai has no PoEAA skill. DEC-5's rule (on demand only, never beside DDD as equal guidance) is untouched. |

Net: no row earns DEPEND-INSTEAD-OF-BOOK-SET on this evidence. The wondelai set adds two things DEC-5 does not have: a technical-documentation skill (verdict DEPEND) and workflow journeys (not wanted). Conversely, DEC-5 rejects Clean Code, The Pragmatic Programmer, Code Complete, DDD Distilled, Implementing DDD and Refactoring.Guru, while wondelai ships Clean Code and Pragmatic Programmer, so the same exclusion has to be stated for them (what not to install).

## 4. Trigger collision risks

Compared with the `description` frontmatter of both sides. I read the first 700 characters of each wondelai description (the rest is cut in my view) and the first lines of ours, so the list is of the visible phrases.

1. `domain-driven-design` ("domain modeling", "ubiquitous language", "bounded context") against `conceptual-modelling` ("model the domain", "ubiquitous language glossary"): the same phrase "ubiquitous language" fires both.
2. `clean-architecture` ("architecture layers", "dependency rule", "ports and adapters", "where should business logic go") against `cosmic-python` ("layered architecture ... boundary enforcement"), `architecture`, agent `system-architect`, and the lens L3 of `meaningfy-code-review`. This is the collision the proposal already names (Rabbit-holes).
3. `clean-code` ("this function is too long", "code smells", "naming conventions", "unit test quality", "reviewing a pull request for readability") against `cosmic-python` ("enforcing Clean Code and SOLID"), `meaningfy-code-review` L4 and the `code-review` command. It fires on any review request and brings the contradicting numbers of section 2.
4. `refactoring-patterns` ("refactor this", "code smells", "technical debt") against `clean-code` (same two phrases), against our L5 lens, and against the `simplify` skill. Inside wondelai alone, three skills claim "code smells".
5. `system-design` ("system design", "scale this", "capacity planning", "distributed architecture", "microservices vs monoliths") against `architecture` ("system and solution design") and `system-architect`; and with `release-it` ("capacity-planning for peak load") and `ddia-systems` ("my queries are slow at scale").
6. `release-it` ("production outage", "deployment pipeline", "health checks", "my service keeps crashing", "zero-downtime deployments") against `service-reliability` ("the site is down", "alert fired", "incident") and `ci-cd-delivery` (deploy workflow). The skill name "release-it" also sits near `meaningfy-release` ("cut a release") for any query with "release".
7. `technical-documentation` ("write a README", "docstrings", "changelog or release notes", "migration guide", "our docs are confusing", and "prefer it over editing documentation unaided") against `technical-writing` ("write docs/README", "add docstrings"), the agent `technical-writer`, `meaningfy-release` (changelog), `explanatory-writing` and `writing-antipatterns`. Its description claims every doc task "even when the user names no style guide", so it will fire beside ours on every doc request.
8. `working-with-legacy-code` ("no tests", "how do I test this", "untested codebase") against `test-strategy` ("how do we know this succeeded or failed"), `superpowers:test-driven-development` and the `implementer` agent.
9. `improve-code-quality`, `remove-technical-debt`, `architecture-optimization` (all say "legacy", "untested", "technical debt", "slow") against `project-setup` ("modernise an existing repo", "gap analysis"), `epic-planning` and `working-with-legacy-code` itself. `design-code-architecture` ("design a new app's architecture") against `architecture` and `system-architect`.
10. `pragmatic-programmer` ("best practices", "avoid technical debt", "build-vs-buy", "estimation") has the widest vocabulary and fires on almost any engineering question; "estimation approaches" also touches the sales `estimation` skill.
11. `software-design-philosophy` ("this code is over-engineered", "simplify this design") against the `ponytail` skill and `simplify`, and against our lens L5.
12. Description length: the wondelai descriptions run to roughly 900 to 1,100 characters each (all are cut at about 700 in my view), which is more of every session's skill list than ours. The marketplace bundles amplify this: `code-craftsmanship` installs seven skills at once.

Mitigation beyond the proposal's "left to the PLAN": install per skill, not per bundle; do not install the four journeys, clean-code or pragmatic-programmer; for the one DEPEND (technical-documentation), our `technical-writing` description keeps priority by naming the Antora/AsciiDoc and workflow triggers, and a trigger probe pair (one positive, one near-miss) per AGENTS.md rule "Proven triggers" ships with any change of description. I did not test any trigger.

## 5. What I did not read or could not determine

- I did not read every SKILL.md body line by line. I read in full: clean-architecture, clean-code, and the technical-documentation sections 1 to 3; for the others I read the frontmatter, the Core Principle, the section headings, the "Core concept" and "Key insights" lines, and the Common Mistakes and Quick Diagnostic structure. The conflicts of section 2 come from those parts; a rule buried in a Common Mistakes row or a reference file may add one.
- References of the external skills: listed with sizes only, plus targeted greps (`release-notes.md`, `voice-and-words.md`). I did not read the references of ddia-systems, system-design, release-it, team-topologies, high-perf-browser, working-with-legacy-code or the four journeys' `artifact-templates.md`.
- Our side: read in full only the `cosmic-python` principles catalogue and selected sections of SKILL.md; read headings and descriptions for `architecture`, `meaningfy-code-review` (lens table), `test-strategy`, `bdd-gherkin`, `technical-writing` (full), `ci-cd-delivery`, `meaningfy-release` (section 3), `service-reliability` (opening), `conceptual-modelling`, `modelling-conventions`. I did not read `test-strategy`, `bdd-gherkin`, `ci-cd-delivery`, `conceptual-modelling`, `modelling-conventions` or `architecture` bodies, so I claim no conflict for them; none of the wondelai engineering skills has an evident counterpart to `test-strategy` or `bdd-gherkin`.
- `agent-rules-books` content: not read (not cloned). Section 3 rests on the inputs only. In particular I do not know whether the sets carry the Rule of Three, the 20-line figure or the entry-guard advice.
- I did not verify that `npx skills add wondelai/skills/<slug>` works on opencode, nor how a per-skill install interacts with the marketplace bundles.
- I did not check the MIT claim beyond frontmatter, the quality of the distillation against the books, or upstream maintenance (the repo's last visible commit is "ci: fix the re-review hint in the Claude review workflow (#32)", no date read).
- I did not read wondelai's `CLAUDE.md`, `.claude/`, `scripts/` or `docs/` (untrusted, not needed), and ran no scripts.
