from typing import Optional

from dtos.common.constants import (
    EXAMPLE_COMMENT,
    EXAMPLE_CREATED_AT,
    EXAMPLE_EMAIL,
    EXAMPLE_GAME_ID,
    EXAMPLE_RATING,
    EXAMPLE_REVIEW_ID,
    EXAMPLE_UPDATED_AT,
    EXAMPLE_USER_ID,
)
from pydantic import Field

from ..time_stamp_base import TimeStampBase


class GameReviewResponseDTO(TimeStampBase):
    """DTO para respuesta de reseña de juego"""

    review_id: str = Field(..., description="ID único de la reseña")
    game_id: str = Field(..., description="ID del juego reseñado")
    user_id: str = Field(..., description="ID del usuario que escribió la reseña")
    rating: int = Field(..., description="Calificación del 1 al 5", ge=1, le=5)
    comment: Optional[str] = Field(None, description="Comentario de la reseña")

    class Config:
        json_schema_extra = {
            "example": {
                "review_id": EXAMPLE_REVIEW_ID,
                "game_id": EXAMPLE_GAME_ID,
                "user_id": EXAMPLE_USER_ID,
                "rating": EXAMPLE_RATING,
                "comment": EXAMPLE_COMMENT,
                "created_at": EXAMPLE_CREATED_AT,
                "updated_at": EXAMPLE_UPDATED_AT,
            }
        }


class GameReviewSummaryResponseDTO(TimeStampBase):
    """DTO para respuesta resumida de reseña (para listados)"""

    review_id: str = Field(..., description="ID único de la reseña")
    user_email: str = Field(..., description="Email del usuario que escribió la reseña")
    rating: int = Field(..., description="Calificación del 1 al 5", ge=1, le=5)
    comment: Optional[str] = Field(None, description="Comentario de la reseña")

    class Config:
        json_schema_extra = {
            "example": {
                "review_id": EXAMPLE_REVIEW_ID,
                "user_email": EXAMPLE_EMAIL,
                "rating": EXAMPLE_RATING,
                "comment": EXAMPLE_COMMENT,
                "created_at": EXAMPLE_CREATED_AT,
                "updated_at": EXAMPLE_UPDATED_AT,
            }
        }
