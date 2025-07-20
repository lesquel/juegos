from domain.common.pagination import PaginationParams
from fastapi import Query


def get_pagination_params(
    page: int = Query(1, ge=1, description="Número de página"),
    limit: int = Query(10, ge=1, le=100, description="Elementos por página"),
) -> PaginationParams:
    """Dependency genérico para obtener parámetros de paginación"""
    return PaginationParams(page=page, limit=limit)
