# Settings / Configuration Pattern

The Meaningfy way to consume **application** configuration (distinct from the *tool* config in
[`config-files.md`](config-files.md)). Implements `cosmic-python:PR-CONFIG-DECOUPLED`.

## The principle (mandated when a project has settings)

- Code consumes configuration **without knowing where the value comes from** — never `os.environ[...]`
  scattered through services/adapters.
- Configuration is exposed as **typed config classes** whose fields resolve through an **injected
  resolver** (environment, default, secrets store, …), keyed by the field/method name.
- The body of each field does the **type coercion** (`str` → `int`/`bool`/`list`), so the rest of the
  code receives typed values.
- **Maintainable & testable:** swap the resolver (e.g. `DefaultConfigResolver`) in tests; no env needed.
- **Skip entirely** when a project has no settings. But when settings *are* expected, this is the
  **only** sanctioned approach — do not hand-roll ad-hoc env reads.

> Placement note (DIP): the resolver is an I/O concern and lives in `core`/`commons` adapters; config
> classes live near their consumer (often the component or root `__init__.py`). Importing the resolver
> from `core` is acceptable shared infrastructure — keep the *resolution mechanism* in one place.

## Reference implementation (a starting point — improve as needed)

The essence is `config_value` arriving already-resolved; the field only coerces. The implementation
below is illustrative, not sacred — what is mandatory is the *decoupled consumption*, not this code.

```python
# core/adapters/config_resolver.py  (name for the domain, not "config.py")
import inspect, os
from abc import ABC, abstractmethod


class ConfigResolverABC(ABC):
    def config_resolve(self, default_value: str | None = None) -> str | None:
        # the decorated field's name is the key — caller passes nothing
        config_name = inspect.stack()[2][3]
        return self.concrete_config_resolve(config_name, default_value)

    @abstractmethod
    def concrete_config_resolve(self, name: str, default_value: str | None = None) -> str | None: ...


class EnvConfigResolver(ConfigResolverABC):
    def concrete_config_resolve(self, name, default_value=None):
        return os.environ.get(name, default_value)


class DefaultConfigResolver(ConfigResolverABC):       # tests / terminal fallback
    def concrete_config_resolve(self, name, default_value=None):
        return default_value


def env_property(resolver_class: type[ConfigResolverABC] = EnvConfigResolver, default_value=None):
    """Turn a method into a config-backed property; the method name IS the env key."""
    def decorator(func):
        @property
        def wrapper(self):
            value = resolver_class().concrete_config_resolve(func.__name__, default_value)
            return func(self, value)          # body coerces the resolved string
        wrapper.__doc__ = func.__doc__
        return wrapper
    return decorator
```

```python
# consumer side — a typed config class (lives near its consumer / root __init__.py)
class JWTConfig:
    @env_property()
    def JWT_SECRET_KEY(self, value: str | None) -> str:
        if value is None:
            raise ValueError("JWT_SECRET_KEY is required")
        return value

    @env_property(default_value="15")
    def ACCESS_TOKEN_EXPIRE_MINUTES(self, value: str) -> int:
        return int(value)
```

`pydantic-settings` `BaseSettings` is an acceptable alternative *engine*, but the **principle is the
same**: typed classes, source-agnostic consumption, one resolution mechanism — not scattered env reads.
