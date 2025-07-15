from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.repositories import IGameReviewRepository
from dtos.response.game import GameReviewResponseDTO
from application.interfaces.base_use_case import BaseUseCase
from application.converters.game.game_review_converter import (
    GameReviewEntityToDTOConverter,
)
from infrastructure.logging import log_execution, log_performance


class GetGameReviewsByGameIdUseCase(BaseUseCase):
    def __init__(
        self,
        game_review_repo: IGameReviewRepository,
        game_review_converter: EntityToDTOConverter,
    ):
        super().__init__()
        self.game_review_repo = game_review_repo
        self.converter = game_review_converter

    @log_execution(include_args=True, include_result=False, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self, game_id, pagination, filters, sort_params
    ) -> tuple[list[GameReviewResponseDTO], int]:
        self.logger.info(f"Getting game reviews for game_id: {game_id}")
        game_reviews, count = await self.game_review_repo.get_by_game_id(
            game_id, pagination, filters, sort_params
        )

        if not game_reviews:
            self.logger.warning(
                "No game reviews found with the given filters and pagination"
            )
            return [], 0

        self.logger.info(f"Found {count} game reviews for game_id: {game_id}")

        return self.converter.to_dto_list(game_reviews), count
