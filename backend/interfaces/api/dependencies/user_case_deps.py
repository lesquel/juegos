from application.use_cases.user import GetAllUsersUseCase, GetUserUseCase, GetCurrentUserUseCase
from application.use_cases.auth import RegisterUserUseCase, LoginUserUseCase

from domain.interfaces.token_provider import ITokenProvider
from dtos.response.user.user_response_dto import UserResponseDTO
from infrastructure.auth import PasswordHasher
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


from fastapi import Depends

from domain.entities.user.user import UserEntity
from infrastructure.auth.jwt_service import get_token_provider
from infrastructure.db.connection import get_db
from sqlalchemy.orm import Session
from infrastructure.db.repositories import PostgresUserRepository

# Security scheme para Swagger/OpenAPI
security = HTTPBearer()


def get_all_users_use_case(db: Session = Depends(get_db)) -> GetAllUsersUseCase:
    user_repo = PostgresUserRepository(db)
    return GetAllUsersUseCase(user_repo=user_repo)


def get_user_use_case(db: Session = Depends(get_db)) -> GetUserUseCase:
    user_repo = PostgresUserRepository(db)
    return GetUserUseCase(user_repo=user_repo)


def get_register_user_use_case(db: Session = Depends(get_db)) -> RegisterUserUseCase:
    user_repo = PostgresUserRepository(db)
    password_hasher = PasswordHasher()
    return RegisterUserUseCase(user_repo=user_repo, password_hasher=password_hasher)


def get_login_use_case(db: Session = Depends(get_db)) -> LoginUserUseCase:
    user_repo = PostgresUserRepository(db)
    password_hasher = PasswordHasher()
    token_provider = get_token_provider()
    return LoginUserUseCase(
        user_repo=user_repo,
        password_hasher=password_hasher,
        token_provider=token_provider,
    )


def get_login_use_case_no_db(db: Session = Depends(get_db)) -> LoginUserUseCase:
    user_repo = PostgresUserRepository(db)
    password_hasher = PasswordHasher()
    token_provider = get_token_provider()
    return LoginUserUseCase(
        user_repo=user_repo,
        password_hasher=password_hasher,
        token_provider=token_provider,
    )


def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
    token_provider: ITokenProvider = Depends(get_token_provider),
) -> UserResponseDTO:
    """Dependency function para obtener usuario actual"""
    
    user_repo = PostgresUserRepository(db)
    use_case = GetCurrentUserUseCase(user_repo, token_provider)
    current_user = use_case.execute(token)

    return current_user
