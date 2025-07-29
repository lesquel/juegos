from typing import Any, Dict

from application.mixins.logging_mixin import LoggingMixin
from fastapi import FastAPI
from infrastructure.core.settings_config import settings
from infrastructure.logging import get_logger

from .admin_setup import setup_admin
from .exception_handlers import setup_exception_handlers
from .lifespan import lifespan
from .middlewares import add_middlewares
from .routers import add_routers

# Configurar logger
logger = get_logger("app_configurator")


class AppConfigurator(LoggingMixin):
    """
    Configurador modular y mejorado de aplicación FastAPI.

    Cambios realizados:
    - Separación de responsabilidades más clara
    - Manejo de errores mejorado
    - Configuración más flexible
    - Mejor logging y documentación
    """

    def __init__(self):
        super().__init__()
        self.app_settings = settings.app_settings
        self._configured_components = set()

    def create_app(self) -> FastAPI:
        """
        Crea y configura la aplicación FastAPI con manejo de errores mejorado.

        Returns:
            FastAPI: Aplicación configurada
        """
        self.logger.info(
            f"🚀 Creating FastAPI application: {self.app_settings.app_name}"
        )

        try:
            # Crear aplicación base
            app = self._create_base_app()

            # Configurar todos los componentes
            self._configure_all_components(app)

            # Logging de éxito
            self._log_startup_success()

            return app

        except Exception as e:
            self.logger.error(f"❌ Failed to create FastAPI application: {e}")
            raise

    def _create_base_app(self) -> FastAPI:
        """Crea la aplicación FastAPI base con configuración mínima."""
        # Usar los métodos de seguridad mejorados
        debug_enabled = self.app_settings.should_enable_debug()

        return FastAPI(
            title=self.app_settings.app_name,
            description=self._get_app_description(),
            version="1.0.0",
            # Solo mostrar docs en desarrollo o cuando debug esté explícitamente habilitado
            docs_url="/docs" if debug_enabled else None,
            redoc_url="/redoc" if debug_enabled else None,
            lifespan=lifespan,
            # Configuración adicional para producción
            openapi_url="/openapi.json" if debug_enabled else None,
            # Configuración de seguridad mejorada
            swagger_ui_parameters=(
                {
                    "displayRequestDuration": True,
                    "filter": True,
                    "showExtensions": True,
                    "showCommonExtensions": True,
                }
                if debug_enabled
                else None
            ),
        )

    def _configure_all_components(self, app: FastAPI) -> None:
        """
        Configura todos los componentes de la aplicación en orden específico.

        Args:
            app: Aplicación FastAPI a configurar
        """
        configuration_steps = [
            ("middlewares", lambda: add_middlewares(app, self.app_settings)),
            ("exception_handlers", lambda: setup_exception_handlers(app)),
            ("routers", lambda: add_routers(app)),
            ("admin", lambda: setup_admin(app)),
        ]

        for step_name, step_func in configuration_steps:
            try:
                self.logger.info(f"⚙️ Configuring {step_name}")
                step_func()
                self._configured_components.add(step_name)
                self.logger.info(f"✅ {step_name} configured successfully")
            except Exception as e:
                self.logger.error(f"❌ Failed to configure {step_name}: {e}")
                # Decidir si continuar o fallar completamente
                if step_name in ["middlewares", "exception_handlers"]:
                    raise  # Componentes críticos
                else:
                    self.logger.warning(f"⚠️ Continuing without {step_name}")

    def _get_app_description(self) -> str:
        """Genera descripción de la aplicación."""
        return f"""
        Backend API para sistema de juegos con autenticación JWT

        **Ambiente**: {self.app_settings.environment}
        **Versión**: 1.0.0
        **Debug**: {self.app_settings.debug}

        ## Características principales:
        - Autenticación JWT
        - Sistema de juegos y categorías
        - Pagos y transferencias
        - Panel de administración
        - API RESTful completa
        """

    def _log_startup_success(self) -> None:
        """Registra información de éxito en el startup."""
        self.logger.info("=" * 50)
        self.logger.info(f"🎉 {self.app_settings.app_name} configured successfully!")
        self.logger.info(f"📊 Environment: {self.app_settings.environment}")
        self.logger.info(f"🔧 Debug mode: {self.app_settings.debug}")
        self.logger.info(
            f"⚙️ Configured components: {', '.join(self._configured_components)}"
        )
        self.logger.info("=" * 50)

    def get_configuration_status(self) -> Dict[str, Any]:
        """Retorna el estado de la configuración para debugging."""
        return {
            "app_name": self.app_settings.app_name,
            "environment": self.app_settings.environment,
            "debug": self.app_settings.debug,
            "configured_components": list(self._configured_components),
            "storage_configured": hasattr(settings, "storage_settings"),
            "using_cloud_storage": True,  # Siempre usamos Cloud Storage
        }
