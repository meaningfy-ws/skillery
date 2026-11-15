# ruleid: mfy-exception-outside-exceptions-module
class GraphStoreError(Exception):
    pass


# ruleid: mfy-exception-outside-exceptions-module
class QueryTimeout(TimeoutError):
    pass


# ruleid: mfy-exception-outside-exceptions-module
class WrappedError(errors.BaseError):
    pass


# ok: mfy-exception-outside-exceptions-module
class GraphStore(Repository):
    pass


# ok: mfy-exception-outside-exceptions-module
class Mapper(dict):
    pass
