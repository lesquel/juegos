from fastapi import APIRouter, Depends, Request

from uuid import UUID

from application.use_cases.game import GetAllGamesUseCase, GetGameByIdUseCase
from ..dependencies.game_case_deps import (
    get_all_games_use_case,
    get_game_by_id_use_case,
)
from infrastructure.logging import get_logger
from dtos import PaginatedResponseDTO
from dtos.response.game import GameResponseDTO

from interfaces.api.common import (
    PaginationParams,
    get_pagination_params,
    SortParams,
    get_sort_params,
    create_paginated_response,
)

from ..common.filters.specific_filters import GameFilterParams, get_game_filter_params


game_router = APIRouter(
    prefix="/games",
    tags=[
        "Games",
    ],
)

# Configurar logger
logger = get_logger("game_routes")


@game_router.get("/", response_model=PaginatedResponseDTO[GameResponseDTO])
def get_all_games(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    sort_params: SortParams = Depends(get_sort_params),
    filters: GameFilterParams = Depends(get_game_filter_params),
    use_case: GetAllGamesUseCase = Depends(get_all_games_use_case),
) -> PaginatedResponseDTO[GameResponseDTO]:
    """
    Retrieves paginated games with optional filters.

    Query Parameters:
    - page: Número de página (default: 1)
    - limit: Elementos por página (default: 10, max: 100)
    - email: Filtrar por email (búsqueda parcial)
    - min_currency: Moneda virtual mínima
    - max_currency: Moneda virtual máxima

    :param request: FastAPI request object for URL building
    :param pagination: Pagination parameters
    :param filters: Filter parameters
    :return: PaginatedResponseDTO with UserResponseDTO objects.
    """
    # ✅ Solo log de entrada HTTP con parámetros clave
    logger.info(
        f"GET /games - Request received - page: {pagination.page}, limit: {pagination.limit}"
    )

    # ✅ El Use Case maneja toda la lógica y logging interno
    games, total_count = use_case.execute(pagination, filters, sort_params)

    # ✅ Log de resultado a nivel HTTP
    logger.info(f"GET /games - Response: {len(games)} games from {total_count} total")

    return create_paginated_response(
        items=games,
        total_count=total_count,
        pagination=pagination,
        request=request,
    )


@game_router.get("/{game_id}", response_model=GameResponseDTO)
def get_game(
    game_id: UUID,
    use_case: GetGameByIdUseCase = Depends(get_game_by_id_use_case),
) -> GameResponseDTO:
    """
    Retrieve a specific game by ID.

    :param game_id: The ID of the game to retrieve
    :return: GameResponseDTO object
    """
    logger.info(f"GET /games/{game_id} - Request received")

    return use_case.execute(str(game_id))
