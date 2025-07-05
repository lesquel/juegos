from typing import Optional
from pydantic import BaseModel, Field, validator
from datetime import datetime


class JoinMatchRequestDTO(BaseModel):
    """DTO para unirse a una partida"""

    bet_amount: Optional[float] = Field(None, ge=0, description="Monto a apostar (opcional, debe ser mayor o igual a 0)")

    @validator('bet_amount')
    def validate_bet_amount(cls, v):
        if v is not None and v < 0:
            raise ValueError('El monto apostado no puede ser negativo')
        if v is not None:
            return round(v, 2)  # Redondear a 2 decimales
        return v


class CreateMatchRequestDTO(BaseModel):
    """DTO para crear una nueva partida"""

    game_id: str = Field(..., description="ID del juego")
    start_time: str = Field(..., description="Hora de inicio de la partida (formato ISO)")
    end_time: str = Field(..., description="Hora de finalización de la partida (formato ISO)")

    @validator('start_time', 'end_time')
    def validate_datetime_format(cls, v):
        try:
            datetime.fromisoformat(v.replace('Z', '+00:00'))
        except ValueError:
            raise ValueError('El formato de fecha debe ser ISO 8601')
        return v

    @validator('end_time')
    def validate_end_after_start(cls, v, values):
        if 'start_time' in values:
            try:
                start = datetime.fromisoformat(values['start_time'].replace('Z', '+00:00'))
                end = datetime.fromisoformat(v.replace('Z', '+00:00'))
                if end <= start:
                    raise ValueError('La hora de finalización debe ser posterior a la hora de inicio')
            except ValueError as e:
                if 'formato' not in str(e):  # Si no es error de formato, es error de lógica
                    raise e
        return v


class UpdateMatchScoreRequestDTO(BaseModel):
    """DTO para actualizar puntuación en una partida"""

    score: int = Field(..., ge=0, description="Puntuación obtenida (debe ser mayor o igual a 0)")
