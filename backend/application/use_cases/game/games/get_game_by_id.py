from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.exceptions import GameNotFoundError
from domain.interfaces.base_use_case import BaseGetByIdUseCase
from domain.repositories import IGameRepository
from dtos.response.game import GameResponseDTO


class GetGameByIdUseCase(BaseGetByIdUseCase[GameResponseDTO]):
    """Caso de uso para obtener un juego por ID."""

    def __init__(
        self, game_repo: IGameRepository, game_converter: EntityToDTOConverter
    ):
        super().__init__(game_repo, game_converter)

    def _get_not_found_exception(self, entity_id: str) -> Exception:
        """Obtiene la excepción para entidad no encontrada."""
        return GameNotFoundError(f"Game with ID {entity_id} not found")
