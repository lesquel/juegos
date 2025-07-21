import logging
from typing import Any, Dict

from api.http.routes import routers
from fastapi import FastAPI
from infrastructure.logging import get_logger

# Configurar logger
logger = get_logger("routers")


def add_routers(app: FastAPI) -> None:
    """
    Añadir routers a la aplicación FastAPI con logging mejorado.

    Args:
        app: Aplicación FastAPI
    """
    logger.info("🔌 Starting router configuration")

    # Información de estadísticas
    router_stats: Dict[str, Any] = {
        "total_routers": len(routers),
        "successful": 0,
        "failed": 0,
        "router_details": [],
    }

    for router in routers:
        try:
            # Obtener información del router
            router_info = {
                "prefix": getattr(router, "prefix", ""),
                "tags": getattr(router, "tags", []),
                "routes_count": len(router.routes) if hasattr(router, "routes") else 0,
            }

            # Incluir el router
            app.include_router(router)

            # Logging de éxito
            logger.info(
                f"✅ Router configured: {router_info['prefix']} "
                f"({router_info['routes_count']} routes) "
                f"Tags: {router_info['tags']}"
            )

            router_stats["successful"] += 1
            router_stats["router_details"].append({**router_info, "status": "success"})

        except Exception as e:
            # Logging de error
            logger.error(f"❌ Failed to configure router: {e}")
            router_stats["failed"] += 1
            router_stats["router_details"].append(
                {
                    "prefix": getattr(router, "prefix", "unknown"),
                    "status": "failed",
                    "error": str(e),
                }
            )

    # Resumen final
    logger.info(
        "🎯 Router configuration complete: "
        f"{router_stats['successful']}/{router_stats['total_routers']} successful"
    )

    if router_stats["failed"] > 0:
        logger.warning(f"⚠️ {router_stats['failed']} routers failed to configure")

    # En modo debug, mostrar detalles
    if logger.isEnabledFor(logging.DEBUG):
        logger.debug(f"Router configuration details: {router_stats}")


def get_router_statistics() -> Dict[str, Any]:
    """
    Obtiene estadísticas de los routers configurados.

    Returns:
        Diccionario con estadísticas de routers
    """
    stats = {"total_routers": len(routers), "routers": []}

    for router in routers:
        router_info = {
            "prefix": getattr(router, "prefix", ""),
            "tags": getattr(router, "tags", []),
            "routes_count": len(router.routes) if hasattr(router, "routes") else 0,
            "route_methods": [],
        }

        # Obtener métodos de las rutas
        if hasattr(router, "routes"):
            for route in router.routes:
                if hasattr(route, "methods") and hasattr(route.methods, "__iter__"):
                    if isinstance(router_info["route_methods"], list):
                        router_info["route_methods"].extend(route.methods)

        if isinstance(stats["routers"], list):
            stats["routers"].append(router_info)

    return stats
