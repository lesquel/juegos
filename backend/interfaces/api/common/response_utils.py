from math import ceil
from typing import Callable, List, TypeVar

from domain.common import PaginationParams, SortParams
from dtos.common import PaginatedResponseDTO, PaginationInfoDTO
from fastapi import Request

ItemType = TypeVar("ItemType")


def create_paginated_response(
    items: List[ItemType],
    total_count: int,
    pagination: PaginationParams,
    request: Request,
) -> PaginatedResponseDTO[ItemType]:
    """
    Crea una respuesta paginada genérica para cualquier tipo de modelo.

    Args:
        items: Lista de elementos para la página actual (entities, models, etc.)
        total_count: Número total de elementos en la base de datos
        pagination: Parámetros de paginación
        request: Request de FastAPI para construir URLs

    Returns:
        PaginatedResponseDTO con la información paginada
    """
    # Transformar elementos si se proporciona función

    # Calcular información de paginación
    total_pages = ceil(total_count / pagination.limit) if total_count > 0 else 1

    # Construir URLs para navegación
    base_url = str(request.url.remove_query_params("page"))
    next_url = None
    prev_url = None

    if pagination.page < total_pages:
        next_url = (
            f"{base_url}{'&' if '?' in base_url else '?'}page={pagination.page + 1}"
        )

    if pagination.page > 1:
        prev_url = (
            f"{base_url}{'&' if '?' in base_url else '?'}page={pagination.page - 1}"
        )

    # Crear información de paginación
    pagination_info = PaginationInfoDTO(
        count=total_count,
        pages=total_pages,
        page_number=pagination.page,
        next=next_url,
        prev=prev_url,
    )

    return PaginatedResponseDTO(info=pagination_info, results=items)


async def handle_paginated_request(
    *,
    endpoint_name: str,
    request: Request,
    pagination: PaginationParams,
    sort_params: SortParams,
    filters,
    use_case_execute: Callable,
    logger,
):
    logger.info(
        f"{endpoint_name} - Request received - page: {pagination.page}, limit: {pagination.limit}"
    )
    items, total_count = await use_case_execute(pagination, filters, sort_params)
    logger.info(
        f"{endpoint_name} - Response: {len(items)} items from {total_count} total"
    )

    return create_paginated_response(
        items=items,
        total_count=total_count,
        pagination=pagination,
        request=request,
    )
