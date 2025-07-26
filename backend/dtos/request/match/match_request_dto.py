from typing import Optional

from dtos.common.constants import (
    EXAMPLE_BASE_BET_AMOUNT,
    EXAMPLE_SCORE,
    EXAMPLE_USER_ID,
)
from pydantic import BaseModel, Field, field_validator

from .validators import validate_bet_amount_validator, validate_user_score_validator


class CreateMatchRequestDTO(BaseModel):
    """DTO para crear una nueva partida"""

    base_bet_amount: float = Field(
        ..., ge=0, description="Monto base a apostar (debe ser mayor o igual a 0)"
    )

    @field_validator("base_bet_amount")
    @classmethod
    def validate_bet_amount(cls, v: float) -> float:
        """Valida el monto apostado, debe ser mayor o igual a 0 y redondeado a 2 decimales."""
        return validate_bet_amount_validator(v)

    class Config:
        json_schema_extra = {
            "example": {
                "base_bet_amount": EXAMPLE_BASE_BET_AMOUNT,
            }
        }


class MatchParticipationInputDTO(BaseModel):
    """DTO para la entrada de participación en una partida"""

    user_id: str = Field(..., description="ID del usuario que participa en la partida")
    score: Optional[float] = Field(
        None, description="Puntuación del usuario en la partida, si aplica"
    )

    @field_validator("score")
    @classmethod
    def validate_user_score(cls, v: Optional[float]) -> Optional[float]:
        """Valida que la puntuación del usuario sea un entero no negativo."""
        return validate_user_score_validator(v)

    class Config:
        json_schema_extra = {
            "example": {"user_id": EXAMPLE_USER_ID, "score": EXAMPLE_SCORE}
        }


class MatchParticipationResultsDTO(BaseModel):
    """DTO para los resultados de la participación en una partida"""

    participants: list[MatchParticipationInputDTO] = Field(
        ..., description="Lista de participantes en la partida"
    )
    custom_odds: Optional[float] = Field(
        None, description="Cuotas personalizadas para la partida"
    )
