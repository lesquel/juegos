from typing import Optional

from dtos.common.constants import (
    EXAMPLE_CATEGORY_ID,
    EXAMPLE_CREATED_AT,
    EXAMPLE_GAME_CAPACITY,
    EXAMPLE_GAME_DESCRIPTION,
    EXAMPLE_GAME_ID,
    EXAMPLE_GAME_IMG,
    EXAMPLE_GAME_NAME,
    EXAMPLE_GAME_URL,
    EXAMPLE_HOUSE_ODDS,
    EXAMPLE_UPDATED_AT,
)
from pydantic import Field

from ..time_stamp_base import TimeStampBase


class GameResponseDTO(TimeStampBase):
    """DTO para respuesta de juego"""

    game_id: str = Field(..., description="ID único del juego")
    game_name: str = Field(..., description="Nombre del juego")
    game_description: Optional[str] = Field(None, description="Descripción del juego")
    game_img: Optional[str] = Field(None, description="URL de la imagen del juego")
    game_url: Optional[str] = Field(None, description="ID de la categoría del juego")
    game_capacity: Optional[int] = Field(
        None, description="Capacidad del juego (número de jugadores)"
    )
    category_ids: Optional[list[str]] = Field(
        None, description="Lista de IDs de categorías asociadas al juego"
    )

    house_odds: Optional[float] = Field(
        None, description="Probabilidad de la casa en el juego"
    )

    game_type: Optional[str] = Field(
        None, description="Tipo de juego (Online, Presencial, etc.)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "game_id": EXAMPLE_GAME_ID,
                "game_name": EXAMPLE_GAME_NAME,
                "game_description": EXAMPLE_GAME_DESCRIPTION,
                "game_img": EXAMPLE_GAME_IMG,
                "game_url": EXAMPLE_GAME_URL,
                "game_capacity": EXAMPLE_GAME_CAPACITY,
                "category_ids": [EXAMPLE_CATEGORY_ID],
                "house_odds": EXAMPLE_HOUSE_ODDS,
                "created_at": EXAMPLE_CREATED_AT,
                "updated_at": EXAMPLE_UPDATED_AT,
            }
        }
