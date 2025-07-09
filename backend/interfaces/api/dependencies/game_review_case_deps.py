from fastapi import Depends
from sqlalchemy.orm import Session

from application.use_cases.game import (
    GetGameReviewByIdUseCase,
    GetGameReviewsByGameIdUseCase,
    GetAllGameReviewsUseCase,
)
from domain.repositories import IGameReviewRepository
from infrastructure.db.repositories import (
    PostgresGameReviewRepository,
)

from infrastructure.db.connection import get_db


def get_game_review_repository(
    db: Session = Depends(get_db),
) -> IGameReviewRepository:
    return PostgresGameReviewRepository(db)


def get_all_game_reviews_use_case(
    game_review_repo: IGameReviewRepository = Depends(get_game_review_repository),
) -> GetAllGameReviewsUseCase:
    return GetAllGameReviewsUseCase(game_review_repo=game_review_repo)


def get_game_reviews_by_game_id_use_case(
    game_review_repo: IGameReviewRepository = Depends(get_game_review_repository),
) -> GetGameReviewsByGameIdUseCase:
    return GetGameReviewsByGameIdUseCase(game_review_repo=game_review_repo)


def get_game_review_by_id_use_case(
    game_review_repo: IGameReviewRepository = Depends(get_game_review_repository),
) -> GetGameReviewByIdUseCase:
    return GetGameReviewByIdUseCase(game_review_repo=game_review_repo)
