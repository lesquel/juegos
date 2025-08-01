from collections.abc import Callable
from typing import Any, List, Optional, Tuple, Type

from api.http.common.filters.base_filter import BaseFilterParams
from api.http.common.pagination import PaginationParams
from api.http.common.sort import SortParams
from fastapi import Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .filter_mixin import FilterMixin
from .pagination_mixin import PaginationMixin
from .sort_mixin import SortingMixin


class QueryMixin(FilterMixin, SortingMixin, PaginationMixin):
    async def get_paginated_mixin(
        self,
        model: Type,
        db_session: AsyncSession,
        pagination: PaginationParams,
        filters: Optional[BaseFilterParams] = None,
        sort_params: Optional[SortParams] = None,
        to_entity: Optional[Callable] = None,
        custom_filter_fn: Optional[Callable[[Query], Query]] = None,
        load_options: Optional[List[Any]] = None,
    ) -> Tuple[List, int]:
        """
        Consulta genérica con filtros, ordenamiento y paginación.
        """
        stmt = select(model)

        if load_options:
            stmt = stmt.options(*load_options)
        if filters:
            stmt = self.apply_filters(stmt, model, filters)
        if custom_filter_fn:
            stmt = custom_filter_fn(stmt)
        if sort_params:
            stmt = self.apply_sorting(stmt, model, sort_params)

        # Count total (before pagination)
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await db_session.execute(count_stmt)
        total_count = count_result.scalar()

        # Apply pagination
        stmt = self.apply_pagination(stmt, pagination)

        # Execute query
        result = await db_session.execute(stmt)
        results = result.scalars().all()

        if to_entity:
            results = [to_entity(r) for r in results]

        return results, total_count
