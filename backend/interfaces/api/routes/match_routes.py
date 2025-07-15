from fastapi import APIRouter, Depends, Request, HTTPException, status
from uuid import UUID
from typing import List, Annotated

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
from infrastructure.dependencies.use_cases.match_use_cases import (
    get_create_match_use_case,
    get_matches_by_game_id_use_case,
    get_match_by_id_use_case,
    get_join_match_use_case,
    get_update_match_use_case,
    get_get_match_participants_use_case,
)

# )

match_router = APIRouter()

# Configurar logger
logger = get_logger("match_routes")


@match_router.post(
    "/", response_model=MatchResponseDTO, status_code=status.HTTP_201_CREATED
)
async def create_match(
    game_id: UUID,
    match_data: CreateMatchRequestDTO,
    use_case: CreateMatchUseCase = Depends(get_create_match_use_case),
) -> MatchResponseDTO:
    """
    Crea una nueva partida.

    Args:
        match_data: Datos para crear la partida (game_id, start_time, end_time)

    Returns:
        MatchResponseDTO: Datos de la partida creada
    """
    logger.info(f"POST /{game_id}/matches - Request received")

    result = await use_case.execute(game_id, match_data)
    return result


@match_router.get("/", response_model=PaginatedResponseDTO[MatchResponseDTO])
async def get_all_matches(
    game_id: UUID,
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    sort_params: SortParams = Depends(get_sort_params),
    filters: MatchFilterParams = Depends(get_match_filter_params),
    use_case: GetMatchesByGameIdUseCase = Depends(get_matches_by_game_id_use_case),
) -> PaginatedResponseDTO[MatchResponseDTO]:
    """
    Obtiene todas las partidas con paginación.

    Query Parameters:
    - page: Número de página (default: 1)
    - limit: Elementos por página (default: 10, max: 100)
    - sort_by: Campo para ordenar (default: created_at)
    - sort_order: Orden ascendente (asc) o descendente (desc) (default: desc)

    Returns:
        PaginatedResponseDTO[MatchSummaryResponseDTO]: Lista paginada de partidas
    """
    return await handle_paginated_request(
        endpoint_name=f"GET /{game_id}/matches",
        request=request,
        pagination=pagination,
        sort_params=sort_params,
        filters=filters,
        use_case_execute=lambda p, f, s: use_case.execute(str(game_id), p, f, s),
        logger=logger,
    )


@match_router.get("/{match_id}", response_model=MatchResponseDTO)
async def get_match(
    match_id: UUID,
    use_case: Annotated[GetMatchByIdUseCase, Depends(get_match_by_id_use_case)],
) -> MatchResponseDTO:
    """
    Obtiene una partida específica por ID.

    Args:
        match_id: ID único de la partida

    Returns:
        MatchResponseDTO: Datos completos de la partida incluyendo participantes
    """
    try:
        result = await use_case.execute(str(match_id))
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Match with ID {match_id} not found",
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting match {match_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting match: {str(e)}",
        )


@match_router.post("/{match_id}/join", response_model=MatchResponseDTO)
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


@match_router.put("/{match_id}/score", response_model=MatchResponseDTO)
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


@match_router.get("/{match_id}/participants", response_model=List[str])
async def get_match_participants(
    match_id: UUID,
    use_case: Annotated[
        GetMatchParticipantsUseCase, Depends(get_get_match_participants_use_case)
    ],
) -> List[str]:
    """
    Obtiene la lista de participantes de una partida.

    Args:
        match_id: ID único de la partida

    Returns:
        List[str]: Lista de IDs de usuarios participantes
    """
    try:
        result = await use_case.execute(str(match_id))
        return result
    except Exception as e:
        logger.error(f"Error getting match participants {match_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting match participants: {str(e)}",
        )
