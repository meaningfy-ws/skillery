# The Art of Coding with an LLM Agent

Writing clean code is a continuous fight with our own shortcuts. An LLM assistant can generate
more code in seconds than a human types in an afternoon — which can be wonderful, or can quietly
destroy our architecture. This page is the *mindset*; the operational expression lives in the
skills it points to.

## Treat the LLM as a guided peer — not a fast junior

The older framing was "treat the LLM as a very fast junior": give fully-specified small tasks,
expect no judgement. With current frontier models that is too thin. Treat a capable model as a
**peer who needs context and guidance** — give it the intent and constraints, then **ask it to
explore the problem space and propose two or three options with trade-offs** before it commits to
one. Converge with it; don't dictate to it.

**Match the leash to the model.** Frontier models (Opus-class) behave like a peer who can explore
and propose; cheaper/faster models still behave like a fast junior who needs fully-specified
tasks. Use the metaphor that fits the model in front of you.

What does **not** change with the framing — the discipline that closes every interaction:

- **You own the code and sign the PR.** The LLM never does.
- **Review every diff** as you would a colleague's PR.
- **Tests are non-negotiable** (no clean code without tests).
- **Work stays inside the shaped scope** of the Epic and its Work Shape.

A peer still gets their PRs reviewed. "Peer" means *explore-and-propose at the front*, not
*unattended at the back*.

## Shape first, then build

Start from the Epic and its Work Shape (the bet, the boundaries, the appetite, the risks), then
the Jira ticket, then the LLM. If the work is explicitly exploratory, spikes are fine — treat the
output as disposable. If it is production-grade, follow the discipline: TDD/BDD, the layers, the
CI guard rails.

## How this lands in practice

- Explore options before building → `superpowers:brainstorming`.
- Turn the shape into a spec → the `epic-planning` skill + the external `stream-coding` method.
- Structure the code → the `cosmic-python` skill.
- Test-first → `superpowers:test-driven-development`.
- Review before merge → `meaningfy-code-review` + the external `code-review`.

Used well, an LLM amplifies our ability to build clear models, sensible abstractions, and strong
tests. Used blindly, it just accelerates the production of messy code and raises WTFs-per-minute
in every review. Teach it our way of working, keep it close to our canvas, and do not let it
drive unattended.
