from typing import Optional, List
from pydantic import Field, BaseModel
from ..time_stamp_base import TimeStampBase


class MatchParticipationResponseDTO(TimeStampBase):
    """DTO para respuesta de participación en partida"""

    user_id: str = Field(..., description="ID del usuario participante")
    score: int = Field(..., description="Puntuación obtenida por el participante")
    bet_amount: Optional[float] = Field(
        None, description="Monto apostado por el participante"
    )
    


class MatchResponseDTO(TimeStampBase):
    """DTO para respuesta de partida"""

    match_id: str = Field(..., description="ID único de la partida")
    game_id: str = Field(..., description="ID del juego")
    winner_id: Optional[str] = Field(None, description="ID del ganador de la partida")
    created_by_id: Optional[str] = Field(
        None, description="ID del usuario que creó la partida"
    )
    base_bet_amount: Optional[float] = Field(
        None, description="Monto base de la apuesta para la partida"
    )

    participant_ids: List[str] = Field(
        default=[], description="Lista de participantes en la partida"
    )

