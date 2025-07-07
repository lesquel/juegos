from .app_configurator import AppConfigurator

# Función principal para mantener compatibilidad
def create_app():
    """Factory function para crear la aplicación FastAPI"""
    return AppConfigurator.create_app()

__all__ = [
    "create_app",
    "AppConfigurator",
]
