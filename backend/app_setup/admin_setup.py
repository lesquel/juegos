from fastapi import FastAPI
from infrastructure.logging import get_logger
from functools import lru_cache

# Configurar logger
logger = get_logger("admin_setup")


@lru_cache(maxsize=1)
def _get_admin_config():
    """Cache de la configuración del admin para evitar reimportaciones"""
    from .admin import initialize_admin
    return initialize_admin


def setup_admin(app: FastAPI) -> None:
    """Configurar el panel de administración optimizado"""
    try:
        # Solo loguear si no estamos en producción
        if getattr(app.state, 'environment', 'development') != 'production':
            logger.info("Setting up admin panel")
        
        # Usar configuración cacheada
        initialize_admin = _get_admin_config()
        
        # Inicializar admin inmediatamente
        initialize_admin(app)
            
    except Exception as e:
        logger.error(f"Error setting up admin panel: {e}")
        # No fallar completamente si el admin no se puede configurar
        logger.warning("Application will continue without admin panel")
