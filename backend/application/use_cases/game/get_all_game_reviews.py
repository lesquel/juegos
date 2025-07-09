from domain.repositories import IGameReviewRepository
from dtos.response.game import GameReviewResponseDTO

from infrastructure.logging import get_logger

logger = get_logger("get_all_game_reviews_use_case")


class GetAllGameReviewsUseCase:
    def __init__(self, game_review_repo: IGameReviewRepository):
        self.game_review_repo = game_review_repo

    def execute(
        self, pagination, filters, sort_params
    ) -> tuple[list[GameReviewResponseDTO], int]:
        game_reviews, count = self.game_review_repo.get_paginated(pagination, filters, sort_params)
        if not game_reviews:
            logger.warning("No game reviews found with the given filters and pagination")
            return [], 0
        game_reviews = [
            GameReviewResponseDTO(
                review_id=str(review.review_id),
                game_id=str(review.game_id),
                user_id=str(review.user_id),
                rating=review.rating,
                comment=review.comment,
                created_at=review.created_at,
                updated_at=review.updated_at,
            )
            for review in game_reviews
        ]
        return game_reviews, count

