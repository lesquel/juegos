from application.converters.auth.login_assembler import LoginResponseAssembler
from application.converters.auth.user_response_converters import (
    UserEntityToBaseResponseDTOConverter,
)
from application.converters.user.user_converters import UserEntityToDTOConverter
from application.mixins.dto_converter_mixin import EntityToDTOConverter


def get_user_converter() -> EntityToDTOConverter:
    """
    Proveedor para el convertidor de usuario.

    Returns:
        EntityToDTOConverter: Convertidor de UserEntity a UserResponseDTO
    """
    return UserEntityToDTOConverter()


def get_user_registration_converter() -> EntityToDTOConverter:
    """
    Proveedor para el convertidor de registro de usuario.

    Returns:
        EntityToDTOConverter: Convertidor de UserEntity a UserBaseResponseDTO
    """
    return UserEntityToBaseResponseDTOConverter()


def get_login_assembler() -> LoginResponseAssembler:
    """
    Proveedor para el ensamblador de respuesta de login.

    Returns:
        LoginResponseAssembler: Ensambla LoginResponseDTO a partir de UserEntity y TokenData
    """
    return LoginResponseAssembler()


# Exportar todos los proveedores
__all__ = [
    "get_user_converter",
    "get_user_registration_converter",
    "get_login_assembler",
]
