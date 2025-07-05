from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .game import GameEntity
    from ..user.user import UserEntity

from ..time_stamp_entity_mixin import TimeStampEntityMixin


class GameReviewEntity(TimeStampEntityMixin):
    def __init__(
        self,
        review_id: Optional[str],
        game: "GameEntity",
        user: "UserEntity",
        rating: int,
        comment: Optional[str],
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ):
        super().__init__(created_at, updated_at)

        self.review_id = review_id
        self.game = game
        self.user = user
        self.rating = rating
        self.comment = comment
