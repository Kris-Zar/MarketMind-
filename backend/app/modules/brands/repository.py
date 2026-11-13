"""Repository for Brand Kit persistence over the Phase 0 store."""

from typing import Dict, List, Optional

from app.db.prototype_store import PrototypeStore


class BrandRepository:
    """Reads and writes brand records without business rules."""

    def __init__(self, store: PrototypeStore) -> None:
        self._store = store

    def list_brands(self) -> List[Dict]:
        """Return all stored brands ordered most recent first."""
        data = self._store.read_all()
        return list(reversed(data.get("brands", [])))

    def get_brand_by_id(self, brand_id: str) -> Optional[Dict]:
        """Find a single brand record by ID."""
        data = self._store.read_all()
        for record in data.get("brands", []):
            if record["id"] == brand_id:
                return record
        return None

    def save_brand(self, record: Dict) -> Dict:
        """Insert a new brand record."""
        data = self._store.read_all()
        brands = data.setdefault("brands", [])
        brands.append(record)
        self._store.write_all(data)
        return record

    def update_brand(self, brand_id: str, updates: Dict) -> Optional[Dict]:
        """Apply partial updates to an existing brand record."""
        data = self._store.read_all()
        brands = data.get("brands", [])
        for idx, record in enumerate(brands):
            if record["id"] == brand_id:
                updated = {**record, **updates}
                brands[idx] = updated
                self._store.write_all(data)
                return updated
        return None
