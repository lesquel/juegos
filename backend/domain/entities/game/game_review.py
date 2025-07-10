from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .game import GameEntity
    from ..user.user import UserEntity

from ..time_stamp_entity_mixin import TimeStampEntityMixin


class GameReviewEntity(TimeStampEntityMixin):
    def __init__(
        self,
        review_id: Optional[str],
        game_id: "GameEntity",
        user_id: "UserEntity",
        rating: int,
        comment: Optional[str],
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ):
        super().__init__(created_at, updated_at)

        self.review_id = review_id
        self.game_id = game_id
        self.user_id = user_id  
        self.rating = rating
        self.comment = comment


