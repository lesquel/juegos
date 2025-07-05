from typing import Optional
from pydantic import Field


from ..time_stamp_base import TimeStampBase


class CategoryResponseDTO(TimeStampBase):
    """DTO para respuesta de categoría de juego"""

    category_id: str = Field(..., description="ID único de la categoría")
    category_name: str = Field(..., description="Nombre de la categoría")
    category_img: Optional[str] = Field(
        None, description="URL de la imagen de la categoría"
    )
    category_description: Optional[str] = Field(
        None, description="Descripción de la categoría"
    )
    games: Optional[list[str]] = Field(
        None, description="Lista de IDs de juegos asociados a la categoría"
    )
