from .users import UserAdmin
from .games import CategoryAdmin, GameAdmin, GameReviewAdmin
from .matches import MatchAdmin, MatchParticipationAdmin
from .payments import TransferPaymentAdmin

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
]