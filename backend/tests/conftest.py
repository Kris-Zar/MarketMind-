"""Pytest fixtures providing isolated temporary prototype storage."""

import asyncio
from pathlib import Path
from typing import Any, Generator

import httpx
import pytest

from app.core.dependencies import get_prototype_store
from app.db.prototype_store import PrototypeStore
from app.main import create_app


class SyncASGIClient:
    """Synchronous test wrapper around httpx.AsyncClient + ASGITransport."""

    def __init__(self, app: Any) -> None:
        self._transport = httpx.ASGITransport(app=app)

    def request(self, method: str, url: str, **kwargs: Any) -> httpx.Response:
        async def _send() -> httpx.Response:
            async with httpx.AsyncClient(
                transport=self._transport,
                base_url="http://testserver",
            ) as async_client:
                return await async_client.request(method, url, **kwargs)

        return asyncio.run(_send())

    def get(self, url: str, **kwargs: Any) -> httpx.Response:
        return self.request("GET", url, **kwargs)

    def post(self, url: str, **kwargs: Any) -> httpx.Response:
        return self.request("POST", url, **kwargs)

    def patch(self, url: str, **kwargs: Any) -> httpx.Response:
        return self.request("PATCH", url, **kwargs)


@pytest.fixture
def client(tmp_path: Path) -> Generator[SyncASGIClient, None, None]:
    """Return an ASGI test client wired to a temporary JSON store."""
    test_store = PrototypeStore(tmp_path / "test_store.json")
    app = create_app()
    app.dependency_overrides[get_prototype_store] = lambda: test_store
    yield SyncASGIClient(app)
    app.dependency_overrides.clear()
