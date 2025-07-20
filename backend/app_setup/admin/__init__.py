from .admin_config import initialize_admin
from .admin_views import (
    CategoryAdmin,
    GameAdmin,
    GameReviewAdmin,
    MatchAdmin,
    MatchParticipationAdmin,
    TransferPaymentAdmin,
    UserAdmin,
)
from .authentication_backend import AdminAuth, authentication_backend

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
    ],
}
