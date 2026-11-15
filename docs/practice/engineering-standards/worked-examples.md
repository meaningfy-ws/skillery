# Worked examples: layered Python in real code

The [`cosmic-python`](../../../skills/cosmic-python/SKILL.md) skill used to carry seven files of
example code. They were copies of a real project that drifted from it, and an agent read them as
rules. The skill now keeps only the rules; this page points to the real code that shows them.

The code is [`mapping-suite-sdk`](https://github.com/meaningfy-ws/mapping-suite-sdk), on its
`develop` branch. It is a component-first package: `core/` is the shared component, and each
mapping package version (`mapping_package_v1/` to `mapping_package_v3/`) and `tools/` hold their own
layers. Where the code differs from the skill, the skill wins; the differences are named below.

## Models

- [`core/models/pydantic.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/mapping_suite_sdk/core/models/pydantic.py):
  the one shared Pydantic base every model inherits, strict about unknown fields
  (`cosmic-python:BP-STRICT-BASE-MODEL`), and the `fields()` helper that names a field without a
  free string.
- [`mapping_suite/models/mapping_suite.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/mapping_suite_sdk/mapping_suite/models/mapping_suite.py):
  domain enums instead of magic strings, and models composed of models. No I/O.

## Adapters

- [`core/adapters/extractor.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/mapping_suite_sdk/core/adapters/extractor.py):
  an abstract interface, `ExtractorABC`, and an implementation named for what it wraps,
  `ArchiveExtractor` (`cosmic-python:BP-ABC-INTERFACES`).
- [`core/adapters/repository.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/mapping_suite_sdk/core/adapters/repository.py):
  a generic `RepositoryABC` and its `MongoDBRepository`. A generic repository base is allowed in
  Meaningfy code. Its exceptions sit in the same file, which `BP-EXCEPTIONS-MODULE` would move.
- [`core/adapters/tracer.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/mapping_suite_sdk/core/adapters/tracer.py):
  tracing as decorators (`traced_routine`, `traced_class`), so services and adapters carry no
  inline spans.

## Services

- [`mapping_package_v3/services/load_mapping_package_v3.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/mapping_suite_sdk/mapping_package_v3/services/load_mapping_package_v3.py):
  one function per use case (load from a folder, an archive, GitHub, MongoDB). Each takes its
  adapters as parameters and defaults them to the production one (`cosmic-python:BP-INJECT-ADAPTERS`).
  The parameters are typed by the concrete class; the skill asks for the abstract interface.

## Entrypoints

- [`tools/entrypoints/cli/mssdk.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/mapping_suite_sdk/tools/entrypoints/cli/mssdk.py):
  the Typer application, with one subcommand per module.
- [`tools/entrypoints/cli/validate.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/mapping_suite_sdk/tools/entrypoints/cli/validate.py):
  a subcommand that parses its arguments and calls the validation services. It also builds loaders,
  which are adapters; the skill sends every entrypoint through a service instead.
- API: the project has no HTTP entrypoint, so there is no API example here.

## Tests per layer and test doubles

- [`tests/unit/core/models/test_pydantic.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/tests/unit/core/models/test_pydantic.py):
  model tests with no doubles.
- [`tests/unit/core/adapters/test_repository.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/tests/unit/core/adapters/test_repository.py):
  the repository against `mongomock`, one behaviour per test.
- [`tests/unit/mapping_package_v3/services/test_load_mapping_package_v3.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/tests/unit/mapping_package_v3/services/test_load_mapping_package_v3.py):
  service tests, with a custom loader passed in and the error cases.
- [`tests/unit/tools/entrypoints/cli/test_validation_cli.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/tests/unit/tools/entrypoints/cli/test_validation_cli.py):
  CLI tests with Typer's `CliRunner` and the service patched out.
- [`tests/conftest.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/tests/conftest.py):
  the shared fixtures, including a repository on `mongomock`.
- Fakes: the project uses `mongomock` and `unittest.mock` and has no fake of its own ports; the
  testing checklist in `cosmic-python` prefers one fake per port over mock stubs.

## Configuration through the resolver

- [`core/adapters/config_resolver.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/mapping_suite_sdk/core/adapters/config_resolver.py):
  `ConfigResolverABC`, the environment and default resolvers, and `env_property`
  (`cosmic-python:PR-CONFIG-DECOUPLED`).
- [`core/config.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/mapping_suite_sdk/core/config.py)
  and [`config.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/mapping_suite_sdk/config.py):
  typed settings per component, joined into one `mssdk_config`.
- [`tests/unit/core/adapters/test_config_resolver.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/tests/unit/core/adapters/test_config_resolver.py):
  the resolvers swapped in tests.

## Exceptions

- The project has no `exceptions.py`, so it has no good example of `cosmic-python:BP-EXCEPTIONS-MODULE`.
  [`core/adapters/validator.py`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/mapping_suite_sdk/core/adapters/validator.py)
  shows a base exception that each version's validator extends, but inside a logic module.

## Quality gates

- [`Makefile`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/Makefile): `check-all`
  runs lint, type checks, `check-architecture`, the generated-code check and the tests.
- [`.importlinter`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/.importlinter):
  one forbidden-import contract per layer rule and per component.
- [`.coveragerc`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/.coveragerc):
  branch coverage with `fail_under = 80`.
- [`.github/workflows/ci.yaml`](https://github.com/meaningfy-ws/mapping-suite-sdk/blob/develop/.github/workflows/ci.yaml):
  a thin workflow that calls `make check-all`.

The scaffold for a new project, with its own versions of these files, is
[`project-setup`](../../../skills/project-setup/SKILL.md)'s.
