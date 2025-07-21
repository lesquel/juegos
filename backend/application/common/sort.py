from typing import Any, Dict, Optional

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
