from typing import Optional

from .match_participation import MatchParticipation

from ..time_stamp_entity_mixin import TimeStampEntityMixin


class MatchEntity(TimeStampEntityMixin):
    def __init__(
        self,
        match_id: Optional[str],
        game_id: str,
        base_bet_amount: Optional[float],
        created_by_id: str,
        winner_id: Optional[str],
        participant_ids: Optional[list[str]],
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ):
        super().__init__(created_at, updated_at)

        self.match_id = match_id
        self.game_id = game_id
        self.base_bet_amount = base_bet_amount
        self.created_by_id = created_by_id
        self.winner_id = winner_id
        self.participant_ids = participant_ids if participant_ids is not None else []

    def add_participant(self, user_id: str):
        self.participant_ids.append(user_id)

    def __repr__(self):
        return f"Match(match_id={self.match_id}, game_id={self.game_id}, winner_id={self.winner_id})"
