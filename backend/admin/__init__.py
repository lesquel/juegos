from .admin_views import (
    UserAdmin,
    CategoryAdmin,
    GameAdmin,
    GameReviewAdmin,
    MatchAdmin,
    MatchParticipationAdmin,
    TransferPaymentAdmin
)
from .authentication_backend import authentication_backend, AdminAuth
from .admin_config import initialize_admin

list_admin_views = [
    UserAdmin,
    CategoryAdmin,
    GameAdmin,
    GameReviewAdmin,
    MatchAdmin,
    MatchParticipationAdmin,
    TransferPaymentAdmin
]

