from typing import Optional
from pydantic import Field

from ..base_filter import BaseFilterParams, get_base_filter_params
from ..filter_dependency_factory import build_filter_dependency


class GameFilterParams(BaseFilterParams):
    """Filtros específicos para juegos - hereda filtros base + específicos"""

    category_id: Optional[str] = Field(
        None, description="Filtrar por ID de categoría del juego"
    )

    game_name: Optional[str] = Field(None, description="Nombre del juego")
    game_description: Optional[str] = Field(None, description="Descripción del juego")

    def filter_search(self, query, model, value, fields: Optional[list[str]] = None):
        if fields is None:
            fields = ["game_name", "game_description"]
        return super().filter_search(query, model, value, fields)

    def filter_category_id(self, query, model, value):
        return self.any_filter(query, model.categories, "category_id", value)

    def filter_game_name(self, query, model, value):
        return self.ilike_filter(query, model.game_name, value)

    def filter_game_description(self, query, model, value):
        return self.ilike_filter(query, model.game_description, value)


get_game_filter_params = build_filter_dependency(
    GameFilterParams,
)
