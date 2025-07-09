from fastapi import APIRouter, Depends, Request

from uuid import UUID

from application.use_cases.game import (
    GetAllCategoriesUseCase,
    GetCategoryByIdUseCase,
    GetGamesByCategoryIdUseCase,
)
from dtos.response.game.game_response import GameResponseDTO
from interfaces.api.common.filters.specific_filters import GameFilterParams
from interfaces.api.common.response_utils import handle_paginated_request
from interfaces.api.dependencies import (
    get_games_by_category_id_use_case,
    get_all_categories_use_case,
    get_category_by_id_use_case,
)


from infrastructure.logging import get_logger
from dtos.common import PaginatedResponseDTO
from dtos.response.game import CategoryResponseDTO

from interfaces.api.common import (
    PaginationParams,
    get_pagination_params,
    SortParams,
    get_sort_params,
    create_paginated_response,
)

from ..common.filters.specific_filters import (
    CategoryFilterParams,
    get_category_filter_params,
)


category_router = APIRouter(
    prefix="/categories",
    tags=[
        "Categories",
    ],
)

# Configurar logger
logger = get_logger("category_routes")


@category_router.get("/", response_model=PaginatedResponseDTO[CategoryResponseDTO])
def get_all_categories(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    sort_params: SortParams = Depends(get_sort_params),
    filters: CategoryFilterParams = Depends(get_category_filter_params),
    use_case: GetAllCategoriesUseCase = Depends(get_all_categories_use_case),
) -> PaginatedResponseDTO[CategoryResponseDTO]:
    """
    Retrieves paginated categories with optional filters.

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
    return handle_paginated_request(
        endpoint_name="GET /categories",
        request=request,
        pagination=pagination,
        sort_params=sort_params,
        filters=filters,
        use_case_execute=use_case.execute,
        logger=logger,
    )


@category_router.get("/{category_id}", response_model=CategoryResponseDTO)
def get_category_by_id(
    category_id: UUID,
    use_case: GetCategoryByIdUseCase = Depends(get_category_by_id_use_case),
) -> CategoryResponseDTO:
    """
    Retrieve a specific category by ID.

    :param category_id: The ID of the category to retrieve
    :return: CategoryResponseDTO object
    """
    logger.info(f"GET /categories/{category_id} - Request received")

    return use_case.execute(str(category_id))


@category_router.get(
    "/{category_id}/games", response_model=PaginatedResponseDTO[GameResponseDTO]
)
def get_games_by_category_id(
    category_id: UUID,
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    sort_params: SortParams = Depends(get_sort_params),
    filters: GameFilterParams = Depends(get_category_filter_params),
    use_case: GetGamesByCategoryIdUseCase = Depends(get_games_by_category_id_use_case),
) -> PaginatedResponseDTO[GameResponseDTO]:
    """
    Retrieves paginated games by category ID with optional filters.

    :param category_id: The ID of the category to filter games
    :param pagination: Pagination parameters
    :param sort_params: Sorting parameters
    :param filters: Filter parameters
    :return: PaginatedResponseDTO with GameResponseDTO objects.
    """
    return handle_paginated_request(
        endpoint_name=f"GET /categories/{category_id}/games",
        request=request,
        pagination=pagination,
        sort_params=sort_params,
        filters=filters,
        use_case_execute=lambda p, f, s: use_case.execute(str(category_id), p, f, s),
        logger=logger,
    )
