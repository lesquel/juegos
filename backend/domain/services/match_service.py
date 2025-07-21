from domain.entities.match.match import MatchEntity

from ..interfaces import IMatchService


class MatchService(IMatchService):
    def calculate_reward(self, odds: float, base_bet: float) -> float:
        return odds * base_bet

    def validate_can_join(self, match: MatchEntity, game_capacity: int) -> bool:
        return len(match.participant_ids) < game_capacity

    def get_winner(self, participation_scores: list[tuple[str, float]]) -> str:
        if not participation_scores:
            return ""
        return max(participation_scores, key=lambda x: x[1])[0]
