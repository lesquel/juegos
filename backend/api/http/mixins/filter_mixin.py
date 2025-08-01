from typing import Any

from api.http.common.filters.base_filter import BaseFilterParams


class FilterMixin:
    """Mixin para aplicar filtros a las consultas."""

    def apply_filters(self, stmt, model, filters: BaseFilterParams) -> Any:
        """
        Aplica filtros de forma dinámica usando métodos definidos en la clase de filtros.
        Cada filtro puede tener su propio método `filter_<fieldname>`.
        """
        for field, value in filters.model_dump(exclude_none=True).items():
            method_name = f"filter_{field}"
            if hasattr(filters, method_name):
                method = getattr(filters, method_name)
                stmt = method(stmt, model, value)
        return stmt
