from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.repositories import ICategoryRepository
from dtos.response.game import CategoryResponseDTO
from infrastructure.logging import log_execution, log_performance


class GetCategoriesByGameIdUseCase(BaseUseCase[str, CategoryResponseDTO]):
    def __init__(
        self,
        category_repo: ICategoryRepository,
        category_converter: EntityToDTOConverter,
    ):
        super().__init__()
        self.category_repo = category_repo
        self.converter = category_converter

    @log_execution(include_args=True, include_result=False, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self, game_id, pagination, filters, sort_params
    ) -> tuple[list[CategoryResponseDTO], int]:
        self.logger.info(f"Getting categories by game_id: {game_id}")
        categories, count = await self.category_repo.get_by_game_id(
            game_id, pagination, filters, sort_params
        )

        if not categories:
            self.logger.warning(
                "No categories found with the given filters and pagination"
            )
            return [], 0

        self.logger.info(f"Found {count} categories for game_id: {game_id}")

        return self.converter.to_dto_list(categories), count
