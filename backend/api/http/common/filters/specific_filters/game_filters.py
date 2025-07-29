from typing import Optional

from domain.enums import GameTypeEnum
from pydantic import Field

from ..base_filter import BaseFilterParams
from ..filter_dependency_factory import build_filter_dependency


class GameFilterParams(BaseFilterParams):
    """Filtros específicos para juegos - hereda filtros base + específicos"""

    filter_category_id: Optional[str] = Field(
        None, description="Filtrar por ID de categoría del juego", alias="category_id"
    )

    category_name: Optional[str] = Field(
        None, description="Nombre de la categoría del juego"
    )

    game_name: Optional[str] = Field(None, description="Nombre del juego")
    game_description: Optional[str] = Field(None, description="Descripción del juego")

    game_type: Optional[GameTypeEnum] = Field(
        None, description="Tipo de juego (ej. 'online', 'offline', 'luck')"
    )

    def filter_search(self, query, model, value, fields: Optional[list[str]] = None):
        if fields is None:
            fields = ["game_name", "game_description"]
        return super().filter_search(query, model, value, fields)

    def filter_filter_category_id(self, query, model, value):
        return self.any_filter(query, model.categories, "category_id", value)

    def filter_category_name(self, query, model, value):
        return self.any_filter(
            query, model.categories, "category_name", value, ilike=True
        )

    def filter_game_name(self, query, model, value):
        return self.ilike_filter(query, model.game_name, value)

    def filter_game_description(self, query, model, value):
        return self.ilike_filter(query, model.game_description, value)

    def filter_game_type(self, query, model, value):
        return query.filter(model.game_type == value)


get_game_filter_params = build_filter_dependency(
    GameFilterParams,
)
