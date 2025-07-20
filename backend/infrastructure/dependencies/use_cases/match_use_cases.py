from application.mixins.dto_converter_mixin import (
    BidirectionalConverter,
    EntityToDTOConverter,
)
from application.use_cases.match import (
    CreateMatchUseCase,
    GetMatchByIdUseCase,
    GetMatchesByGameIdUseCase,
)
from domain.repositories.game_repository import IGameRepository
from domain.repositories.match_repository import IMatchRepository
from domain.repositories.user_repository import IUserRepository
from dtos.response.user.user_response import UserResponseDTO
from fastapi import Depends
from infrastructure.dependencies.converters.match_converters import (
    get_match_converter,
    get_match_entity_to_dto_converter,
)
from infrastructure.dependencies.repositories.database_repos import (
    get_game_repository,
    get_match_repository,
    get_user_repository,
)
from infrastructure.dependencies.use_cases.auth_use_cases import (
    get_current_user_from_request_use_case,
)


def get_create_match_use_case(
    user: UserResponseDTO = Depends(get_current_user_from_request_use_case),
    match_repo: IMatchRepository = Depends(get_match_repository),
    game_repo: IGameRepository = Depends(get_game_repository),
    user_repo: IUserRepository = Depends(get_user_repository),
    match_converter: BidirectionalConverter = Depends(get_match_converter),
) -> CreateMatchUseCase:
    """Get create match use case dependency."""
    return CreateMatchUseCase(
        user=user,
        match_repo=match_repo,
        game_repo=game_repo,
        user_repo=user_repo,
        match_converter=match_converter,
    )


def get_matches_by_game_id_use_case(
    match_repo: IMatchRepository = Depends(get_match_repository),
    match_converter: EntityToDTOConverter = Depends(get_match_entity_to_dto_converter),
    game_repo: IGameRepository = Depends(get_game_repository),
) -> GetMatchesByGameIdUseCase:
    """Get all matches use case dependency."""
    return GetMatchesByGameIdUseCase(
        match_repo=match_repo,
        game_repo=game_repo,
        match_converter=match_converter,
    )


def get_match_by_id_use_case(
    match_repo: IMatchRepository = Depends(get_match_repository),
    game_repo: IGameRepository = Depends(get_game_repository),
    match_converter: BidirectionalConverter = Depends(get_match_converter),
) -> GetMatchByIdUseCase:
    """Get match by id use case dependency."""
    return GetMatchByIdUseCase(
        match_repo=match_repo,
        game_repo=game_repo,
        match_converter=match_converter,
    )


__all__ = [
    "get_create_match_use_case",
    "get_matches_by_game_id_use_case",
    "get_match_by_id_use_case",
]
