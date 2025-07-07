from fastapi import APIRouter, Depends, Request

from uuid import UUID

from application.use_cases.game import GetAllCategoriesUseCase, GetCategoryByIdUseCase
from ..dependencies.category_case_deps import (
    get_all_categories_use_case,
    get_category_by_id_use_case,
)
from infrastructure.logging import get_logger
from dtos import PaginatedResponseDTO
from dtos.response.game import CategoryResponseDTO

from interfaces.api.common import (
    PaginationParams,
    get_pagination_params,
    SortParams,
    get_sort_params,
    create_paginated_response,
)

from ..common.filters.specific_filters import CategoryFilterParams, get_category_filter_params


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
    # ✅ Solo log de entrada HTTP con parámetros clave
    logger.info(
        f"GET /categories - Request received - page: {pagination.page}, limit: {pagination.limit}"
    )

    # ✅ El Use Case maneja toda la lógica y logging interno
    categories, total_count = use_case.execute(pagination, filters, sort_params)

    # ✅ Log de resultado a nivel HTTP
    logger.info(f"GET /categories - Response: {len(categories)} categories from {total_count} total")

    return create_paginated_response(
        items=categories,
        total_count=total_count,
        pagination=pagination,
        request=request,
    )


@category_router.get("/{category_id}", response_model=CategoryResponseDTO)
def get_category(
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
