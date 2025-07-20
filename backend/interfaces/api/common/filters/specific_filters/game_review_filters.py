from typing import Optional

from pydantic import Field

from ..base_filter import BaseFilterParams
from ..filter_dependency_factory import build_filter_dependency


class GameReviewFilterParams(BaseFilterParams):
    """Filtros específicos para Game Reviews - hereda filtros base + específicos"""

    user_id: Optional[str] = Field(
        None, description="ID del usuario que realizó la reseña"
    )
    min_rating: Optional[int] = Field(
        None, description="Calificación mínima de la reseña"
    )
    max_rating: Optional[int] = Field(
        None, description="Calificación máxima de la reseña"
    )
    comment: Optional[str] = Field(None, description="Comentario de la reseña")

    def filter_user_id(self, query, model, value):
        return self.any_filter(query, model.user_id, "user_id", value)

    def filter_min_rating(self, query, model, value):
        return self.gte_filter(query, model.rating, value)

    def filter_max_rating(self, query, model, value):
        return self.lte_filter(query, model.rating, value)

    def filter_comment(self, query, model, value):
        return self.contains_filter(query, model.comment, value)


get_game_review_filter_params = build_filter_dependency(
    GameReviewFilterParams,
)
