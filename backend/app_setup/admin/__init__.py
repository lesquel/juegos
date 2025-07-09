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
    "👥 Usuarios": [
        UserAdmin,
    ],
    "🎮 Juegos": [
        CategoryAdmin,
        GameAdmin,
        GameReviewAdmin,
    ],
    "⚔️ Partidas": [
        MatchAdmin,
        MatchParticipationAdmin,
    ],
    "💰 Pagos": [
        TransferPaymentAdmin,
    ]
}

# Lista plana para compatibilidad (deprecada)
list_admin_views = [
    UserAdmin,
    CategoryAdmin,
    GameAdmin,
    GameReviewAdmin,
    MatchAdmin,
    MatchParticipationAdmin,
    TransferPaymentAdmin
]

