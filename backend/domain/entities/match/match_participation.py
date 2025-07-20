from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from domain.entities.match.match import MatchEntity
    from domain.entities.user.user import UserEntity

from ..time_stamp_entity_mixin import TimeStampEntityMixin


class MatchParticipation(TimeStampEntityMixin):
    def __init__(
        self,
        match_id: "MatchEntity",
        user_id: "UserEntity",
        score: int,
        bet_amount: Optional[float],
        created_at: Optional[str],
        updated_at: Optional[str],
    ):
        super().__init__(created_at, updated_at)

        self.match_id = match_id
        self.user_id = user_id
        self.bet_amount = bet_amount if bet_amount is not None else 0.0
        self.score = score

    def __repr__(self):
        return (
            f"MatchParticipation(match={self.match}, user_id={self.user_id}, "
            f"score={self.score}, bet_amount={self.bet_amount})"
        )
