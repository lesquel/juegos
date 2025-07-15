from .user_routes import user_router
from .auth_routes import auth_router
from .category_routes import category_router
from .game_routes import game_router
# from .match_routes import match_router

routers = [
    user_router,
    auth_router,
    category_router,
    game_router,
    # match_router,
]
