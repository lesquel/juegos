from fastapi import Depends

from application.mixins.dto_converter_mixin import EntityToDTOConverter
from application.use_cases.game import (
    GetAllCategoriesUseCase,
    GetCategoryByIdUseCase,
    GetCategoriesByGameIdUseCase,
)

from domain.repositories import ICategoryRepository

from ..repositories import get_category_repository
from ..converters import get_category_converter


def get_all_categories_use_case(
    category_repo: ICategoryRepository = Depends(get_category_repository),
    category_converter: EntityToDTOConverter = Depends(get_category_converter),
) -> GetAllCategoriesUseCase:
    return GetAllCategoriesUseCase(
        category_repo=category_repo, category_converter=category_converter
    )


def get_category_by_id_use_case(
    category_repo: ICategoryRepository = Depends(get_category_repository),
    category_converter: EntityToDTOConverter = Depends(get_category_converter),
) -> GetCategoryByIdUseCase:
    return GetCategoryByIdUseCase(
        category_repo=category_repo, category_converter=category_converter
    )


def get_categories_by_game_id_use_case(
    category_repo: ICategoryRepository = Depends(get_category_repository),
    category_converter: EntityToDTOConverter = Depends(get_category_converter),
) -> GetCategoriesByGameIdUseCase:
    return GetCategoriesByGameIdUseCase(
        category_repo=category_repo, category_converter=category_converter
    )


__all__ = [
    "get_all_categories_use_case",
    "get_category_by_id_use_case",
    "get_categories_by_game_id_use_case",
]
