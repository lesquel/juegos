from typing import List

from dtos.common.constants import EXAMPLE_GAME_ID, EXAMPLE_MATCH_ID, EXAMPLE_USER_ID
from pydantic import BaseModel, Field


class MatchParticipantsResponseDTO(BaseModel):
    """DTO para respuesta de participación en partida"""

    match_id: str = Field(..., description="ID de la partida")
    game_id: str = Field(..., description="ID del juego al que pertenece la partida")
    user_ids: List[str] = Field(
        ..., description="Lista de IDs de usuarios participantes en la partida"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "match_id": EXAMPLE_MATCH_ID,
                "game_id": EXAMPLE_GAME_ID,
                "user_ids": [EXAMPLE_USER_ID],
            }
        }
