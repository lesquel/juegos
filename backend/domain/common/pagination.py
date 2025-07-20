from pydantic import BaseModel, Field


class PaginationParams(BaseModel):
    """Parámetros de paginación reutilizables para cualquier modelo"""

    page: int = Field(
        default=1, ge=1, description="Número de página (empezando desde 1)"
    )
    limit: int = Field(
        default=10,
        ge=1,
        le=100,
        description="Número de elementos por página (máximo 100)",
    )

    @property
    def offset(self) -> int:
        """Calcula el offset para la base de datos"""
        return (self.page - 1) * self.limit
