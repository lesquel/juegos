from typing import Optional
from fastapi import APIRouter, Depends, Request, HTTPException

from uuid import UUID
from sqlalchemy.orm import Session

from application.use_cases.users.get_all_users import GetAllUsersUseCase
from application.use_cases.users.get_user import GetUserUseCase
from infrastructure.db.repositories import PostgresUserRepository
from infrastructure.db.connection import get_db
from application.dtos import PaginatedResponseDTO
from interfaces.api.dependencies.user_case_deps import (
    get_all_users_use_case,
    get_user_use_case,
)
from interfaces.api.response_models.user_output import UserOutput

from ..common.pagination import PaginationParams, get_pagination_params
from ..common.filters.specific_filters import UserFilterParams, get_user_filter_params
from ..common.response_utils import create_paginated_response
from ..common.sort import SortParams, get_sort_params



user_router = APIRouter(prefix="/users", tags=["users"])


@user_router.get("/", response_model=PaginatedResponseDTO[UserOutput])
def get_all_users(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    filters: UserFilterParams = Depends(get_user_filter_params),
    sort_params: SortParams = Depends(get_sort_params),
    use_case: GetAllUsersUseCase = Depends(get_all_users_use_case),
) -> PaginatedResponseDTO[UserOutput]:
    """
    Retrieves paginated users with optional filters.

    Query Parameters:
    - page: Número de página (default: 1)
    - limit: Elementos por página (default: 10, max: 100)
    - username: Filtrar por username (búsqueda parcial)
    - email: Filtrar por email (búsqueda parcial)
    - min_currency: Moneda virtual mínima
    - max_currency: Moneda virtual máxima

    :param request: FastAPI request object for URL building
    :param pagination: Pagination parameters
    :param filters: Filter parameters
    :param db: The database session dependency.
    :return: PaginatedResponseDTO with UserOutput objects.
    """
    users, total_count = use_case.execute(pagination, filters, sort_params)

    return create_paginated_response(
        items=users,
        total_count=total_count,
        pagination=pagination,
        request=request,
    )


@user_router.get("/{user_id}", response_model=UserOutput)
def get_user(
    user_id: Optional[UUID],
    use_case: GetUserUseCase = Depends(get_user_use_case),
) -> UserOutput:
    """
    Retrieve a specific user by ID.

    :param user_id: The ID of the user to retrieve
    :param db: Database session
    :return: UserOutput object
    """

    user = use_case.execute(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
