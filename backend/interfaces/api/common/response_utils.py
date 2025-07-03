from typing import List, TypeVar, Optional, Callable
from math import ceil
from fastapi import Request

from dtos import PaginatedResponseDTO, PaginationInfoDTO
from .pagination import PaginationParams

T = TypeVar("T")


def create_paginated_response(
    items: List[T],
    total_count: int,
    pagination: PaginationParams,
    request: Request,
) -> PaginatedResponseDTO[T]:
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

