from typing import Optional
from pydantic import BaseModel, Field, field_validator, model_validator

from .validators import (
    validate_bet_amount_validator,
    validate_end_after_start_validator,
)


class JoinMatchRequestDTO(BaseModel):
    """DTO para unirse a una partida"""

    bet_amount: Optional[float] = Field(
        None, ge=0, description="Monto a apostar (opcional, debe ser mayor o igual a 0)"
    )

    @field_validator("bet_amount")
    @classmethod
    def validate_bet_amount(cls, v: Optional[float]) -> Optional[float]:
        """Valida el monto apostado, debe ser mayor o igual a 0 y redondeado a 2 decimales."""
        return validate_bet_amount_validator(v)


class CreateMatchRequestDTO(BaseModel):
    """DTO para crear una nueva partida"""

    game_id: str = Field(..., description="ID del juego")
    start_time: str = Field(
        ..., description="Hora de inicio de la partida (formato ISO)"
    )
    end_time: str = Field(
        ..., description="Hora de finalización de la partida (formato ISO)"
    )

    @model_validator(mode="before")
    @classmethod
    def validate_end_time_after_start(cls, values: dict) -> dict:
        """Valida que la hora de finalización sea posterior a la hora de inicio."""
        return validate_end_after_start_validator(values)


class UpdateMatchScoreRequestDTO(BaseModel):
    """DTO para actualizar puntuación en una partida"""

    score: int = Field(
        ..., ge=0, description="Puntuación obtenida (debe ser mayor o igual a 0)"
    )
