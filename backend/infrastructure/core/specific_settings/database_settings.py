from .base_settings_config import BaseSettingsConfig


class DatabaseSettings(BaseSettingsConfig):
    postgres_host: str
    postgres_port: int
    postgres_user: str
    postgres_password: str
    postgres_db: str
