"""Entidad de dominio para juegos."""

from typing import Optional

from ..time_stamp_entity_mixin import TimeStampEntityMixin


class GameEntity(TimeStampEntityMixin):
    """Entidad de dominio para juegos."""

    def __init__(
        self,
        game_id: Optional[str],
        game_name: str,
        game_description: str,
        game_url: str,
        game_img: str,
        game_capacity: int,
        categories: Optional[list[str]],  # Solo IDs de categorías para eficiencia
        house_odds: Optional[float] = None,
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ):
        super().__init__(created_at, updated_at)

        self.game_id = game_id
        self.game_name = game_name
        self.game_description = game_description
        self.game_url = game_url
        self.game_img = game_img
        self.game_capacity = game_capacity
        self.categories = (
            categories if categories is not None else []
        )  # Lista de IDs de categorías
        self.house_odds = house_odds

    def __repr__(self):
        return f"GameEntity(game_id={self.game_id}, game_name='{self.game_name}')"
