"""Probe for issue #215: which Ruff rules flag the hygiene cases. Every function is a bad case."""
import datetime
import datetime as dt
from datetime import datetime as DT

import httpx
import requests


def requests_no_timeout():
    return requests.get("https://example.org")


def requests_timeout_none():
    return requests.post("https://example.org", timeout=None)


def httpx_no_timeout():
    return httpx.get("https://example.org")


def httpx_timeout_none():
    return httpx.get("https://example.org", timeout=None)


def httpx_client_no_timeout():
    with httpx.Client() as c:
        return c.get("https://example.org")


def requests_session_no_timeout():
    s = requests.Session()
    return s.get("https://example.org")


async def httpx_async_client_no_timeout():
    async with httpx.AsyncClient() as c:
        return await c.get("https://example.org")


def naive_now():
    return datetime.datetime.now()


def naive_utcnow():
    return DT.utcnow()


def naive_constructor():
    return dt.datetime(2026, 1, 1)


def naive_fromtimestamp():
    return DT.fromtimestamp(0)


def naive_strptime():
    return DT.strptime("2026", "%Y")


def naive_today():
    return datetime.date.today()


def bare_except():
    try:
        requests_no_timeout()
    except:
        pass


def blind_except():
    try:
        requests_no_timeout()
    except Exception:
        pass


def blind_base_exception():
    try:
        requests_no_timeout()
    except BaseException:
        return None
