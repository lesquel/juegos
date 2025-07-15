"""Match use cases dependencies."""

from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.use_cases.match import (
    CreateMatchUseCase,
    GetAllMatchesUseCase,
    GetMatchByIdUseCase,
    JoinMatchUseCase,
    UpdateMatchScoreUseCase,
    GetMatchParticipantsUseCase,
    DeleteMatchUseCase,
)
from infrastructure.db.connection import get_async_db
from infrastructure.dependencies.repositories.database_repos import (
    get_match_repository,
    get_game_repository,
)
from infrastructure.dependencies.converters.match_converters_dependency import (
    get_match_converter,
    get_match_participation_converter,
)


def get_create_match_use_case(
    session: Annotated[AsyncSession, Depends(get_async_db)],
    match_repository: Annotated[None, Depends(get_match_repository)],
    game_repository: Annotated[None, Depends(get_game_repository)],
    match_converter: Annotated[None, Depends(get_match_converter)],
) -> CreateMatchUseCase:
    """Get create match use case dependency."""
    return CreateMatchUseCase(
        match_repository=match_repository,
        game_repository=game_repository,
        match_converter=match_converter,
        session=session,
    )


def get_get_all_matches_use_case(
    match_repository: Annotated[None, Depends(get_match_repository)],
    match_converter: Annotated[None, Depends(get_match_converter)],
) -> GetAllMatchesUseCase:
    """Get all matches use case dependency."""
    return GetAllMatchesUseCase(
        match_repository=match_repository,
        match_converter=match_converter,
    )


def get_get_match_by_id_use_case(
    match_repository: Annotated[None, Depends(get_match_repository)],
    match_converter: Annotated[None, Depends(get_match_converter)],
) -> GetMatchByIdUseCase:
    """Get match by id use case dependency."""
    return GetMatchByIdUseCase(
        match_repository=match_repository,
        match_converter=match_converter,
    )


def get_join_match_use_case(
    session: Annotated[AsyncSession, Depends(get_async_db)],
    match_repository: Annotated[None, Depends(get_match_repository)],
    match_participation_converter: Annotated[None, Depends(get_match_participation_converter)],
) -> JoinMatchUseCase:
    """Get join match use case dependency."""
    return JoinMatchUseCase(
        match_repository=match_repository,
        match_participation_converter=match_participation_converter,
        session=session,
    )


def get_update_match_score_use_case(
    session: Annotated[AsyncSession, Depends(get_async_db)],
    match_repository: Annotated[None, Depends(get_match_repository)],
    match_converter: Annotated[None, Depends(get_match_converter)],
) -> UpdateMatchScoreUseCase:
    """Get update match score use case dependency."""
    return UpdateMatchScoreUseCase(
        match_repository=match_repository,
        match_converter=match_converter,
        session=session,
    )


def get_get_match_participants_use_case(
    match_repository: Annotated[None, Depends(get_match_repository)],
    match_participation_converter: Annotated[None, Depends(get_match_participation_converter)],
) -> GetMatchParticipantsUseCase:
    """Get match participants use case dependency."""
    return GetMatchParticipantsUseCase(
        match_repository=match_repository,
        match_participation_converter=match_participation_converter,
    )


def get_delete_match_use_case(
    session: Annotated[AsyncSession, Depends(get_async_db)],
    match_repository: Annotated[None, Depends(get_match_repository)],
) -> DeleteMatchUseCase:
    """Get delete match use case dependency."""
    return DeleteMatchUseCase(
        match_repository=match_repository,
        session=session,
    )
