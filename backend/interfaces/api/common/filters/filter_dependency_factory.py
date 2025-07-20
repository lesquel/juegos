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

        # Filtrar valores None y inválidos de kwargs
        cleaned_kwargs = {}
        for key, value in kwargs.items():
            if value is not None:
                # Para campos numéricos, validar que no sean valores extraños
                if key in ["min_currency", "max_currency"] and isinstance(
                    value, (int, float)
                ):
                    # Filtrar valores negativos extremos que pueden ser errores de parsing
                    if (
                        value < -1000000
                    ):  # Umbral razonable para detectar valores erróneos
                        continue
                cleaned_kwargs[key] = value

        return FilterClass(**base_filters.model_dump(), **cleaned_kwargs)

    # Actualiza la firma para compatibilidad con OpenAPI
    dependency_func.__signature__ = inspect.Signature(parameters)
    dependency_func.__annotations__ = {
        "return": FilterClass,
        **{p.name: p.annotation for p in parameters},
    }

    return dependency_func
