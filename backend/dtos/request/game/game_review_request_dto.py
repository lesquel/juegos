from typing import Optional
from pydantic import BaseModel, Field, field_validator, model_validator
from .validators import game_rating_validator, at_least_one_field_validator


class CreateGameReviewRequestDTO(BaseModel):
    """DTO para crear una reseña de juego"""

    game_id: str = Field(..., description="ID del juego a reseñar")
    rating: int = Field(..., ge=1, le=5, description="Calificación del 1 al 5")
    comment: Optional[str] = Field(
        None,
        max_length=1000,
        description="Comentario de la reseña (máximo 1000 caracteres)",
    )

    @field_validator("rating", mode="before")
    @classmethod
    def validate_game_rating(cls, v: int) -> int:
        return game_rating_validator(v)


class UpdateGameReviewRequestDTO(BaseModel):
    """DTO para actualizar una reseña de juego"""

    rating: Optional[int] = Field(
        None, ge=1, le=5, description="Nueva calificación del 1 al 5"
    )
    comment: Optional[str] = Field(
        None,
        max_length=1000,
        description="Nuevo comentario de la reseña (máximo 1000 caracteres)",
    )

    @field_validator("rating", mode="before")
    @classmethod
    def validate_game_rating(cls, v: Optional[int]) -> Optional[int]:
        return game_rating_validator(v) if v is not None else v

    @model_validator(mode="after")
    @classmethod
    def validate_at_least_one_field(
        cls, values: "UpdateGameReviewRequestDTO"
    ) -> "UpdateGameReviewRequestDTO":
        return (
            at_least_one_field_validator(values, "rating")
            if values.rating is None and values.comment is None
            else values
        )
