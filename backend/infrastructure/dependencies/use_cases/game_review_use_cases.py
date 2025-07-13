from fastapi import Depends

from application.mixins.dto_converter_mixin import (
    EntityToDTOConverter,
    BidirectionalConverter,
)
from application.use_cases.game import (
    GetGameReviewByIdUseCase,
    GetGameReviewsByGameIdUseCase,
    CreateGameReviewUseCase,
    UpdateGameReviewUseCase,
    DeleteGameReviewUseCase,
)


from domain.repositories import IGameReviewRepository
from dtos.response.user.user_response_dto import UserBaseResponseDTO

from ..repositories import get_game_review_repository
from ..converters import (
    get_game_review_converter,
    get_game_review_entity_to_dto_converter,
)
from .auth_use_cases import get_current_user_from_request_use_case


def get_game_reviews_by_game_id_use_case(
    game_review_repo: IGameReviewRepository = Depends(get_game_review_repository),
    review_converter: EntityToDTOConverter = Depends(
        get_game_review_entity_to_dto_converter
    ),
) -> GetGameReviewsByGameIdUseCase:
    return GetGameReviewsByGameIdUseCase(
        game_review_repo=game_review_repo,
        game_review_converter=review_converter,
    )


def get_game_review_by_id_use_case(
    game_review_repo: IGameReviewRepository = Depends(get_game_review_repository),
    review_converter: EntityToDTOConverter = Depends(
        get_game_review_entity_to_dto_converter
    ),
) -> GetGameReviewByIdUseCase:
    return GetGameReviewByIdUseCase(
        game_review_repo=game_review_repo,
        game_review_converter=review_converter,
    )


def get_create_game_review_use_case(
    user: UserBaseResponseDTO = Depends(get_current_user_from_request_use_case),
    game_review_repo: IGameReviewRepository = Depends(get_game_review_repository),
    review_converter: BidirectionalConverter = Depends(get_game_review_converter),
) -> CreateGameReviewUseCase:
    return CreateGameReviewUseCase(
        user=user,
        review_repository=game_review_repo,
        game_review_converter=review_converter,
    )


def get_update_game_review_use_case(
    user: UserBaseResponseDTO = Depends(get_current_user_from_request_use_case),
    game_review_repo: IGameReviewRepository = Depends(get_game_review_repository),
    review_converter: BidirectionalConverter = Depends(get_game_review_converter),
) -> UpdateGameReviewUseCase:
    return UpdateGameReviewUseCase(
        user=user,
        review_repository=game_review_repo,
        game_review_converter=review_converter,
    )


def get_delete_game_review_use_case(
    user: UserBaseResponseDTO = Depends(get_current_user_from_request_use_case),
    game_review_repo: IGameReviewRepository = Depends(get_game_review_repository),
) -> DeleteGameReviewUseCase:
    return DeleteGameReviewUseCase(
        user=user,
        review_repository=game_review_repo,
    )


__all__ = [
    "get_game_reviews_by_game_id_use_case",
    "get_game_review_by_id_use_case",
    "get_create_game_review_use_case",
    "get_update_game_review_use_case",
    "get_delete_game_review_use_case",
]
