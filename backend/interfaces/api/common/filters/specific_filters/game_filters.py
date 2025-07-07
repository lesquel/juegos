from typing import Optional
from fastapi import Depends, Query
from pydantic import Field

from ..filter import BaseFilterParams, get_base_filter_params


class GameFilterParams(BaseFilterParams):
    """Filtros específicos para juegos - hereda filtros base + específicos"""

    category_id: Optional[str] = Field(
        None, description="Filtrar por ID de categoría del juego"
    )


# Dependencies específicos para cada modelo
def get_game_filter_params(
    # Filtros base
    base_filters: BaseFilterParams = Depends(get_base_filter_params),
    category_id: Optional[str] = Query(
        None, description="Filtrar por ID de categoría del juego"
    ),
) -> GameFilterParams:
    """Dependency para obtener filtros de juegos"""
    return GameFilterParams(
        **base_filters.model_dump(),
        category_id=category_id,
    )
