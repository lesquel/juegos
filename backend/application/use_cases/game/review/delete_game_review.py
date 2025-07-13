from uuid import UUID
from application.interfaces.base_use_case import BaseUseCase
from domain.entities.game.game_review import GameReviewEntity
from domain.exceptions.auth import AuthenticationError
from domain.exceptions.game import GameReviewNotFoundError
from domain.repositories.game_review_repository import IGameReviewRepository
from dtos.request.game.game_review_request_dto import CreateGameReviewRequestDTO
from dtos.response.game.game_review_response_dto import GameReviewResponseDTO
from dtos.response.user.user_response_dto import UserBaseResponseDTO
from application.mixins.dto_converter_mixin import (
    BidirectionalConverter,
)
from infrastructure.logging import log_execution, log_performance


class DeleteGameReviewUseCase(
    BaseUseCase[CreateGameReviewRequestDTO, GameReviewResponseDTO]
):
    def __init__(
        self,
        user: UserBaseResponseDTO,
        review_repository: IGameReviewRepository,
    ):
        super().__init__()
        self.user = user
        self.review_repository = review_repository

    @log_execution(include_args=False, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(self, game_review_id: str) -> None:
        self.logger.info(
            f"Deleting review for game {game_review_id} by user {self.user.user_id}"
        )

        if not self.user:
            self.logger.error("User is not authenticated")
            raise AuthenticationError("User must be authenticated to delete a review")

        existing_review = await self.review_repository.get_by_id(game_review_id)

        if not existing_review:
            self.logger.error(
                f"No review found for game {game_review_id} by user {self.user.user_id}"
            )
            raise GameReviewNotFoundError("Review not found")

        if existing_review.user_id != self.user.user_id:
            self.logger.error(
                f"User {self.user.user_id} is not authorized to delete review {game_review_id}"
            )
            raise AuthenticationError("User is not authorized to delete this review")

        # Lógica para eliminar la reseña
        await self.review_repository.delete(game_review_id)


        self.logger.info(
            f"Successfully deleted review for game {game_review_id} by user {self.user.user_id}"
        )

