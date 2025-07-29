import json
from pathlib import Path
from typing import Optional

from .base_settings_config import BaseSettingsConfig


class StorageSettings(BaseSettingsConfig):
    """Configuración para Google Cloud Storage"""

    # Google Cloud Storage settings
    gcs_bucket_name: str
    gcs_project_id: Optional[str] = None
    gcs_credentials_path: Optional[str] = None

    # Storage configuration
    storage_public_url_base: Optional[str] = None
    storage_max_file_size: int = 10 * 1024 * 1024  # 10MB
    storage_allowed_extensions: list[str] = [".jpg", ".jpeg", ".png", ".gif", ".webp"]

    @property
    def gcs_credentials_json(self) -> Optional[dict]:
        if self.gcs_credentials_path:
            path = Path(self.gcs_credentials_path)
            if path.exists():
                return json.loads(path.read_text())
        return None

    def get_public_url_base(self) -> str:
        """Retorna la URL base para archivos públicos"""
        if self.storage_public_url_base:
            return self.storage_public_url_base
        return f"https://storage.googleapis.com/{self.gcs_bucket_name}"
