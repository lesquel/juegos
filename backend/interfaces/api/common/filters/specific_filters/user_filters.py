from typing import Optional

from pydantic import Field

from ..base_filter import BaseFilterParams
from ..filter_dependency_factory import build_filter_dependency


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

    def filter_email(self, query, model, value):
        return self.ilike_filter(query, model.email, value)

    def filter_min_currency(self, query, model, value):
        return self.gte_filter(query, model.virtual_currency, value)

    def filter_max_currency(self, query, model, value):
        return self.lte_filter(query, model.virtual_currency, value)


get_user_filter_params = build_filter_dependency(
    UserFilterParams,
)
