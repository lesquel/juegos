from fastapi import APIRouter, Depends, Request

from uuid import UUID

from application.use_cases.game import (
    GetGameReviewsByGameIdUseCase,
    GetGameReviewByIdUseCase,
    GetAllGameReviewsUseCase,
)
from application.use_cases.game.review.create_game_review import CreateGameReviewUseCase
from dtos.request.game.game_review_request_dto import CreateGameReviewRequestDTO
from interfaces.api.common.response_utils import handle_paginated_request
from ..dependencies.game_review_case_deps import (
    get_create_game_review_use_case,
    get_game_reviews_by_game_id_use_case,
    get_game_review_by_id_use_case,
    get_all_game_reviews_use_case,
)
from infrastructure.logging import get_logger
from dtos.common import PaginatedResponseDTO
from dtos.response.game import GameReviewResponseDTO

from interfaces.api.common import (
    PaginationParams,
    get_pagination_params,
    SortParams,
    get_sort_params,
)

from ..common.filters.specific_filters import (
    GameReviewFilterParams,
    get_game_review_filter_params,
)


game_review_router = APIRouter(tags=["Game Reviews"])

# Configurar logger
logger = get_logger("game_review_routes")


@game_review_router.get(
    "/", response_model=PaginatedResponseDTO[GameReviewResponseDTO]
)
def get_all_game_reviews(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    sort_params: SortParams = Depends(get_sort_params),
    filters: GameReviewFilterParams = Depends(get_game_review_filter_params),
    use_case: GetAllGameReviewsUseCase = Depends(get_all_game_reviews_use_case),
) -> PaginatedResponseDTO[GameReviewResponseDTO]:
    """
    Retrieves paginated games with optional filters.

    Query Parameters:
    - page: Número de página (default: 1)
    - limit: Elementos por página (default: 10, max: 100)
    - email: Filtrar por email (búsqueda parcial)
    - min_currency: Moneda virtual mínima
    - max_currency: Moneda virtual máxima

    :param request: FastAPI request object for URL building
    :param pagination: Pagination parameters
    :param filters: Filter parameters
    :return: PaginatedResponseDTO with UserResponseDTO objects.
    """
    return handle_paginated_request(
        endpoint_name="GET /reviews",
        request=request,
        pagination=pagination,
        sort_params=sort_params,
        filters=filters,
        use_case_execute=use_case.execute,
        logger=logger,
    )


@game_review_router.get(
    "/{game_review_id}", response_model=GameReviewResponseDTO
)
def get_game_review_by_id(
    game_review_id: UUID,
    use_case: GetGameReviewByIdUseCase = Depends(get_game_review_by_id_use_case),
) -> GameReviewResponseDTO:
    """
    Retrieve a specific game by ID.

    :param game_id: The ID of the game to retrieve
    :return: GameResponseDTO object
    """
    logger.info(f"GET /games/{game_review_id} - Request received")

    return use_case.execute(str(game_review_id))


@game_review_router.get(
    "/{game_id}/reviews", response_model=PaginatedResponseDTO[GameReviewResponseDTO]
)
def get_game_reviews_by_game_id(
    game_id: UUID,
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    sort_params: SortParams = Depends(get_sort_params),
    filters: GameReviewFilterParams = Depends(get_game_review_filter_params),
    use_case: GetGameReviewsByGameIdUseCase = Depends(
        get_game_reviews_by_game_id_use_case
    ),
) -> PaginatedResponseDTO[GameReviewResponseDTO]:
    """
    Retrieves paginated games with optional filters.

    Query Parameters:
    - page: Número de página (default: 1)
    - limit: Elementos por página (default: 10, max: 100)
    - email: Filtrar por email (búsqueda parcial)
    - min_currency: Moneda virtual mínima
    - max_currency: Moneda virtual máxima

    :param request: FastAPI request object for URL building
    :param pagination: Pagination parameters
    :param filters: Filter parameters
    :return: PaginatedResponseDTO with UserResponseDTO objects.
    """
    return handle_paginated_request(
        endpoint_name=f"GET /{game_id}/reviews",
        request=request,
        pagination=pagination,
        sort_params=sort_params,
        filters=filters,
        use_case_execute=lambda p,f,s: use_case.execute(str(game_id), p, f, s),
        logger=logger,
    )


@game_review_router.post("/{game_id}/reviews", response_model=GameReviewResponseDTO)
def create_game_review(
    game_id: UUID,
    review: CreateGameReviewRequestDTO,
    use_case: CreateGameReviewUseCase = Depends(get_create_game_review_use_case),
) -> GameReviewResponseDTO:
    """
    Create a new game review.

    :param game_id: The ID of the game to review
    :param review: The review data
    :return: GameReviewResponseDTO object
    """
    logger.info(f"POST /{game_id}/reviews - Request received")

    return use_case.execute(str(game_id), review)
