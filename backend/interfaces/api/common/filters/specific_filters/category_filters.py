from typing import Optional
from fastapi import Query
from fastapi.params import Depends
from pydantic import Field

from ..filter import BaseFilterParams, get_base_filter_params


class CategoryFilterParams(BaseFilterParams):
    """Filtros específicos para usuarios - hereda filtros base + específicos"""

    game_id: Optional[str] = Field(
        None, description="ID del juego asociado a la categoría"
    )
    category_name : Optional[str] = Field(
        None, description="Nombre de la categoría"
    )
    category_description: Optional[str] = Field(
        None, description="Descripción de la categoría"
    )

    def filter_search(self, query, model, value, fields: Optional[list[str]] = None):
        if fields is None:
            fields = ["category_name", "category_description"]
        return super().filter_search(query, model, value, fields)


# Dependencies específicos para cada modelo
def get_category_filter_params(
    base_filters: BaseFilterParams = Depends(get_base_filter_params),

    game_id: Optional[str] = Query(
        None, description="ID del juego asociado a la categoría"
    ),
    category_name: Optional[str] = Query(
        None, description="Nombre de la categoría"
    ),
    category_description: Optional[str] = Query(
        None, description="Descripción de la categoría"
    ),
) -> CategoryFilterParams:
    """Dependency para obtener filtros de usuario"""
    return CategoryFilterParams(
        **base_filters.model_dump(),
        game_id=game_id,
        category_name=category_name,
        category_description=category_description,
    )
