from abc import ABC, abstractmethod

from domain.entities.match.match import MatchEntity


class IMatchService(ABC):
    @abstractmethod
    def calculate_reward(odds: float, base_bet: float) -> float:
        """
        Calcula la recompensa basada en las probabilidades y la apuesta base.

        Args:
            odds (float): Probabilidades del juego.
            base_bet (float): Monto de la apuesta base.

        Returns:
            float: Recompensa calculada.
        """

    @abstractmethod
    def validate_can_join(match: MatchEntity, game_capacity: int) -> bool:
        """
        Valida si un usuario puede unirse a una partida.

        Args:
            match (MatchEntity): Entidad de la partida.
            game_capacity (int): Capacidad máxima del juego.

        Returns:
            bool: True si puede unirse, False en caso contrario.
        """

    @abstractmethod
    def is_participant(match: MatchEntity, user_id: str) -> bool:
        """
        Verifica si un usuario es participante de una partida.

        Args:
            match (MatchEntity): Entidad de la partida.
            user_id (str): ID del usuario.

        Returns:
            bool: True si es participante, False en caso contrario.
        """

    @abstractmethod
    def get_winner(participation_scores: list[tuple[str, float]]) -> str:
        """
        Obtiene el ID del ganador de una partida.

        Args:
            participation_scores (list[tuple[str, float]]): Lista de tuplas con el ID del participante y su puntaje.

        Returns:
            str: ID del ganador.
        """
