from typing import Optional

from domain.entities.game.game import GameEntity

from .match_participation import MatchParticipation

from ..time_stamp_entity_mixin import TimeStampEntityMixin

from ...constants import HOUSE_MARGIN


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

    def calculate_odds_for_match(self, house_odds: float) -> float:
        if len(self.participant_ids) > 1:
            # Peer-to-peer
            total_pot = self.base_bet_amount * len(self.participant_ids)
            net_pot = total_pot * (1 - HOUSE_MARGIN)
            return round(net_pot / self.base_bet_amount, 2)
        elif house_odds:
            # Contra la casa
            return house_odds
        else:
            return 0.0

    def __repr__(self):
        return f"Match(match_id={self.match_id}, game_id={self.game_id}, winner_id={self.winner_id})"
