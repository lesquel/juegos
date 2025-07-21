from typing import Optional

from pydantic import Field

from ..base_filter import BaseFilterParams
from ..filter_dependency_factory import build_filter_dependency


class CategoryFilterParams(BaseFilterParams):
    """Filtros específicos para usuarios - hereda filtros base + específicos"""

    category_name: Optional[str] = Field(None, description="Nombre de la categoría")
    category_description: Optional[str] = Field(
        None, description="Descripción de la categoría"
    )

    def filter_search(self, query, model, value, fields: Optional[list[str]] = None):
        if fields is None:
            fields = ["category_name", "category_description"]
        return super().filter_search(query, model, value, fields)

    def filter_category_name(self, query, model, value):
        return self.ilike_filter(query, model.category_name, value)

    def filter_category_description(self, query, model, value):
        return self.ilike_filter(query, model.category_description, value)


get_category_filter_params = build_filter_dependency(
    CategoryFilterParams,
)
