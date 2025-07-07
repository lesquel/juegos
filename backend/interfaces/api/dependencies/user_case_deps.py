from application.use_cases.user import GetAllUsersUseCase, GetUserUseCase

from fastapi import Depends

from infrastructure.db.connection import get_db
from sqlalchemy.orm import Session
from infrastructure.db.repositories import PostgresUserRepository



def get_all_users_use_case(db: Session = Depends(get_db)) -> GetAllUsersUseCase:
    user_repo = PostgresUserRepository(db)
    return GetAllUsersUseCase(user_repo=user_repo)


def get_user_use_case(db: Session = Depends(get_db)) -> GetUserUseCase:
    user_repo = PostgresUserRepository(db)
    return GetUserUseCase(user_repo=user_repo)
