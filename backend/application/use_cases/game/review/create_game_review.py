from uuid import UUID
from domain.entities.game.game_review import GameReviewEntity
from domain.exceptions.auth import AuthenticationError
from domain.exceptions.game import GameReviewAlreadyExistsError
from domain.repositories.game_review_repository import IGameReviewRepository
from dtos.request.game.game_review_request_dto import CreateGameReviewRequestDTO

from dtos.response.user.user_response_dto import UserBaseResponseDTO
from infrastructure.logging import get_logger

logger = get_logger("create_game_review_use_case")


class CreateGameReviewUseCase:
    def __init__(
        self, user: UserBaseResponseDTO, review_repository: IGameReviewRepository
    ):
        self.user = user
        self.review_repository = review_repository

    def execute(self, game_id: str, review_dto: CreateGameReviewRequestDTO):
        if not self.user:
            logger.error("User is not authenticated")
            raise AuthenticationError("User must be authenticated to create a review")

        new_review = GameReviewEntity(
            review_id=None,
            user_id=self.user.user_id,
            game_id=game_id,
            rating=review_dto.rating,
            comment=review_dto.comment,
        )
        # Create the review in the repository
        return self.review_repository.save(new_review)
