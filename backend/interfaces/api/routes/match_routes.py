from fastapi import APIRouter, Depends, Request, HTTPException, status
from uuid import UUID
from typing import List, Annotated

from infrastructure.logging import get_logger
from dtos import PaginatedResponseDTO
from dtos.request.match.match_request_dto import (
    CreateMatchRequestDTO,
    JoinMatchRequestDTO,
    UpdateMatchScoreRequestDTO,
)
from dtos.response.match.match_response_dto import (
    MatchResponseDTO,
    MatchSummaryResponseDTO,
)
from interfaces.api.common import (
    PaginationParams,
    get_pagination_params,
    SortParams,
    get_sort_params,
)
from interfaces.api.common.response_utils import handle_paginated_request

# Import use cases
from application.use_cases.match import (
    CreateMatchUseCase,
    GetAllMatchesUseCase,
    GetMatchByIdUseCase,
    JoinMatchUseCase,
    UpdateMatchScoreUseCase,
    GetMatchParticipantsUseCase,
    DeleteMatchUseCase,
)
from infrastructure.dependencies.use_cases.match_use_cases_dependency import (
    get_create_match_use_case,
    get_get_all_matches_use_case,
    get_get_match_by_id_use_case,
    get_join_match_use_case,
    get_update_match_score_use_case,
    get_get_match_participants_use_case,
    get_delete_match_use_case,
)
# )

match_router = APIRouter(prefix="/matches", tags=["Matches"])

# Configurar logger
logger = get_logger("match_routes")


@match_router.post(
    "/", response_model=MatchResponseDTO, status_code=status.HTTP_201_CREATED
)
async def create_match(
    match_data: CreateMatchRequestDTO,
    use_case: Annotated[CreateMatchUseCase, Depends(get_create_match_use_case)],
) -> MatchResponseDTO:
    """
    Crea una nueva partida.

    Args:
        match_data: Datos para crear la partida (game_id, start_time, end_time)

    Returns:
        MatchResponseDTO: Datos de la partida creada
    """
    try:
        # TODO: Get user_id from authentication context
        user_id = "user_123"  # Placeholder
        result = await use_case.execute(match_data, user_id)
        return result
    except Exception as e:
        logger.error(f"Error creating match: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating match: {str(e)}",
        )


@match_router.get("/", response_model=PaginatedResponseDTO[MatchSummaryResponseDTO])
async def get_all_matches(
    request: Request,
    use_case: Annotated[GetAllMatchesUseCase, Depends(get_get_all_matches_use_case)],
    pagination: PaginationParams = Depends(get_pagination_params),
    sort_params: SortParams = Depends(get_sort_params),
) -> PaginatedResponseDTO[MatchSummaryResponseDTO]:
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
    try:
        return await handle_paginated_request(
            use_case, request, pagination, sort_params
        )
    except Exception as e:
        logger.error(f"Error getting matches: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting matches: {str(e)}",
        )


@match_router.get("/{match_id}", response_model=MatchResponseDTO)
async def get_match(
    match_id: UUID,
    use_case: Annotated[GetMatchByIdUseCase, Depends(get_get_match_by_id_use_case)],
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
    score_data: UpdateMatchScoreRequestDTO,
    use_case: Annotated[UpdateMatchScoreUseCase, Depends(get_update_match_score_use_case)],
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
    use_case: Annotated[GetMatchParticipantsUseCase, Depends(get_get_match_participants_use_case)],
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


@match_router.delete("/{match_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_match(
    match_id: UUID,
    use_case: Annotated[DeleteMatchUseCase, Depends(get_delete_match_use_case)],
    # current_user: UserEntity = Depends(get_current_user),
) -> None:
    """
    Elimina una partida específica.

    Args:
        match_id: ID único de la partida

    Returns:
        None: No content (204)
    """
    try:
        # TODO: Get user_id from authentication context
        user_id = "user_admin"  # Placeholder
        await use_case.execute(str(match_id), user_id)
    except Exception as e:
        logger.error(f"Error deleting match {match_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting match: {str(e)}",
        )
