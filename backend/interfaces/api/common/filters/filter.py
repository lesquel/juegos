from typing import Optional, Dict, Any
from fastapi import Query
from pydantic import BaseModel, Field




class BaseFilterParams(BaseModel):
    """Clase base para filtros - Otros modelos pueden heredar de esta"""

    # Filtros comunes que muchos modelos pueden tener
    search: Optional[str] = Field(
        None, description="Búsqueda general en campos de texto"
    )
    created_after: Optional[str] = Field(
        None, description="Filtrar por fecha de creación (después de)"
    )
    created_before: Optional[str] = Field(
        None, description="Filtrar por fecha de creación (antes de)"
    )

    def to_dict(self) -> Dict[str, Any]:
        """Convierte los filtros a diccionario, excluyendo valores None"""
        return {k: v for k, v in self.model_dump().items() if v is not None}






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

