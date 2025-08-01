from typing import Optional

from dtos.common.constants import EXAMPLE_COMMENT, EXAMPLE_RATING
from pydantic import BaseModel, Field, field_validator

from .validators import game_rating_validator


class CreateGameReviewRequestDTO(BaseModel):
    """DTO para crear una reseña de juego"""

    rating: float = Field(..., ge=1, le=5, description="Calificación del 1 al 5")
    comment: Optional[str] = Field(
        None,
        max_length=1000,
        description="Comentario de la reseña (máximo 1000 caracteres)",
    )

    @field_validator("rating", mode="before")
    @classmethod
    def validate_game_rating(cls, v) -> float:
        return game_rating_validator(v)

    class Config:
        json_schema_extra = {
            "example": {
                "rating": EXAMPLE_RATING,
                "comment": EXAMPLE_COMMENT,
            }
        }


class UpdateGameReviewRequestDTO(BaseModel):
    """DTO para actualizar una reseña de juego"""

    rating: Optional[float] = Field(
        None, ge=1, le=5, description="Nueva calificación del 1 al 5"
    )
    comment: Optional[str] = Field(
        None,
        max_length=1000,
        description="Nuevo comentario de la reseña (máximo 1000 caracteres)",
    )

    @field_validator("rating", mode="before")
    @classmethod
    def validate_game_rating(cls, v) -> Optional[float]:
        return game_rating_validator(v) if v is not None else v

    class Config:
        json_schema_extra = {
            "example": {
                "rating": EXAMPLE_RATING,
                "comment": EXAMPLE_COMMENT,
            }
        }
