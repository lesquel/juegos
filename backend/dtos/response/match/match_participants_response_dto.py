from typing import Optional, List
from pydantic import Field, BaseModel
from ..time_stamp_base import TimeStampBase


class MatchParticipantsResponseDTO(BaseModel):
    """DTO para respuesta de participación en partida"""

    match_id: str = Field(
        ..., description="ID de la partida"
    )
    game_id: str = Field(
        ..., description="ID del juego al que pertenece la partida"
    )
    user_ids : List[str] = Field(
        ..., description="Lista de IDs de usuarios participantes en la partida"
    )