from domain.repositories import IGameRepository
from dtos.response.game import GameResponseDTO
from application.interfaces.base_use_case import BasePaginatedUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter


class GetAllGamesUseCase(BasePaginatedUseCase[GameResponseDTO]):
    """Caso de uso para obtener todos los juegos con paginación."""

    def __init__(self, game_repo: IGameRepository, game_converter: EntityToDTOConverter):
        super().__init__(game_repo, game_converter)

