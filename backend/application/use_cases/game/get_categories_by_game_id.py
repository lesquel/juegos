from domain.repositories import ICategoryRepository
from dtos.response.game import CategoryResponseDTO

from infrastructure.logging import get_logger

logger = get_logger("get_all_games_use_case")


class GetCategoriesByGameIdUseCase:
    def __init__(self, category_repo: ICategoryRepository):
        self.category_repo = category_repo

    def execute(
        self, game_id, pagination, filters, sort_params
    ) -> tuple[list[CategoryResponseDTO], int]:
        categories, count = self.category_repo.get_by_game_id(
            game_id, pagination, filters, sort_params
        )
        if not categories:
            logger.warning("No categories found with the given filters and pagination")
            return [], 0
        categories = [
            CategoryResponseDTO(
                category_id=category.category_id,
                category_name=category.category_name,
                category_description=category.category_description,
                category_img=category.category_img,
            )
            for category in categories
        ]

        return categories, count
