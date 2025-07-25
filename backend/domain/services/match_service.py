from domain.entities.match.match import MatchEntity

from ..interfaces import IMatchService


class MatchService(IMatchService):
    @staticmethod
    def calculate_reward(odds: float, base_bet: float) -> float:
        return odds * base_bet

    @staticmethod
    def validate_can_join(match: MatchEntity, game_capacity: int) -> bool:
        return len(match.participant_ids) < game_capacity

    @staticmethod
    def get_winner(participation_scores: list[tuple[str, float]]) -> str:
        if not participation_scores:
            return ""
        return max(participation_scores, key=lambda x: x[1])[0]
