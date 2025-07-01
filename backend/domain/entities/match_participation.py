from typing import Optional

from domain.entities.match import MatchEntity
from domain.entities.user import UserEntity

from .time_stamp_entity_mixin import TimeStampEntityMixin


class MatchParticipation(TimeStampEntityMixin):
    def __init__(
        self,
        match: MatchEntity,
        user: UserEntity,
        score: int,
        bet_amount: Optional[float],
        created_at: Optional[str],
        updated_at: Optional[str],
    ):
        super().__init__(created_at, updated_at)

        self.match = match
        self.user = user
        self.bet_amount = bet_amount if bet_amount is not None else 0.0
        self.score = score

    def __repr__(self):
        return f"MatchParticipation(match={self.match}, user={self.user}, score={self.score}, bet_amount={self.bet_amount})"
