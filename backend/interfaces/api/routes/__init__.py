from .user_routes import user_router
from .auth_routes import auth_router
from .category_routes import category_router
from .game_routes import game_router
from .game_review_routes import game_review_router

game_router.include_router(game_review_router, prefix="/reviews" , tags=["Game Reviews"])

routers = [
    user_router,
    auth_router,
    category_router,
    game_router,
    # game_review_router
]
