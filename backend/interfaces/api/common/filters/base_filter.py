from datetime import datetime
from typing import Optional

from domain.common.base_filter import BaseFilterParams as DomainBaseFilterParams
from fastapi import Query
from sqlalchemy import or_


class BaseFilterParams(DomainBaseFilterParams):
    """Clase base para filtros comunes con extensiones específicas de la API"""

    def filter_created_after(self, query, model, value):
        if hasattr(model, "created_at") and value:
            # Convertir string a datetime si es necesario
            if isinstance(value, str):
                try:
                    value = datetime.fromisoformat(value.replace("Z", "+00:00"))
                except ValueError:
                    # Si no se puede parsear, intentar formato de solo fecha
                    try:
                        value = datetime.strptime(value, "%Y-%m-%d")
                    except ValueError:
                        return query  # Si no se puede parsear, ignorar el filtro
            return query.filter(model.created_at >= value)
        return query

    def filter_created_before(self, query, model, value):
        if hasattr(model, "created_at") and value:
            # Convertir string a datetime si es necesario
            if isinstance(value, str):
                try:
                    value = datetime.fromisoformat(value.replace("Z", "+00:00"))
                except ValueError:
                    # Si no se puede parsear, intentar formato de solo fecha
                    try:
                        value = datetime.strptime(value, "%Y-%m-%d")
                    except ValueError:
                        return query  # Si no se puede parsear, ignorar el filtro
            return query.filter(model.created_at <= value)
        return query

    def filter_search(self, query, model, value, fields: Optional[list[str]] = None):
        """Filtra por búsqueda en campos específicos del modelo."""
        if fields is None:
            fields = []
        conditions = []
        for attr in fields:
            if hasattr(model, attr):
                conditions.append(getattr(model, attr).ilike(f"%{value}%"))
        if conditions:
            return query.filter(or_(*conditions))
        return query

    def ilike_filter(self, query, model_field, value):
        return query.filter(model_field.ilike(f"%{value}%")) if value else query

    def any_filter(self, query, relationship_field, attr_name, value):
        if value:
            return query.filter(relationship_field.any(**{attr_name: value}))
        return query

    def gte_filter(self, query, model_field, value):
        return query.filter(model_field >= value) if value is not None else query

    def lte_filter(self, query, model_field, value):
        return query.filter(model_field <= value) if value is not None else query


def get_base_filter_params(
    search: Optional[str] = Query(None, description="Búsqueda general"),
    created_after: Optional[str] = Query(
        None, description="Creado después de (YYYY-MM-DD)"
    ),
    created_before: Optional[str] = Query(
        None, description="Creado antes de (YYYY-MM-DD)"
    ),
) -> BaseFilterParams:
    """Dependency para filtros base (común para todos los modelos)"""
    return BaseFilterParams(
        search=search,
        created_after=created_after,
        created_before=created_before,
    )
