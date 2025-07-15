"""Entidad de dominio para juegos."""

from typing import Optional

from .category import CategoryEntity
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
        created_at: Optional[str],
        updated_at: Optional[str],
    ):
        super().__init__(created_at, updated_at)

        self.game_id = game_id
        self.game_name = game_name
        self.game_description = game_description
        self.game_url = game_url
        self.game_img = game_img
        self.game_capacity = game_capacity  
        self.categories = categories if categories is not None else []  # Lista de IDs de categorías

    def add_category_id(self, category_id: str):
        """Añade el ID de una categoría al juego."""
        if category_id not in self.categories:
            self.categories.append(category_id)

    def remove_category_id(self, category_id: str):
        """Remueve el ID de una categoría del juego."""
        if category_id in self.categories:
            self.categories.remove(category_id)

    def has_category(self, category_id: str) -> bool:
        """Verifica si el juego pertenece a una categoría específica."""
        return category_id in self.categories

    def __repr__(self):
        return f"GameEntity(game_id={self.game_id}, game_name='{self.game_name}')"
