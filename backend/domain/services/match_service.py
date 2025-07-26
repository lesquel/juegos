from typing import Optional

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
    def get_winner_id(participation_scores: list[tuple[str, float]]) -> Optional[str]:
        if not participation_scores:
            return None

        # Encuentra el puntaje más alto
        max_score = max(score for _, score in participation_scores)

        # Encuentra todos los jugadores con ese puntaje
        top_players = [
            user_id for user_id, score in participation_scores if score == max_score
        ]

        # Si hay un único jugador con el puntaje más alto, él gana
        if len(top_players) == 1:
            return top_players[0]

        # Si hay empate, no hay ganador
        return None
