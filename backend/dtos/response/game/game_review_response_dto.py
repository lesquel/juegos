from typing import Optional
from pydantic import Field
from ..time_stamp_base import TimeStampBase


class GameReviewResponseDTO(TimeStampBase):
    """DTO para respuesta de reseña de juego"""

    review_id: str = Field(..., description="ID único de la reseña")
    game_id: str = Field(..., description="ID del juego reseñado")
    user_id: str = Field(..., description="ID del usuario que escribió la reseña")
    rating: int = Field(..., description="Calificación del 1 al 5", ge=1, le=5)
    comment: Optional[str] = Field(None, description="Comentario de la reseña")


class GameReviewSummaryResponseDTO(TimeStampBase):
    """DTO para respuesta resumida de reseña (para listados)"""

    review_id: str = Field(..., description="ID único de la reseña")
    user_email: str = Field(..., description="Email del usuario que escribió la reseña")
    rating: int = Field(..., description="Calificación del 1 al 5", ge=1, le=5)
    comment: Optional[str] = Field(None, description="Comentario de la reseña")
