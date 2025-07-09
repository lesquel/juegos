from domain.repositories import IGameReviewRepository
from dtos.response.game import GameReviewResponseDTO
from domain.exceptions import GameReviewNotFoundError


from infrastructure.logging import get_logger

logger = get_logger("get_game_by_id_use_case")


class GetGameReviewByIdUseCase:
    def __init__(self, game_review_repo: IGameReviewRepository):
        self.game_review_repo = game_review_repo

    def execute(self, review_id: str) -> GameReviewResponseDTO | None:
        game_review = self.game_review_repo.get_by_id(review_id)
        if not game_review:
            logger.warning(f"Game review not found: {review_id}")
            raise GameReviewNotFoundError(f"Game review with ID {review_id} not found")
        return GameReviewResponseDTO(
            review_id=str(game_review.review_id),
            game_id=str(game_review.game_id),
            user_id=str(game_review.user_id),
            rating=game_review.rating,
            comment=game_review.comment,
            created_at=game_review.created_at,
            updated_at=game_review.updated_at,
        )
