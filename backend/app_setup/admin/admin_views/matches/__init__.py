"""Vistas de administración para el módulo de partidas"""

from .match import MatchAdmin
from .match_participation import MatchParticipationAdmin

__all__ = ["MatchAdmin", "MatchParticipationAdmin"]
