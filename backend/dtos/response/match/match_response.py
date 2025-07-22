from typing import List, Optional

from dtos.common.constants import (
    EXAMPLE_BASE_BET_AMOUNT,
    EXAMPLE_BET_AMOUNT,
    EXAMPLE_CREATED_AT,
    EXAMPLE_CREATED_BY_ID,
    EXAMPLE_GAME_ID,
    EXAMPLE_MATCH_ID,
    EXAMPLE_ODDS_FOR_MATCH,
    EXAMPLE_SCORE,
    EXAMPLE_UPDATED_AT,
    EXAMPLE_USER_ID,
    EXAMPLE_WINNER_ID,
)
from pydantic import Field

from ..time_stamp_base import TimeStampBase


class MatchParticipationResponseDTO(TimeStampBase):
    """DTOa para respuesta de participación en partida"""

    user_id: str = Field(..., description="ID del usuario participante")
    score: int = Field(..., description="Puntuación obtenida por el participante")
    bet_amount: Optional[float] = Field(
        None, description="Monto apostado por el participante"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": EXAMPLE_USER_ID,
                "score": EXAMPLE_SCORE,
                "bet_amount": EXAMPLE_BET_AMOUNT,
                "created_at": EXAMPLE_CREATED_AT,
                "updated_at": EXAMPLE_UPDATED_AT,
            }
        }


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

    odds_for_match: Optional[float] = Field(
        None, description="Cuota ganadora de la partida"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "match_id": EXAMPLE_MATCH_ID,
                "game_id": EXAMPLE_GAME_ID,
                "winner_id": EXAMPLE_WINNER_ID,
                "created_by_id": EXAMPLE_CREATED_BY_ID,
                "base_bet_amount": EXAMPLE_BASE_BET_AMOUNT,
                "participant_ids": [EXAMPLE_USER_ID],
                "odds_for_match": EXAMPLE_ODDS_FOR_MATCH,
                "created_at": EXAMPLE_CREATED_AT,
                "updated_at": EXAMPLE_UPDATED_AT,
            }
        }
