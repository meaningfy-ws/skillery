import asyncio
import time


def test_bad():
    # ruleid: mfy-test-real-sleep
    time.sleep(1)


async def test_bad_async():
    # ruleid: mfy-test-real-sleep
    await asyncio.sleep(1)


def test_good_injected(sleep):
    # ok: mfy-test-real-sleep
    sleep(1)


async def test_good_yield():
    # ok: mfy-test-real-sleep
    await asyncio.sleep(0)
