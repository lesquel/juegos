from application.converters.user.user_converters import UserEntityToDTOConverter
from application.mixins.dto_converter_mixin import EntityToDTOConverter


def get_user_converter() -> EntityToDTOConverter:
    """
    Proveedor para el convertidor de usuario.

    Returns:
        EntityToDTOConverter: Convertidor de UserEntity a UserResponseDTO
    """
    return UserEntityToDTOConverter()


__all__ = [
    "get_user_converter",
]
