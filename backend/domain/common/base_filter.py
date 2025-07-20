from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class BaseFilterParams(BaseModel):
    """Clase base para filtros comunes"""

    search: Optional[str] = Field(
        None, description="Búsqueda general en campos de texto"
    )
    created_after: Optional[str] = Field(
        None, description="Creado después de (YYYY-MM-DD)"
    )
    created_before: Optional[str] = Field(
        None, description="Creado antes de (YYYY-MM-DD)"
    )

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump(exclude_none=True)
