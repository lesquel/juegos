from typing import Optional

from domain.exceptions.match import MatchJoinError

from ...constants import HOUSE_MARGIN
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
        is_finished: bool,
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ):
        super().__init__(created_at, updated_at)

        self.match_id = match_id
        self.game_id = game_id
        self.base_bet_amount = base_bet_amount
        self.created_by_id = created_by_id
        self.winner_id = winner_id
        self.is_finished = bool(is_finished)
        self.participant_ids = participant_ids if participant_ids is not None else []

    def is_finished_match(self) -> bool:
        print(f"Checking if match {self.match_id} is finished: {self.is_finished}")
        return self.is_finished

    def add_participant(self, user_id: str):
        if self.is_participant(user_id):
            raise MatchJoinError(
                f"User {user_id} is already a participant in this match."
            )
        self.participant_ids.append(user_id)

    def calculate_odds_for_match(self, house_odds: float) -> float:
        if len(self.participant_ids) > 1:
            # Peer-to-peer
            base_bet = self.base_bet_amount or 0.0
            total_pot = base_bet * len(self.participant_ids)
            net_pot = total_pot * (1 - HOUSE_MARGIN)
            return round(net_pot / base_bet, 2) if base_bet > 0 else 0.0
        elif house_odds and house_odds > 0:
            # Contra la casa
            return house_odds
        else:
            return 0.0

    def is_participant(self, user_id: str) -> bool:
        return user_id in self.participant_ids

    def __repr__(self):
        return f"Match(match_id={self.match_id}, game_id={self.game_id}, winner_id={self.winner_id})"
