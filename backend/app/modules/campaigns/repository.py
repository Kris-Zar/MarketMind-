"""Repository for Campaign Brief persistence."""

from typing import Dict, List, Optional

from app.db.prototype_store import PrototypeStore


class CampaignRepository:
    """Reads and writes campaign brief records."""

    def __init__(self, store: PrototypeStore) -> None:
        self._store = store

    def list_campaigns(self) -> List[Dict]:
        """List all saved and demo campaigns ordered most recent first."""
        data = self._store.read_all()
        return list(reversed(data.get("campaigns", [])))

    def get_campaign_by_id(self, campaign_id: str) -> Optional[Dict]:
        """Find a campaign brief by ID."""
        data = self._store.read_all()
        for record in data.get("campaigns", []):
            if record["id"] == campaign_id:
                return record
        return None

    def save_campaign(self, record: Dict) -> Dict:
        """Persist a new campaign record."""
        data = self._store.read_all()
        data.setdefault("campaigns", []).append(record)
        self._store.write_all(data)
        return record

    def update_campaign(self, campaign_id: str, updates: Dict) -> Optional[Dict]:
        """Update an existing campaign record."""
        data = self._store.read_all()
        campaigns = data.get("campaigns", [])
        for idx, record in enumerate(campaigns):
            if record["id"] == campaign_id:
                updated = {**record, **updates}
                campaigns[idx] = updated
                self._store.write_all(data)
                return updated
        return None
