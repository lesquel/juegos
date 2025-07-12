from application.use_cases.user import GetAllUsersUseCase, GetUserByIdUseCase
from domain.repositories import IUserRepository  

from fastapi import Depends

from infrastructure.db.connection import get_db
from sqlalchemy.orm import Session
from infrastructure.db.repositories import PostgresUserRepository


def get_user_repository(db: Session = Depends(get_db)) -> IUserRepository:
    return PostgresUserRepository(db)


def get_all_users_use_case(
    user_repo: IUserRepository = Depends(get_user_repository),
) -> GetAllUsersUseCase:
    return GetAllUsersUseCase(user_repo=user_repo)


def get_user_by_id_use_case(
    user_repo: IUserRepository = Depends(get_user_repository),
) -> GetUserByIdUseCase:
    return GetUserByIdUseCase(user_repo=user_repo)
