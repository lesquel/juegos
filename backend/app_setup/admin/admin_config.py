import time

from fastapi import FastAPI
from infrastructure.db.connection import engine
from infrastructure.logging import get_logger
from sqladmin import Admin

logger = get_logger("admin_config")


def initialize_admin(app: FastAPI):
    """Inicializar el panel de administración SQLAdmin optimizado"""
    start_time = time.time()

    try:
        from . import authentication_backend

        logger.info("Initializing SQLAdmin for admin interface")

        # Crear instancia del admin con configuración optimizada
        admin = Admin(
            app=app,
            engine=engine,
            authentication_backend=authentication_backend,
            title="Juegos Backend",
            logo_url=None,
            debug=False,  # Desactivar debug en producción
        )

        # Obtener vistas directamente para evitar problemas con cache
        from . import admin_views_by_module

        # Agregar vistas de forma optimizada
        if isinstance(admin_views_by_module, dict):
            total_views = sum(
                len(views) if hasattr(views, "__len__") else 0
                for views in admin_views_by_module.values()
            )
            logger.info(
                f"� Adding {total_views} admin views across {len(admin_views_by_module)} modules"
            )

            for module_name, views in admin_views_by_module.items():
                if hasattr(views, "__iter__"):
                    for view in views:
                        # Configurar el nombre del módulo en la vista de forma eficiente
                        if not hasattr(view, "category"):
                            setattr(view, "category", module_name)

                        admin.add_view(view)

        elapsed_time = time.time() - start_time
        logger.info(
            f"✅ Admin interface initialized successfully in {elapsed_time:.2f}s"
        )
        logger.info("🔗 Admin panel available at: /admin")

    except Exception as e:
        logger.error(f"❌ Failed to initialize admin interface: {str(e)}")
        # No lanzar la excepción para no interrumpir el inicio de la aplicación
        logger.warning("⚠️ Application will continue without admin interface")
