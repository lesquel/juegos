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

# Organización por módulos/categorías
admin_views_by_module = {
    "Modulo usuarios": [
        UserAdmin,
    ],
    "Modulo juegos": [
        CategoryAdmin,
        GameAdmin,
        GameReviewAdmin,
    ],
    "Modulo partidas": [
        MatchAdmin,
        MatchParticipationAdmin,
    ],
    "Modulo pagos": [
        TransferPaymentAdmin,
    ]
}

