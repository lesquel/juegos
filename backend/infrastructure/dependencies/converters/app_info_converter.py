from application.converters.app_info import AppInfoEntityToDTOConverter
from application.mixins.dto_converter_mixin import EntityToDTOConverter


def get_app_info_converter() -> EntityToDTOConverter:
    """
    Proveedor para el convertidor de información de la aplicación.

    Returns:
        EntityToDTOConverter: Convertidor de AppInfoEntity a AppInfoResponseDTO
    """
    return AppInfoEntityToDTOConverter()


# Exportar todos los proveedores
__all__ = [
    "get_app_info_converter",
]
