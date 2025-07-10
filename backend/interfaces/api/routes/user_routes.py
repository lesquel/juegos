from fastapi import APIRouter, Depends, Request

from uuid import UUID

from application.use_cases.user import GetAllUsersUseCase, GetUserByIdUseCase
from infrastructure.logging import get_logger
from dtos import PaginatedResponseDTO
from dtos.response.user.user_response_dto import UserResponseDTO
from interfaces.api.common import (
    PaginationParams,
    get_pagination_params,
    SortParams,
    get_sort_params,
    create_paginated_response,
)
from interfaces.api.dependencies.user_case_deps import (
    get_all_users_use_case,
    get_user_by_id_use_case,
)

from interfaces.api.common.response_utils import handle_paginated_request


from ..common.filters.specific_filters import UserFilterParams, get_user_filter_params


user_router = APIRouter(
    prefix="/users",
    tags=[
        "Users",
    ],
)

# Configurar logger
logger = get_logger("user_routes")


@user_router.get("/", response_model=PaginatedResponseDTO[UserResponseDTO])
def get_all_users(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    sort_params: SortParams = Depends(get_sort_params),
    filters: UserFilterParams = Depends(get_user_filter_params),
    use_case: GetAllUsersUseCase = Depends(get_all_users_use_case),
) -> PaginatedResponseDTO[UserResponseDTO]:
    """
    Retrieves paginated users with optional filters.

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
    logger.info("GET /users - Request received")

    return handle_paginated_request(
        endpoint_name="GET /users",
        request=request,
        pagination=pagination,
        sort_params=sort_params,
        filters=filters,
        use_case=use_case.execute,
        logger=logger,
    )
    
    

@user_router.get("/{user_id}", response_model=UserResponseDTO)
def get_user(
    user_id: UUID,
    use_case: GetUserByIdUseCase = Depends(get_user_by_id_use_case),
) -> UserResponseDTO:
    """
    Retrieve a specific user by ID.

    :param user_id: The ID of the user to retrieve
    :return: UserResponseDTO object
    """
    logger.info(f"GET /users/{user_id} - Request received")

    return use_case.execute(str(user_id))
