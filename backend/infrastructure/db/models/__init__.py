# Importaciones modularizadas por dominio
from .user import UserModel
from .game import CategoryModel, GameModel, GameReviewModel
from .match import MatchModel, MatchParticipationModel
from .transfer import TransferPaymentModel

# Exportar todos los modelos para compatibilidad
__all__ = [
    # User models
    "UserModel",
    
    # Game models
    "CategoryModel",
    "GameModel", 
    "GameReviewModel",
    
    # Match models
    "MatchModel",
    "MatchParticipationModel",
    
    # Transfer models
    "TransferPaymentModel",
]

