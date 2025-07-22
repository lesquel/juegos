# Importaciones modularizadas por dominio
from .game import CategoryModel, GameModel, GameReviewModel
from .match import MatchModel, MatchParticipationModel
from .transfer import TransferPaymentModel
from .user import UserModel
from .app_info_model import AccountModel,AppInfoModel

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

    # AppInfo models
    "AccountModel",
    "AppInfoModel",

]
