from .base_settings_config import BaseSettingsConfig


class AppSettings(BaseSettingsConfig):
    app_name: str
    environment: str
    debug: bool = False  # Seguro por defecto - debe activarse explícitamente
    base_url: str

    # CORS
    allowed_origins: list[str]

    def is_development(self) -> bool:
        """Verifica si estamos en ambiente de desarrollo"""
        return self.environment.lower() in ["dev", "development", "local"]

    def is_production(self) -> bool:
        """Verifica si estamos en ambiente de producción"""
        return self.environment.lower() in ["prod", "production"]

    def should_enable_debug(self) -> bool:
        """Determina si el debug debe estar habilitado"""
        return self.debug and self.is_development()
