from .base_settings_config import BaseSettingsConfig


class AppSettings(BaseSettingsConfig):
    app_name: str
    environment: str
    debug: bool = False
    host: str

    # CORS
    allowed_origins: list[str]
    trusted_hosts: list[str]

    def is_development(self) -> bool:
        """Verifica si estamos en ambiente de desarrollo"""
        env = (self.environment or "").lower()
        return env in ["dev", "development", "local"]

    def is_production(self) -> bool:
        """Verifica si estamos en ambiente de producción"""
        env = (self.environment or "").lower()
        return env in ["prod", "production"]

    def should_enable_debug(self) -> bool:
        """Determina si el debug debe estar habilitado"""
        return self.debug and self.is_development()

    @property
    def base_url(self) -> str:
        """Devuelve la URL base de la aplicación"""
        if self.is_development():
            return f"http://{self.host}"  # Normalmente en dev HTTP
        else:
            return f"https://{self.host}"  # En producción HTTPS
