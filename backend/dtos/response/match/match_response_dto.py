from typing import Optional, List
from pydantic import Field, BaseModel
from ..time_stamp_base import TimeStampBase


class MatchParticipationResponseDTO(TimeStampBase):
    """DTO para respuesta de participación en partida"""

    user_id: str = Field(..., description="ID del usuario participante")
    user_email: str = Field(..., description="Email del usuario participante")
    score: int = Field(..., description="Puntuación obtenida por el participante")
    bet_amount: Optional[float] = Field(
        None, description="Monto apostado por el participante"
    )


class MatchResponseDTO(TimeStampBase):
    """DTO para respuesta de partida"""

    match_id: str = Field(..., description="ID único de la partida")
    game_id: str = Field(..., description="ID del juego")
    game_name: str = Field(..., description="Nombre del juego")
    start_time: str = Field(..., description="Hora de inicio de la partida")
    end_time: str = Field(..., description="Hora de finalización de la partida")
    winner_id: Optional[str] = Field(None, description="ID del ganador de la partida")
    winner_email: Optional[str] = Field(
        None, description="Email del ganador de la partida"
    )
    participants: List[MatchParticipationResponseDTO] = Field(
        default=[], description="Lista de participantes en la partida"
    )


class MatchSummaryResponseDTO(BaseModel):
    """DTO para respuesta resumida de partida (para listados)"""

    match_id: str = Field(..., description="ID único de la partida")
    game_name: str = Field(..., description="Nombre del juego")
    start_time: str = Field(..., description="Hora de inicio de la partida")
    end_time: str = Field(..., description="Hora de finalización de la partida")
    participants_count: int = Field(..., description="Número de participantes")
    winner_email: Optional[str] = Field(None, description="Email del ganador")
