from .base_settings_config import BaseSettingsConfig

class AppSettings(BaseSettingsConfig):
    app_name: str
    environment: str
    debug: bool = True

    # CORS 
    allowed_origins: list[str]
