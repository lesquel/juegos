from typing import Optional
from fastapi import Query
from pydantic import Field

from ..base_filter import BaseFilterParams


class GameReviewFilterParams(BaseFilterParams):
    """Filtros específicos para Game Reviews - hereda filtros base + específicos"""

    email: Optional[str] = Field(
        None, description="Filtrar por email (búsqueda parcial)"
    )
    min_currency: Optional[float] = Field(
        None, ge=0, description="Moneda virtual mínima"
    )
    max_currency: Optional[float] = Field(
        None, ge=0, description="Moneda virtual máxima"
    )


# Dependencies específicos para cada modelo
def get_game_review_filter_params(
    # Filtros base
    search: Optional[str] = Query(None, description="Búsqueda general"),
    created_after: Optional[str] = Query(None, description="Creado después de"),
    created_before: Optional[str] = Query(None, description="Creado antes de"),
    # Filtros específicos de usuario
    email: Optional[str] = Query(None, description="Filtrar por email"),
    min_currency: Optional[float] = Query(
        None, ge=0, description="Moneda virtual mínima"
    ),
    max_currency: Optional[float] = Query(
        None, ge=0, description="Moneda virtual máxima"
    ),
) -> GameReviewFilterParams:
    """Dependency para obtener filtros de Game Reviews"""
    return GameReviewFilterParams(
        search=search,
        created_after=created_after,
        created_before=created_before,
        email=email,
        min_currency=min_currency,
        max_currency=max_currency,
    )
