from fastapi import Depends
from sqlalchemy.orm import Session

from application.use_cases.game import (
    GetGameReviewByIdUseCase,
    GetGameReviewsByGameIdUseCase,
    GetAllGameReviewsUseCase,
    CreateGameReviewUseCase,
)
from domain.repositories import IGameReviewRepository
from dtos.response.user.user_response_dto import UserBaseResponseDTO
from infrastructure.db.repositories import (
    PostgresGameReviewRepository,
)

from infrastructure.db.connection import get_db
from interfaces.api.dependencies.auth_case_deps import get_current_user


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


def get_create_game_review_use_case(
    user: UserBaseResponseDTO = Depends(get_current_user),
    game_review_repo: IGameReviewRepository = Depends(get_game_review_repository),
) -> CreateGameReviewUseCase:
    return CreateGameReviewUseCase(user=user, review_repository=game_review_repo)
