from fastapi import Depends
from sqlalchemy.orm import Session

from application.use_cases.game import GetAllCategoriesUseCase, GetCategoryByIdUseCase
from infrastructure.db.repositories.category_repository import (
    PostgresCategoryRepository,
)

from infrastructure.db.connection import get_db


def get_all_categories_use_case(
    db: Session = Depends(get_db),
) -> GetAllCategoriesUseCase:
    category_repo = PostgresCategoryRepository(db)
    return GetAllCategoriesUseCase(category_repo=category_repo)


def get_category_by_id_use_case(
    db: Session = Depends(get_db),
) -> GetCategoryByIdUseCase:
    category_repo = PostgresCategoryRepository(db)
    return GetCategoryByIdUseCase(category_repo=category_repo)
