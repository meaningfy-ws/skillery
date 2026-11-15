"""Probe for issue #215: the good cases; the chosen rule codes must stay silent here."""
import datetime

import httpx
import requests


def requests_with_timeout():
    return requests.get("https://example.org", timeout=10)


def httpx_with_timeout():
    return httpx.get("https://example.org", timeout=10)


def aware_now():
    return datetime.datetime.now(tz=datetime.UTC)


def narrow_except():
    try:
        requests_with_timeout()
    except requests.RequestException as exc:
        raise RuntimeError("fetch failed") from exc
