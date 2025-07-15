from typing import Optional
from pydantic import BaseModel, Field, field_validator, model_validator

from .validators import (
    validate_bet_amount_validator,
    validate_end_after_start_validator,
)


class JoinMatchRequestDTO(BaseModel):
    """DTO para unirse a una partida"""

    base_bet_amount: float = Field(
        ..., ge=0, description="Monto a apostar (debe ser mayor o igual a 0)"
    )

    @field_validator("base_bet_amount")
    @classmethod
    def validate_bet_amount(cls, v: float) -> float:
        """Valida el monto apostado, debe ser mayor o igual a 0 y redondeado a 2 decimales."""
        return validate_bet_amount_validator(v)


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


class UpdateMatchRequestDTO(BaseModel):
    """DTO para actualizar puntuación en una partida"""

    winner_id: str = Field(None, description="ID del usuario ganador (opcional)")
    score: int = Field(
        ..., ge=0, description="Puntuación obtenida (debe ser mayor o igual a 0)"
    )
