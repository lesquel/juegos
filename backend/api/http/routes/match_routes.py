from uuid import UUID

from api.http.common import (
    PaginationParams,
    SortParams,
    get_pagination_params,
    get_sort_params,
)
from api.http.common.filters.specific_filters.match_filters import (
    MatchFilterParams,
    get_match_filter_params,
)
from api.http.common.response_utils import handle_paginated_request

# Import use cases
from application.use_cases.match import (
    CreateMatchUseCase,
    GetMatchByIdUseCase,
    GetMatchesByGameIdUseCase,
)
from dtos import PaginatedResponseDTO
from dtos.request.match.match_request_dto import CreateMatchRequestDTO
from dtos.response.match.match_response import MatchResponseDTO
from fastapi import APIRouter, Depends, Request
from infrastructure.dependencies.use_cases.match_use_cases import (
    get_create_match_use_case,
    get_match_by_id_use_case,
    get_matches_by_game_id_use_case,
)
from infrastructure.logging import get_logger

from .match_participation_routes import match_participations_router

# )

match_router = APIRouter(prefix="/games", tags=["Matches"])
match_router.include_router(match_participations_router, prefix="/matches")
# Configurar logger
logger = get_logger("match_routes")


@match_router.post("/{game_id}/matches", response_model=MatchResponseDTO)
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


@match_router.get(
    "/{game_id}/matches", response_model=PaginatedResponseDTO[MatchResponseDTO]
)
async def get_matches_by_game_id(
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


@match_router.get("/matches/{match_id}", response_model=MatchResponseDTO)
async def get_match(
    match_id: UUID,
    use_case: GetMatchByIdUseCase = Depends(get_match_by_id_use_case),
) -> MatchResponseDTO:
    """
    Obtiene una partida específica por ID.

    Args:
        match_id: ID único de la partida

    Returns:
        MatchResponseDTO: Datos completos de la partida incluyendo participantes
    """
    logger.info(f"GET /matches/{match_id} - Request received")

    return await use_case.execute(str(match_id))
