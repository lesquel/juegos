from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials

from application.interfaces.base_assembler import BaseAssembler
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from application.use_cases.auth import (
    GetCurrentUserUseCase,
    RegisterUserUseCase,
    LoginUserUseCase,
)
from domain.interfaces.token_provider import ITokenProvider
from domain.repositories import IUserRepository
from dtos.response.auth.auth_response_dto import LoginResponseDTO
from dtos.response.user.user_response_dto import UserResponseDTO
from application.interfaces.password_hasher import IPasswordHasher
from infrastructure.dependencies.converters.auth_converters import get_login_assembler
from infrastructure.dependencies.converters.auth_converters import get_login_assembler

from ..repositories import get_user_repository
from ..services import get_password_hasher, get_token_provider, get_security_scheme
from ..converters import (
    get_user_converter,
    get_user_registration_converter,
)

security = get_security_scheme()


def get_register_user_use_case(
    user_repo: IUserRepository = Depends(get_user_repository),
    password_hasher: IPasswordHasher = Depends(get_password_hasher),
    user_converter: EntityToDTOConverter = Depends(get_user_registration_converter),
) -> RegisterUserUseCase:
    """
    Proveedor para el caso de uso de registro de usuario.

    Args:
        user_repo: Repositorio de usuarios inyectado
        password_hasher: Servicio de hash de contraseñas inyectado
        user_converter: Convertidor de usuario inyectado

    Returns:
        RegisterUserUseCase: Caso de uso configurado
    """
    return RegisterUserUseCase(
        user_repo=user_repo,
        password_hasher=password_hasher,
        user_converter=user_converter,
    )


def get_login_use_case(
    user_repo: IUserRepository = Depends(get_user_repository),
    password_hasher: IPasswordHasher = Depends(get_password_hasher),
    token_provider: ITokenProvider = Depends(get_token_provider),
    user_converter: EntityToDTOConverter = Depends(get_user_converter),
    login_assembler: BaseAssembler[LoginResponseDTO] = Depends(get_login_assembler),
) -> LoginUserUseCase:
    """
    Proveedor para el caso de uso de login de usuario.

    Args:
        user_repo: Repositorio de usuarios inyectado
        password_hasher: Servicio de hash de contraseñas inyectado
        token_provider: Proveedor de tokens inyectado
        user_converter: Convertidor de usuario inyectado

    Returns:
        LoginUserUseCase: Caso de uso configurado
    """
    return LoginUserUseCase(
        user_repo=user_repo,
        password_hasher=password_hasher,
        token_provider=token_provider,
        user_converter=user_converter,
        login_assembler=login_assembler,
    )


def get_current_user_use_case(
    user_repo: IUserRepository = Depends(get_user_repository),
    token_provider: ITokenProvider = Depends(get_token_provider),
    user_converter: EntityToDTOConverter = Depends(get_user_converter),
) -> GetCurrentUserUseCase:
    """
    Proveedor para el caso de uso de obtener usuario actual.

    Args:
        user_repo: Repositorio de usuarios inyectado
        token_provider: Proveedor de tokens inyectado
        user_converter: Convertidor de usuario inyectado

    Returns:
        GetCurrentUserUseCase: Caso de uso configurado
    """
    return GetCurrentUserUseCase(user_repo, token_provider, user_converter)


async def get_current_user_from_request_use_case(
    token: HTTPAuthorizationCredentials = Depends(security),
    use_case: GetCurrentUserUseCase = Depends(get_current_user_use_case),
) -> UserResponseDTO:
    """
    Dependency function para obtener usuario actual desde token.

    Args:
        token: Credenciales HTTP Bearer inyectadas
        use_case: Caso de uso de obtener usuario actual inyectado

    Returns:
        UserResponseDTO: Usuario autenticado
    """
    return await use_case.execute(token.credentials)


# Exportar todos los proveedores
__all__ = [
    "get_register_user_use_case",
    "get_login_use_case",
    "get_current_user_use_case",
    "get_current_user_from_request_use_case",
    "security",
]
