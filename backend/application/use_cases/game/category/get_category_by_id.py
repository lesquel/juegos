from domain.exceptions.game import CategoryNotFoundError
from domain.repositories import ICategoryRepository
from dtos.response.game import CategoryResponseDTO

from infrastructure.logging import get_logger

logger = get_logger("get_all_categories_use_case")


class GetCategoryByIdUseCase:
    def __init__(self, category_repo: ICategoryRepository):
        self.category_repo = category_repo

    def execute(
        self, category_id: str
    ) -> CategoryResponseDTO:
        logger.debug(f"Getting category with ID: {category_id}")
        category = self.category_repo.get_by_id(category_id)
        if not category:
            logger.warning(f"Category not found with ID: {category_id}")
            raise CategoryNotFoundError(f"Category with ID {category_id} not found")
        return CategoryResponseDTO(
            category_id=str(category.category_id),
            category_name=category.category_name,
            category_img=category.category_img,
            category_description=category.category_description,
            games=[str(game.game_id) for game in category.games] if category.games else None,
            created_at=category.created_at,
            updated_at=category.updated_at,
        )

