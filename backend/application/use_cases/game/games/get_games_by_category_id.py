from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.repositories import IGameRepository
from dtos.response.game import GameResponseDTO
from infrastructure.logging import log_execution, log_performance


class GetGamesByCategoryIdUseCase(BaseUseCase):
    def __init__(
        self, game_repo: IGameRepository, game_converter: EntityToDTOConverter
    ):
        super().__init__()
        self.game_repo = game_repo
        self.converter = game_converter

    @log_execution(include_args=True, include_result=False, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self, game_id, pagination, filters, sort_params
    ) -> tuple[list[GameResponseDTO], int]:
        self.logger.info(f"Getting games by category_id: {game_id}")
        games, count = await self.game_repo.get_by_category_id(
            game_id, pagination, filters, sort_params
        )

        if not games:
            self.logger.warning(
                "No games found with the given category, filters and pagination"
            )
            return [], 0

        self.logger.info(f"Found {count} games for category_id: {game_id}")

        return self.converter.to_dto_list(games), count
