"""Repository for Product Profile persistence."""

from typing import Dict, List, Optional

from app.db.prototype_store import PrototypeStore


class ProductRepository:
    """Reads and writes product profile records."""

    def __init__(self, store: PrototypeStore) -> None:
        self._store = store

    def list_products(self, brand_id: Optional[str] = None) -> List[Dict]:
        """List products, optionally filtered by brand ID."""
        data = self._store.read_all()
        products = list(reversed(data.get("products", [])))
        if brand_id:
            return [item for item in products if item.get("brand_id") == brand_id]
        return products

    def get_product_by_id(self, product_id: str) -> Optional[Dict]:
        """Find a single product record by ID."""
        data = self._store.read_all()
        for record in data.get("products", []):
            if record["id"] == product_id:
                return record
        return None

    def save_product(self, record: Dict) -> Dict:
        """Persist a new product record."""
        data = self._store.read_all()
        data.setdefault("products", []).append(record)
        self._store.write_all(data)
        return record

    def update_product(self, product_id: str, updates: Dict) -> Optional[Dict]:
        """Apply partial updates to an existing product record."""
        data = self._store.read_all()
        products = data.get("products", [])
        for idx, record in enumerate(products):
            if record["id"] == product_id:
                updated = {**record, **updates}
                products[idx] = updated
                self._store.write_all(data)
                return updated
        return None
