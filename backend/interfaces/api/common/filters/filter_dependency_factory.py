import inspect
from typing import Type, get_type_hints

from fastapi import Depends, Query
from pydantic import BaseModel

from .base_filter import BaseFilterParams, get_base_filter_params


def build_filter_dependency(FilterClass: Type[BaseModel]):
    """
    Construye dinámicamente una dependencia FastAPI para filtros personalizados,
    incluyendo filtros base (search, created_after, etc.)
    """

    # Extrae anotaciones (campos definidos en la clase)
    filter_fields = get_type_hints(FilterClass)

    # Extrae los campos de BaseFilterParams para combinarlos
    base_fields = get_type_hints(BaseFilterParams)

    # Crea firma dinámica para la función de dependencia
    parameters = [
        inspect.Parameter(
            "base_filters",
            kind=inspect.Parameter.KEYWORD_ONLY,
            default=Depends(get_base_filter_params),
            annotation=BaseFilterParams,
        )
    ]

    # Agrega todos los campos definidos en FilterClass pero no en BaseFilterParams
    for name, annotation in filter_fields.items():
        if name not in base_fields:
            default = Query(
                None,
                description=FilterClass.model_fields.get(name, {}).description or "",
            )
            parameters.append(
                inspect.Parameter(
                    name,
                    kind=inspect.Parameter.KEYWORD_ONLY,
                    default=default,
                    annotation=annotation,
                )
            )

    # Crea la función con esa firma
    def dependency_func(**kwargs):
        base_filters = kwargs.pop("base_filters")
        return FilterClass(**base_filters.model_dump(), **kwargs)

    # Actualiza la firma para compatibilidad con OpenAPI
    if hasattr(dependency_func, "__signature__"):
        dependency_func.__signature__ = inspect.Signature(parameters)
    dependency_func.__annotations__ = {
        "return": FilterClass,
        **{p.name: p.annotation for p in parameters},
    }

    return dependency_func
