from domain.repositories import ICategoryRepository
from dtos.response.game import CategoryResponseDTO

from infrastructure.logging import get_logger

logger = get_logger("get_all_categories_use_case")


class GetAllCategoriesUseCase:
    def __init__(self, category_repo: ICategoryRepository):
        self.category_repo = category_repo

    def execute(
        self, pagination, filters, sort_params
    ) -> tuple[list[CategoryResponseDTO], int]:
        categories, count = self.category_repo.get_paginated(pagination, filters, sort_params)
        if not categories:
            logger.warning("No categories found with the given filters and pagination")
            return [], 0
        categories = [
            CategoryResponseDTO(
                category_id=str(category.category_id),
                category_name=category.category_name,
                category_img=category.category_img,
                category_description=category.category_description,
                games=[str(game.game_id) for game in category.games] if category.games else None,
                created_at=category.created_at,
                updated_at=category.updated_at,
            )
            for category in categories
        ]

        return categories, count

