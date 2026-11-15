"""Probe for issue #215: which Ruff rules flag the hygiene cases. Every function is a bad case."""
import datetime
import datetime as dt
from datetime import datetime as DT

import httpx
import requests


def requests_no_timeout():
    return requests.get("https://example.org")  # expect: S113


def requests_timeout_none():
    return requests.post("https://example.org", timeout=None)  # expect: S113


def httpx_no_timeout():
    return httpx.get("https://example.org")


def httpx_timeout_none():
    return httpx.get("https://example.org", timeout=None)  # expect: S113


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
    return datetime.datetime.now()  # expect: DTZ005


def naive_utcnow():
    return DT.utcnow()  # expect: DTZ003


def naive_constructor():
    return dt.datetime(2026, 1, 1)  # expect: DTZ001


def naive_fromtimestamp():
    return DT.fromtimestamp(0)  # expect: DTZ006


def naive_strptime():
    return DT.strptime("2026", "%Y")  # expect: DTZ007


def naive_today():
    return datetime.date.today()  # expect: DTZ011


def bare_except():
    try:
        requests_no_timeout()
    except:  # expect: E722
        pass


def blind_except():
    try:
        requests_no_timeout()
    except Exception:  # expect: BLE001
        pass


def blind_base_exception():
    try:
        requests_no_timeout()
    except BaseException:  # expect: BLE001
        return None
