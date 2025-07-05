from typing import Optional
from pydantic import BaseModel, Field, field_validator


class CreateGameReviewRequestDTO(BaseModel):
    """DTO para crear una reseña de juego"""

    game_id: str = Field(..., description="ID del juego a reseñar")
    rating: int = Field(..., ge=1, le=5, description="Calificación del 1 al 5")
    comment: Optional[str] = Field(None, max_length=1000, description="Comentario de la reseña (máximo 1000 caracteres)")

    @field_validator('rating')
    def validate_rating(cls, v):
        if not 1 <= v <= 5:
            raise ValueError('La calificación debe estar entre 1 y 5')
        return v


class UpdateGameReviewRequestDTO(BaseModel):
    """DTO para actualizar una reseña de juego"""

    rating: Optional[int] = Field(None, ge=1, le=5, description="Nueva calificación del 1 al 5")
    comment: Optional[str] = Field(None, max_length=1000, description="Nuevo comentario de la reseña (máximo 1000 caracteres)")

    @field_validator('rating')
    def validate_rating(cls, v):
        if v is not None and not 1 <= v <= 5:
            raise ValueError('La calificación debe estar entre 1 y 5')
        return v

    @field_validator('*', pre=True)
    def at_least_one_field(cls, v, values, field):
        if not any(values.values()) and v is None:
            raise ValueError('Debe proporcionar al menos un campo para actualizar')
        return v
