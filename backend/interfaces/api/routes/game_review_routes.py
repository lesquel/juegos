from fastapi import APIRouter, Depends, Request, Response, status

from uuid import UUID

from application.use_cases.game import (
    GetGameReviewsByGameIdUseCase,
    GetGameReviewByIdUseCase,
)
from application.use_cases.game.review import (
    CreateGameReviewUseCase,
    DeleteGameReviewUseCase,
    UpdateGameReviewUseCase,
)

from dtos.request.game.game_review_request import (
    CreateGameReviewRequestDTO,
    UpdateGameReviewRequestDTO,
)


from interfaces.api.common.response_utils import handle_paginated_request
from infrastructure.dependencies import (
    get_create_game_review_use_case,
    get_game_reviews_by_game_id_use_case,
    get_game_review_by_id_use_case,
    get_delete_game_review_use_case,
    get_update_game_review_use_case,
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


game_review_router = APIRouter()

# Configurar logger
logger = get_logger("game_review_routes")


@game_review_router.get("/{game_id}/reviews/", response_model=PaginatedResponseDTO[GameReviewResponseDTO])
async def get_game_reviews_by_game_id(
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
    return await handle_paginated_request(
        endpoint_name=f"GET /{game_id}/reviews",
        request=request,
        pagination=pagination,
        sort_params=sort_params,
        filters=filters,
        use_case_execute=lambda p, f, s: use_case.execute(str(game_id), p, f, s),
        logger=logger,
    )


@game_review_router.post("/{game_id}/reviews/", response_model=GameReviewResponseDTO)
async def create_game_review(
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

    return await use_case.execute(str(game_id), review)


@game_review_router.put("/reviews/{game_review_id}", response_model=GameReviewResponseDTO)
async def update_game_review(
    game_review_id: UUID,
    review: UpdateGameReviewRequestDTO,
    use_case: UpdateGameReviewUseCase = Depends(get_update_game_review_use_case),
) -> GameReviewResponseDTO:
    """
    Update an existing game review.

    :param game_review_id: The ID of the game review to update
    :param review: The updated review data
    :return: GameReviewResponseDTO object
    """
    logger.info(f"PUT /{game_review_id} - Request received")

    return await use_case.execute(str(game_review_id), review)


@game_review_router.delete("/reviews/{game_review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_game_review(
    game_review_id: UUID,
    use_case: DeleteGameReviewUseCase = Depends(get_delete_game_review_use_case),
) -> Response:
    """
    Delete a game review.

    :param game_review_id: The ID of the game review to delete
    :return: No content (204)
    """
    logger.info(f"DELETE /{game_review_id} - Request received")
    await use_case.execute(str(game_review_id))
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@game_review_router.get("/reviews/{game_review_id}", response_model=GameReviewResponseDTO)
async def get_game_review_by_id(
    game_review_id: UUID,
    use_case: GetGameReviewByIdUseCase = Depends(get_game_review_by_id_use_case),
) -> GameReviewResponseDTO:
    """
    Retrieve a specific game by ID.

    :param game_id: The ID of the game to retrieve
    :return: GameResponseDTO object
    """
    logger.info(f"GET /games/{game_review_id} - Request received")

    return await use_case.execute(str(game_review_id))
