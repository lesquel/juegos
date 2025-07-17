from typing import Optional
from pydantic import Field


from ..time_stamp_base import TimeStampBase
from dtos.common.constants import (
    EXAMPLE_CATEGORY_ID,
    EXAMPLE_CATEGORY_NAME,
    EXAMPLE_CATEGORY_IMG,
    EXAMPLE_CATEGORY_DESCRIPTION,
    EXAMPLE_GAME_ID,
    EXAMPLE_CREATED_AT,
    EXAMPLE_UPDATED_AT,
)


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
    game_ids: Optional[list[str]] = Field(
        None, description="Lista de IDs de juegos asociados a la categoría"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "category_id": EXAMPLE_CATEGORY_ID,
                "category_name": EXAMPLE_CATEGORY_NAME,
                "category_img": EXAMPLE_CATEGORY_IMG,
                "category_description": EXAMPLE_CATEGORY_DESCRIPTION,
                "game_ids": [EXAMPLE_GAME_ID],
                "created_at": EXAMPLE_CREATED_AT,
                "updated_at": EXAMPLE_UPDATED_AT,
            }
        }
