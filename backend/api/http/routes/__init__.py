from .auth_routes import auth_router
from .category_routes import category_router
from .game_routes import game_router
from .match_routes import match_router
from .transfer_payment_routes import transfer_router
from .user_routes import user_router

http_routers = [
    user_router,
    transfer_router,
    auth_router,
    category_router,
    game_router,
    match_router,
]
