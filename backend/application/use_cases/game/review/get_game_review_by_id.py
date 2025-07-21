from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.exceptions import GameReviewNotFoundError
from domain.interfaces.base_use_case import BaseGetByIdUseCase
from domain.repositories import IGameReviewRepository
from dtos.response.game import GameReviewResponseDTO


class GetGameReviewByIdUseCase(BaseGetByIdUseCase[GameReviewResponseDTO]):
    """Caso de uso para obtener una reseña de juego por ID."""

    def __init__(
        self,
        game_review_repo: IGameReviewRepository,
        game_review_converter: EntityToDTOConverter,
    ):
        super().__init__(game_review_repo, game_review_converter)

    def _get_not_found_exception(self, entity_id: str) -> Exception:
        """Obtiene la excepción para entidad no encontrada."""
        return GameReviewNotFoundError(f"Game review with ID {entity_id} not found")
