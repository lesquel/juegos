from .app_info import AccountAdmin, AppInfoAdmin
from .games import CategoryAdmin, GameAdmin, GameReviewAdmin
from .matches import MatchAdmin, MatchParticipationAdmin
from .payments import TransferPaymentAdmin
from .users import UserAdmin

# Para compatibilidad hacia atrás
__all__ = [
    # Módulo de usuarios
    "UserAdmin",
    # Módulo de juegos
    "CategoryAdmin",
    "GameAdmin",
    "GameReviewAdmin",
    # Módulo de partidas
    "MatchAdmin",
    "MatchParticipationAdmin",
    # Módulo de pagos
    "TransferPaymentAdmin",
    # App Info
    "AppInfoAdmin",
    "AccountAdmin",
]
