from application.mixins.dto_converter_mixin import EntityToDTOConverter
from application.use_cases.user import GetAllUsersUseCase, GetUserByIdUseCase
from domain.repositories import IUserRepository
from fastapi import Depends

from ..converters import get_user_converter
from ..repositories import get_user_repository


def get_all_users_use_case(
    user_repo: IUserRepository = Depends(get_user_repository),
    user_converter: EntityToDTOConverter = Depends(get_user_converter),
) -> GetAllUsersUseCase:
    """
    Proveedor para el caso de uso de obtener todos los usuarios.

    Args:
        user_repo: Repositorio de usuarios inyectado
        user_converter: Convertidor de usuario inyectado

    Returns:
        GetAllUsersUseCase: Caso de uso configurado
    """
    return GetAllUsersUseCase(user_repo=user_repo, user_converter=user_converter)


def get_user_by_id_use_case(
    user_repo: IUserRepository = Depends(get_user_repository),
    user_converter: EntityToDTOConverter = Depends(get_user_converter),
) -> GetUserByIdUseCase:
    """
    Proveedor para el caso de uso de obtener usuario por ID.

    Args:
        user_repo: Repositorio de usuarios inyectado
        user_converter: Convertidor de usuario inyectado

    Returns:
        GetUserByIdUseCase: Caso de uso configurado
    """
    return GetUserByIdUseCase(user_repo=user_repo, user_converter=user_converter)


# Exportar todos los proveedores
__all__ = [
    "get_all_users_use_case",
    "get_user_by_id_use_case",
]
