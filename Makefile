.PHONY: install validate lint test validate-spine

install:
	python3 -m venv .venv && . .venv/bin/activate && pip install -q -r requirements-dev.txt

# validate = the guardrail (CLI report) + the test suite (incl. negative tests)
validate: lint test

lint:
	. .venv/bin/activate && python -m tools.repo_lint

test:
	. .venv/bin/activate && python -m pytest tests/ -q

# validate-spine = the structural gate on the OpenSpec spine (needs node + npx).
# Kept separate from `validate` so the Python guardrail runs without a node
# toolchain. The clarity gate (semantic, on the PLAN) is run by a human/agent,
# not here. Pinned version lives in spine/openspec-version.txt.
validate-spine:
	@v=$$(cat spine/openspec-version.txt); \
	npx --yes @fission-ai/openspec@$$v schema validate meaningfy && \
	npx --yes @fission-ai/openspec@$$v validate --all --strict
