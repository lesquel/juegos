from typing import Optional, Dict, Any
from fastapi import Query
from pydantic import BaseModel, Field


class SortParams(BaseModel):
    """Clase para parámetros de ordenamiento"""

    sort_by: Optional[str] = Field(None, description="Campo por el cual ordenar")
    sort_order: Optional[str] = Field(
        "asc", description="Orden de clasificación (asc o desc)"
    )

    def to_dict(self) -> Dict[str, Any]:
        """Convierte los parámetros de ordenamiento a diccionario, excluyendo valores None"""
        return {k: v for k, v in self.model_dump().items() if v is not None}


def get_sort_params(
    sort_by: Optional[str] = Query(None, description="Campo por el cual ordenar"),
    sort_order: Optional[str] = Query(
        "asc", description="Orden de clasificación (asc o desc)"
    ),
) -> SortParams:
    """Dependency para parámetros de ordenamiento base"""
    return SortParams(sort_by=sort_by, sort_order=sort_order)
