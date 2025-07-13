from typing import Any
from interfaces.api.common.sort import SortParams


class SortingMixin:
    """Mixin para aplicar ordenamiento a las consultas."""

    def apply_sorting(self, stmt, model, sort_params: SortParams) -> None:
        """Aplica ordenamiento a la consulta SQL"""
        if sort_params.sort_by:
            if sort_params.sort_order == "desc":
                stmt = stmt.order_by(getattr(model, sort_params.sort_by).desc())
            else:
                stmt = stmt.order_by(getattr(model, sort_params.sort_by).asc())
        return stmt
