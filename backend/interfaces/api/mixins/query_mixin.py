
from interfaces.api.common.filters.filter import BaseFilterParams
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.sort import SortParams


from .filter_mixin import FilterMixin
from .sort_mixin import SortingMixin
from .pagination_mixin import PaginationMixin

from typing import Optional, Type, List, Tuple
from sqlalchemy.orm import Session

class QueryMixin(FilterMixin, SortingMixin, PaginationMixin):
    def get_paginated_mixin(
        self,
        model: Type,
        db_session: Session,
        pagination: PaginationParams,
        filters: Optional[BaseFilterParams] = None,
        sort_params: Optional[SortParams] = None,
        to_entity: Optional[callable] = None,
    ) -> Tuple[List, int]:
        """
        Consulta genérica con filtros, ordenamiento y paginación.
        """
        query = db_session.query(model)

        if filters:
            query = self.apply_filters(query, model, filters)
        if sort_params:
            query = self.apply_sorting(query, model, sort_params)

        total_count = query.count()

        query = self.apply_pagination(query, pagination)

        results = query.all()

        if to_entity:
            results = [to_entity(r) for r in results]

        return results, total_count