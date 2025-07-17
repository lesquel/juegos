"""Match use cases dependencies."""

from fastapi import Depends

from application.interfaces.base_assembler import BaseAssembler
from application.use_cases.match import (
    JoinMatchUseCase,
    GetMatchParticipantsUseCase,
)

from application.mixins.dto_converter_mixin import (
    BidirectionalConverter,
)


from application.use_cases.match.update_match import UpdateMatchUseCase
from domain.repositories.match_repository import IMatchRepository
from domain.repositories.user_repository import IUserRepository

from dtos.response.user.user_response import UserBaseResponseDTO, UserResponseDTO
from infrastructure.dependencies.repositories.database_repos import (
    get_match_repository,
    get_game_repository,
    get_user_repository,
)
from infrastructure.dependencies.converters.match_converters import (
    get_match_converter,
    get_match_participation_converter,
    get_match_participants_response_assembler,
)
from infrastructure.dependencies.use_cases.auth_use_cases import (
    get_current_user_from_request_use_case,
)


def get_join_match_use_case(
    user: UserResponseDTO = Depends(get_current_user_from_request_use_case),
    match_repo: IMatchRepository = Depends(get_match_repository),
    game_repo: IMatchRepository = Depends(get_game_repository),
    user_repo: IUserRepository = Depends(get_user_repository),
    match_converter: BidirectionalConverter = Depends(get_match_converter),
) -> JoinMatchUseCase:
    """Get join match use case dependency."""
    return JoinMatchUseCase(
        user=user,
        match_repo=match_repo,
        game_repo=game_repo,
        user_repo=user_repo,
        match_converter=match_converter,
    )


def get_update_match_use_case(
    match_repo: IMatchRepository = Depends(get_match_repository),
    user_repo: IUserRepository = Depends(get_user_repository),
    match_converter: BidirectionalConverter = Depends(get_match_converter),
) -> UpdateMatchUseCase:
    """Get update match use case dependency."""
    return UpdateMatchUseCase(
        match_repo=match_repo,
        user_repo=user_repo,
        match_converter=match_converter,
    )


def get_match_participants_use_case(
    match_repo: IMatchRepository = Depends(get_match_repository),
    match_participants_assambler: BaseAssembler = Depends(
        get_match_participants_response_assembler
    ),
) -> GetMatchParticipantsUseCase:
    """Get match participants use case dependency."""
    return GetMatchParticipantsUseCase(
        match_repo=match_repo,
        match_participants_assambler=match_participants_assambler,
    )


__all__ = [
    "get_join_match_use_case",
    "get_match_participants_use_case",
]
