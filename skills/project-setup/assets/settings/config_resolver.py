# Settings pattern (cosmic-python:PR-CONFIG-DECOUPLED): a starting point to copy, not sacred.
# What is mandatory is the decoupled consumption: typed config classes whose fields resolve
# through an injected resolver keyed by the field name; the field body coerces the type.
# The resolver lives in commons/adapters/ (name it for the domain, not "config.py"); config
# classes live near their consumer (often the component or root __init__.py).
# pydantic-settings BaseSettings is an acceptable engine for the same principle.
import inspect
import os
from abc import ABC, abstractmethod


class ConfigResolverABC(ABC):
    def config_resolve(self, default_value: str | None = None) -> str | None:
        # the decorated field's name is the key; the caller passes nothing
        config_name = inspect.stack()[2][3]
        return self.concrete_config_resolve(config_name, default_value)

    @abstractmethod
    def concrete_config_resolve(self, name: str, default_value: str | None = None) -> str | None: ...


class EnvConfigResolver(ConfigResolverABC):
    def concrete_config_resolve(self, name, default_value=None):
        return os.environ.get(name, default_value)


class DefaultConfigResolver(ConfigResolverABC):  # tests / terminal fallback
    def concrete_config_resolve(self, name, default_value=None):
        return default_value


def env_property(resolver_class: type[ConfigResolverABC] = EnvConfigResolver, default_value=None):
    """Turn a method into a config-backed property; the method name IS the env key."""

    def decorator(func):
        @property
        def wrapper(self):
            value = resolver_class().concrete_config_resolve(func.__name__, default_value)
            return func(self, value)  # body coerces the resolved string

        wrapper.__doc__ = func.__doc__
        return wrapper

    return decorator


# Consumer side: a typed config class.
class JWTConfig:
    @env_property()
    def JWT_SECRET_KEY(self, value: str | None) -> str:
        if value is None:
            raise ValueError("JWT_SECRET_KEY is required")
        return value

    @env_property(default_value="15")
    def ACCESS_TOKEN_EXPIRE_MINUTES(self, value: str) -> int:
        return int(value)
