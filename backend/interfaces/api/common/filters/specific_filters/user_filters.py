from typing import Optional
from fastapi import Depends, Query
from pydantic import Field

from ..filter import BaseFilterParams, get_base_filter_params


class UserFilterParams(BaseFilterParams):
    """Filtros específicos para usuarios - hereda filtros base + específicos"""

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
def get_user_filter_params(
    base_filters: BaseFilterParams = Depends(get_base_filter_params),
    email: Optional[str] = Query(None, description="Filtrar por email"),
    min_currency: Optional[float] = Query(
        None, ge=0, description="Moneda virtual mínima"
    ),
    max_currency: Optional[float] = Query(
        None, ge=0, description="Moneda virtual máxima"
    ),
) -> UserFilterParams:
    """Dependency para obtener filtros de usuario"""
    return UserFilterParams(
        **base_filters.model_dump(),
        email=email,
        min_currency=min_currency,
        max_currency=max_currency,
    )
