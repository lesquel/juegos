"""Vistas de administración para el módulo de juegos"""

from .category import CategoryAdmin
from .game import GameAdmin
from .game_review import GameReviewAdmin

__all__ = ["CategoryAdmin", "GameAdmin", "GameReviewAdmin"]
