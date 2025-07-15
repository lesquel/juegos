from fastapi import APIRouter, Depends, Request
from uuid import UUID

from application.use_cases.game import (
    GetAllGamesUseCase,
    GetGameByIdUseCase,
    GetCategoriesByGameIdUseCase,
)
from dtos.response.game import GameResponseDTO, CategoryResponseDTO
from dtos.common import PaginatedResponseDTO

from interfaces.api.common import (
    PaginationParams,
    get_pagination_params,
    SortParams,
    get_sort_params,
)
from interfaces.api.common.filters.specific_filters import (
    CategoryFilterParams,
    get_category_filter_params,
    GameFilterParams,
    get_game_filter_params,
)
from interfaces.api.common.response_utils import handle_paginated_request
from infrastructure.dependencies import (
    get_all_games_use_case,
    get_game_by_id_use_case,
    get_categories_by_game_id_use_case,
)
from infrastructure.logging import get_logger


from .game_review_routes import game_review_router
from .match_routes import match_router


game_router = APIRouter(
    prefix="/games",
    tags=[
        "Games",
    ],
)

game_router.include_router(game_review_router, prefix="/{game_id}/reviews")
game_router.include_router(match_router, prefix="/{game_id}/matches")
# Configurar logger
logger = get_logger("game_routes")


@game_router.get("/", response_model=PaginatedResponseDTO[GameResponseDTO])
async def get_all_games(
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
    return await handle_paginated_request(
        endpoint_name="GET /games",
        request=request,
        pagination=pagination,
        sort_params=sort_params,
        filters=filters,
        use_case_execute=use_case.execute,
        logger=logger,
    )


@game_router.get("/{game_id}", response_model=GameResponseDTO)
async def get_game_by_id(
    game_id: UUID,
    use_case: GetGameByIdUseCase = Depends(get_game_by_id_use_case),
) -> GameResponseDTO:
    """
    Retrieve a specific game by ID.

    :param game_id: The ID of the game to retrieve
    :return: GameResponseDTO object
    """
    logger.info(f"GET /games/{game_id} - Request received")

    return await use_case.execute(str(game_id))


@game_router.get(
    "/{game_id}/categories", response_model=PaginatedResponseDTO[CategoryResponseDTO]
)
async def get_categories_by_game_id(
    game_id: UUID,
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    sort_params: SortParams = Depends(get_sort_params),
    filters: CategoryFilterParams = Depends(get_category_filter_params),
    use_case: GetCategoriesByGameIdUseCase = Depends(
        get_categories_by_game_id_use_case
    ),
) -> PaginatedResponseDTO[CategoryResponseDTO]:
    """
    Retrieves categories associated with a specific game ID.

    :param game_id: The ID of the game to filter categories by
    :param request: FastAPI request object for URL building
    :param pagination: Pagination parameters
    :return: PaginatedResponseDTO with CategoryResponseDTO objects.
    """
    return await handle_paginated_request(
        endpoint_name=f"GET /games/{game_id}/categories",
        request=request,
        pagination=pagination,
        sort_params=sort_params,
        filters=filters,
        use_case_execute=lambda p, f, s: use_case.execute(str(game_id), p, f, s),
        logger=logger,
    )
