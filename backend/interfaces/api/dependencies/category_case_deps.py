from fastapi import Depends
from sqlalchemy.orm import Session

from application.use_cases.game import (
    GetAllCategoriesUseCase,
    GetCategoryByIdUseCase,
    GetCategoriesByGameIdUseCase,
)

from domain.repositories import ICategoryRepository
from infrastructure.db.repositories.category_repository import (
    PostgresCategoryRepository,
)

from infrastructure.db.connection import get_db


def get_category_repository(db: Session = Depends(get_db)) -> ICategoryRepository:
    return PostgresCategoryRepository(db)


def get_all_categories_use_case(
    category_repo: ICategoryRepository = Depends(get_category_repository),
) -> GetAllCategoriesUseCase:
    return GetAllCategoriesUseCase(category_repo=category_repo)


def get_category_by_id_use_case(
    category_repo: ICategoryRepository = Depends(get_category_repository),
) -> GetCategoryByIdUseCase:
    return GetCategoryByIdUseCase(category_repo=category_repo)


def get_categories_by_game_id_use_case(
    category_repo: ICategoryRepository = Depends(get_category_repository),
) -> GetCategoriesByGameIdUseCase:
    return GetCategoriesByGameIdUseCase(category_repo=category_repo)
