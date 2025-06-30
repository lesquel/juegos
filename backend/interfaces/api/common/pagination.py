from typing import Optional, Dict, Any
from fastapi import Query
from pydantic import BaseModel, Field


class PaginationParams(BaseModel):
    """Parámetros de paginación reutilizables para cualquier modelo"""

    page: int = Field(
        default=1, ge=1, description="Número de página (empezando desde 1)"
    )
    limit: int = Field(
        default=10,
        ge=1,
        le=100,
        description="Número de elementos por página (máximo 100)",
    )

    @property
    def offset(self) -> int:
        """Calcula el offset para la base de datos"""
        return (self.page - 1) * self.limit


def get_pagination_params(
    page: int = Query(1, ge=1, description="Número de página"),
    limit: int = Query(10, ge=1, le=100, description="Elementos por página"),
) -> PaginationParams:
    """Dependency genérico para obtener parámetros de paginación"""
    return PaginationParams(page=page, limit=limit)
