from typing import Optional

from .match_participation import MatchParticipation

from .time_stamp_entity_mixin import TimeStampEntityMixin


class MatchEntity(TimeStampEntityMixin):
    def __init__(
        self,
        match_id: Optional[str],
        game_id: str,
        start_time: str,
        end_time: str,
        winner_id: Optional[str],
        participants: Optional[list[MatchParticipation]],
        created_at: Optional[str],
        updated_at: Optional[str],
    ):
        super().__init__(created_at, updated_at)

        self.match_id = match_id
        self.game_id = game_id
        self.start_time = start_time
        self.end_time = end_time
        self.winner_id = winner_id
        self.participants = participants if participants is not None else []

    def add_participation(self, participation: MatchParticipation):
        self.participants.append(participation)

    def __repr__(self):
        return f"Match(match_id={self.match_id}, game_id={self.game_id}, start_time={self.start_time}, end_time={self.end_time}, winner_id={self.winner_id})"
