.PHONY: install validate lint test

install:
	python3 -m venv .venv && . .venv/bin/activate && pip install -q -r requirements-dev.txt

# validate = the guardrail (CLI report) + the test suite (incl. negative tests)
validate: lint test

lint:
	. .venv/bin/activate && python -m tools.repo_lint

test:
	. .venv/bin/activate && python -m pytest tests/ -q
