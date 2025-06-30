from application.use_cases.users import GetAllUsersUseCase, GetUserUseCase
from application.use_cases.auth import RegisterUserUseCase, LoginUserUseCase

from domain.interfaces.token_provider import ITokenProvider
from infrastructure.auth import PasswordHasher
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


from typing import Optional
from fastapi import Depends

from domain.entities.user import UserEntity
from infrastructure.auth.jwt_service import get_token_provider
from infrastructure.db.connection import get_db
from sqlalchemy.orm import Session
from infrastructure.db.repositories import PostgresUserRepository
from infrastructure.middleware import AuthenticationMiddleware, security


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
) -> UserEntity:
    """Dependency function para obtener usuario actual"""

    
    return AuthenticationMiddleware.get_current_user_from_token(token, db, token_provider)


def get_optional_current_user(
    token: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    ),
    db: Session = Depends(get_db),
) -> Optional[UserEntity]:
    """Dependency function para obtener usuario actual opcional"""
    if token is None:
        return None
    return AuthenticationMiddleware.get_current_user_from_token(token, db)
