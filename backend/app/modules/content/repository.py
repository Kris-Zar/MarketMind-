"""Repository for Content Asset persistence."""

from typing import Dict, List, Optional

from app.db.prototype_store import PrototypeStore


class ContentRepository:
    """Reads and writes generated campaign assets."""

    def __init__(self, store: PrototypeStore) -> None:
        self._store = store

    def list_assets_by_campaign(self, campaign_id: str) -> List[Dict]:
        """List all assets belonging to a specific campaign."""
        data = self._store.read_all()
        return [
            item
            for item in data.get("assets", [])
            if item.get("campaign_id") == campaign_id
        ]

    def get_asset_by_id(self, asset_id: str) -> Optional[Dict]:
        """Find a single asset by ID."""
        data = self._store.read_all()
        for record in data.get("assets", []):
            if record["id"] == asset_id:
                return record
        return None

    def replace_campaign_assets(self, campaign_id: str, new_assets: List[Dict]) -> List[Dict]:
        """Replace assets for a campaign after a fresh generation batch."""
        data = self._store.read_all()
        remaining = [
            item
            for item in data.get("assets", [])
            if item.get("campaign_id") != campaign_id
        ]
        data["assets"] = remaining + new_assets
        self._store.write_all(data)
        return new_assets

    def update_asset(self, asset_id: str, updates: Dict) -> Optional[Dict]:
        """Apply partial updates to an existing asset without touching sibling assets."""
        data = self._store.read_all()
        assets = data.get("assets", [])
        for idx, record in enumerate(assets):
            if record["id"] == asset_id:
                updated = {**record, **updates}
                assets[idx] = updated
                self._store.write_all(data)
                return updated
        return None
