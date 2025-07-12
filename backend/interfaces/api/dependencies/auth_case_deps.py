from application.use_cases.auth import (
    GetCurrentUserUseCase,
    RegisterUserUseCase,
    LoginUserUseCase,
)

from domain.exceptions.auth import AuthenticationError
from domain.interfaces.token_provider import ITokenProvider
from domain.repositories import IUserRepository
from dtos.response.user.user_response_dto import UserResponseDTO
from infrastructure.auth import PasswordHasher
from fastapi.security import HTTPAuthorizationCredentials

from infrastructure.auth.security import CustomHTTPBearer


from fastapi import Depends

from infrastructure.auth.jwt_service import get_token_provider

from .user_case_deps import get_user_repository

security = CustomHTTPBearer()


def get_password_hasher() -> PasswordHasher:
    return PasswordHasher()


def get_register_user_use_case(
    user_repo: IUserRepository = Depends(get_user_repository),
    password_hasher: PasswordHasher = Depends(get_password_hasher),
) -> RegisterUserUseCase:
    return RegisterUserUseCase(user_repo=user_repo, password_hasher=password_hasher)


def get_login_use_case(
    user_repo: IUserRepository = Depends(get_user_repository),
    password_hasher: PasswordHasher = Depends(get_password_hasher),
    token_provider: ITokenProvider = Depends(get_token_provider),
) -> LoginUserUseCase:
    return LoginUserUseCase(
        user_repo=user_repo,
        password_hasher=password_hasher,
        token_provider=token_provider,
    )


def get_current_user_use_case(
    user_repo: IUserRepository = Depends(get_user_repository),
    token_provider: ITokenProvider = Depends(get_token_provider),
) -> GetCurrentUserUseCase:
    return GetCurrentUserUseCase(user_repo, token_provider)


def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security),
    use_case: GetCurrentUserUseCase = Depends(get_current_user_use_case),
) -> UserResponseDTO:
    """Dependency function para obtener usuario actual"""
    return use_case.execute(token.credentials)
