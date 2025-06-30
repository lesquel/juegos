
from .base_settings_config import BaseSettingsConfig


class JWTSettings(BaseSettingsConfig):
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_time: int = 3600  # Default to 1 hour

