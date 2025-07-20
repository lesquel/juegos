from application.interfaces.base_use_case import BaseGetByIdUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.exceptions.game import GameNotFoundError
from domain.exceptions.match import MatchNotFoundError
from domain.repositories.game_repository import IGameRepository
from domain.repositories.match_repository import IMatchRepository
from dtos.response.match.match_response import MatchResponseDTO
from infrastructure.logging.decorators import log_execution, log_performance


class GetMatchByIdUseCase(BaseGetByIdUseCase[MatchResponseDTO]):
    """Caso de uso para obtener una partida por ID."""

    def __init__(
        self,
        match_repo: IMatchRepository,
        game_repo: IGameRepository,
        match_converter: EntityToDTOConverter,
    ):
        super().__init__(match_repo, match_converter)
        self.game_repo = game_repo

    @log_execution(include_args=True, include_result=False, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(self, match_id: str) -> MatchResponseDTO:
        """Obtiene una partida por ID, validando que el juego existe."""
        self.logger.debug(f"Getting match with ID: {match_id}")

        match = await self.repository.get_by_id(match_id)
        if not match:
            self.logger.warning(f"Match not found with ID: {match_id}")
            raise self._get_not_found_exception(match_id)

        game = await self.game_repo.get_by_id(match.game_id)
        if not game:
            self.logger.error(f"Game not found with ID: {match.game_id}")
            raise GameNotFoundError(f"Game with ID {match.game_id} not found")

        self.logger.info(f"Successfully retrieved match: {match_id}")

        # Convertimos a DTO pasando tanto el match como el game
        return self.converter.to_dto(match, game)

    def _get_not_found_exception(self, entity_id: str) -> Exception:
        """Obtiene la excepción para entidad no encontrada."""
        return MatchNotFoundError(f"Match with ID {entity_id} not found")
