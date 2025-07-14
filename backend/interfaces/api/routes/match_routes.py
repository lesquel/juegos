from fastapi import APIRouter, Depends, Request, HTTPException, status
from uuid import UUID
from typing import List

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

# TODO: Importar use cases cuando estén disponibles
# from infrastructure.dependencies.use_cases import (
#     get_create_match_use_case,
#     get_join_match_use_case,
#     get_get_match_by_id_use_case,
#     get_get_all_matches_use_case,
#     get_update_match_score_use_case,
# )

match_router = APIRouter(prefix="/matches", tags=["Matches"])

# Configurar logger
logger = get_logger("match_routes")


@match_router.post("/", response_model=MatchResponseDTO, status_code=status.HTTP_201_CREATED)
async def create_match(
    match_data: CreateMatchRequestDTO,
    # use_case: CreateMatchUseCase = Depends(get_create_match_use_case),
) -> MatchResponseDTO:
    """
    Crea una nueva partida.

    Args:
        match_data: Datos para crear la partida (game_id, start_time, end_time)

    Returns:
        MatchResponseDTO: Datos de la partida creada
    """
    # TODO: Implementar cuando los use cases estén disponibles
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Create match functionality not yet implemented"
    )


@match_router.get("/", response_model=PaginatedResponseDTO[MatchSummaryResponseDTO])
async def get_all_matches(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    sort_params: SortParams = Depends(get_sort_params),
    # use_case: GetAllMatchesUseCase = Depends(get_get_all_matches_use_case),
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
    # TODO: Implementar cuando los use cases estén disponibles
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Get all matches functionality not yet implemented"
    )


@match_router.get("/{match_id}", response_model=MatchResponseDTO)
async def get_match(
    match_id: UUID,
    # use_case: GetMatchByIdUseCase = Depends(get_get_match_by_id_use_case),
) -> MatchResponseDTO:
    """
    Obtiene una partida específica por ID.

    Args:
        match_id: ID único de la partida

    Returns:
        MatchResponseDTO: Datos completos de la partida incluyendo participantes
    """
    # TODO: Implementar cuando los use cases estén disponibles
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Get match by ID functionality not yet implemented"
    )


@match_router.post("/{match_id}/join", response_model=MatchResponseDTO)
async def join_match(
    match_id: UUID,
    join_data: JoinMatchRequestDTO,
    # current_user: UserEntity = Depends(get_current_user),
    # use_case: JoinMatchUseCase = Depends(get_join_match_use_case),
) -> MatchResponseDTO:
    """
    Permite a un usuario unirse a una partida existente.

    Args:
        match_id: ID único de la partida
        join_data: Datos para unirse (bet_amount opcional)

    Returns:
        MatchResponseDTO: Datos actualizados de la partida
    """
    # TODO: Implementar cuando los use cases estén disponibles
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Join match functionality not yet implemented"
    )


@match_router.put("/{match_id}/score", response_model=MatchResponseDTO)
async def update_match_score(
    match_id: UUID,
    score_data: UpdateMatchScoreRequestDTO,
    # current_user: UserEntity = Depends(get_current_user),
    # use_case: UpdateMatchScoreUseCase = Depends(get_update_match_score_use_case),
) -> MatchResponseDTO:
    """
    Actualiza la puntuación de un usuario en una partida.

    Args:
        match_id: ID único de la partida
        score_data: Nueva puntuación del usuario

    Returns:
        MatchResponseDTO: Datos actualizados de la partida
    """
    # TODO: Implementar cuando los use cases estén disponibles
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Update match score functionality not yet implemented"
    )


@match_router.get("/{match_id}/participants", response_model=List[str])
async def get_match_participants(
    match_id: UUID,
    # use_case: GetMatchParticipantsUseCase = Depends(get_get_match_participants_use_case),
) -> List[str]:
    """
    Obtiene la lista de participantes de una partida.

    Args:
        match_id: ID único de la partida

    Returns:
        List[str]: Lista de IDs de usuarios participantes
    """
    # TODO: Implementar cuando los use cases estén disponibles
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Get match participants functionality not yet implemented"
    )


@match_router.delete("/{match_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_match(
    match_id: UUID,
    # current_user: UserEntity = Depends(get_current_user),
    # use_case: DeleteMatchUseCase = Depends(get_delete_match_use_case),
):
    """
    Elimina una partida (solo administradores).

    Args:
        match_id: ID único de la partida a eliminar
    """
    # TODO: Implementar cuando los use cases estén disponibles
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Delete match functionality not yet implemented"
    )
