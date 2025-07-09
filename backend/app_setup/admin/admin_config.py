from fastapi import FastAPI
from sqladmin import Admin
from infrastructure.db.connection import engine
from infrastructure.logging import get_logger

logger = get_logger("admin_config")


def initialize_admin(app: FastAPI):
    """Inicializar el panel de administración SQLAdmin"""
    try:
        from admin import admin_views_by_module, authentication_backend

        logger.info("Initializing SQLAdmin for admin interface")

        # Crear instancia del admin con configuración mejorada
        admin = Admin(
            app=app,
            engine=engine,
            authentication_backend=authentication_backend,
            title="Juegos Backend",
            logo_url=None,  # Puedes agregar tu logo aquí
        )

        # Agregar vistas organizadas por módulos
        for module_name, views in admin_views_by_module.items():
            logger.info(f"📁 Adding module: {module_name}")
            
            for view in views:
                # Configurar el nombre del módulo en la vista
                if hasattr(view, '__module_name__'):
                    view.__module_name__ = module_name
                else:
                    # Si la vista no tiene atributo de módulo, agregarlo dinámicamente
                    setattr(view, 'category', module_name)
                
                logger.info(f"  ├── Adding view: {view.__name__}")
                admin.add_view(view)

        logger.info("✅ Admin interface initialized successfully")
        logger.info("🔗 Admin panel available at: /admin")

    except Exception as e:
        logger.error(f"❌ Failed to initialize admin interface: {str(e)}")
        # No lanzar la excepción para no interrumpir el inicio de la aplicación
        logger.warning("⚠️ Application will continue without admin interface")
