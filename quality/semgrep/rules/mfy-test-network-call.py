import requests
import httpx
import urllib.request


def test_bad_requests():
    # ruleid: mfy-test-network-call
    requests.get("https://example.org")


def test_bad_httpx():
    # ruleid: mfy-test-network-call
    httpx.post("https://example.org", json={})


def test_bad_urlopen():
    # ruleid: mfy-test-network-call
    urllib.request.urlopen("https://example.org")


def test_good_fake(fake_client):
    # ok: mfy-test-network-call
    fake_client.get("https://example.org")
