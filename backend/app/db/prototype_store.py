"""JSON-file-backed prototype persistence store for Phase 0.

This module sits cleanly behind domain repositories so Phase 1 can migrate
storage internals to SQLAlchemy + PostgreSQL without changing services or routes.
"""

from copy import deepcopy
import json
from pathlib import Path
from threading import RLock
from typing import Any, Dict

from app.db.demo_seed import build_initial_demo_store


class PrototypeStore:
    """Thread-safe JSON persistence store seeded with clearly labelled demo data."""

    def __init__(self, store_path: Path) -> None:
        self._store_path = store_path
        self._lock = RLock()

    def read_all(self) -> Dict[str, Any]:
        """Load the prototype store from disk, seeding demo data if missing."""
        with self._lock:
            if not self._store_path.exists():
                seed = build_initial_demo_store()
                self._write_unlocked(seed)
                return deepcopy(seed)
            raw = self._store_path.read_text(encoding="utf-8")
            return json.loads(raw)

    def write_all(self, data: Dict[str, Any]) -> None:
        """Persist updated prototype store contents atomically where practical."""
        with self._lock:
            self._write_unlocked(data)

    def reset_to_demo(self) -> Dict[str, Any]:
        """Restore the prototype store to initial seeded demo state."""
        with self._lock:
            seed = build_initial_demo_store()
            self._write_unlocked(seed)
            return deepcopy(seed)

    def _write_unlocked(self, data: Dict[str, Any]) -> None:
        self._store_path.parent.mkdir(parents=True, exist_ok=True)
        temp_path = self._store_path.with_suffix(".tmp")
        temp_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
        temp_path.replace(self._store_path)
