from fastapi import APIRouter, Depends, Request, HTTPException, status
from uuid import UUID
from typing import List, Annotated

from dtos.response.match.match_participants_response_dto import MatchParticipantsResponseDTO
from infrastructure.logging import get_logger
from dtos import PaginatedResponseDTO
from dtos.request.match.match_request_dto import (
    CreateMatchRequestDTO,
    JoinMatchRequestDTO,
    UpdateMatchRequestDTO,
)
from dtos.response.match.match_response_dto import (
    MatchResponseDTO,
)
from interfaces.api.common import (
    PaginationParams,
    get_pagination_params,
    SortParams,
    get_sort_params,
)
from interfaces.api.common.filters.specific_filters.match_filters import (
    MatchFilterParams,
    get_match_filter_params,
)
from interfaces.api.common.response_utils import handle_paginated_request

# Import use cases
from application.use_cases.match import (
    CreateMatchUseCase,
    GetMatchesByGameIdUseCase,
    GetMatchByIdUseCase,
    JoinMatchUseCase,
    UpdateMatchUseCase,
    GetMatchParticipantsUseCase,
)
from infrastructure.dependencies.use_cases.match_participations_use_cases import (
    get_join_match_use_case,
    get_update_match_use_case,
    get_match_participants_use_case,
)



match_participations_router = APIRouter()

# Configurar logger
logger = get_logger("match_participations_routes")


@match_participations_router.post(
    "/", response_model=MatchResponseDTO, status_code=status.HTTP_201_CREATED
)
@match_participations_router.post("/{match_id}/join", response_model=MatchResponseDTO)
async def join_match(
    match_id: UUID,
    join_data: JoinMatchRequestDTO,
    use_case: Annotated[JoinMatchUseCase, Depends(get_join_match_use_case)],
    # current_user: UserEntity = Depends(get_current_user),
) -> MatchResponseDTO:
    """
    Permite a un usuario unirse a una partida existente.

    Args:
        match_id: ID único de la partida
        join_data: Datos para unirse (bet_amount opcional)

    Returns:
        MatchResponseDTO: Datos actualizados de la partida
    """
    try:
        # TODO: Get user_id from authentication context
        user_id = "user_456"  # Placeholder
        result = await use_case.execute(str(match_id), join_data, user_id)
        return result
    except Exception as e:
        logger.error(f"Error joining match {match_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error joining match: {str(e)}",
        )


@match_participations_router.put("/{match_id}/score", response_model=MatchResponseDTO)
async def update_match_score(
    match_id: UUID,
    score_data: UpdateMatchRequestDTO,
    use_case: Annotated[UpdateMatchUseCase, Depends(get_update_match_use_case)],
    # current_user: UserEntity = Depends(get_current_user),
) -> MatchResponseDTO:
    """
    Actualiza la puntuación de un usuario en una partida.

    Args:
        match_id: ID único de la partida
        score_data: Nueva puntuación del usuario

    Returns:
        MatchResponseDTO: Datos actualizados de la partida
    """
    try:
        # TODO: Get user_id from authentication context
        user_id = "user_789"  # Placeholder
        result = await use_case.execute(str(match_id), score_data, user_id)
        return result
    except Exception as e:
        logger.error(f"Error updating match score {match_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating match score: {str(e)}",
        )


@match_participations_router.get("/{match_id}/participants", response_model=MatchParticipantsResponseDTO)
async def get_match_participants(
    match_id: UUID,
    use_case: GetMatchParticipantsUseCase = Depends(
        get_match_participants_use_case
    ),
) -> List[str]:
    """
    Obtiene la lista de participantes de una partida.

    Args:
        match_id: ID único de la partida

    Returns:
        List[str]: Lista de IDs de usuarios participantes
    """
    logger.info(f"GET /matches/{match_id}/participants - Request received")

    return await use_case.execute(str(match_id))
