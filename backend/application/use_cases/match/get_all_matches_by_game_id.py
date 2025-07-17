from domain.repositories.game_repository import IGameRepository
from domain.repositories.match_repository import IMatchRepository
from dtos.response.match.match_response import MatchResponseDTO
from application.interfaces.base_use_case import BasePaginatedUseCase, BaseUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from infrastructure.logging import log_execution, log_performance


class GetMatchesByGameIdUseCase(BaseUseCase):
    """Caso de uso para obtener todas las partidas con paginación."""

    def __init__(
        self,
        match_repo: IMatchRepository,
        game_repo: IGameRepository,
        match_converter: EntityToDTOConverter,
    ):
        super().__init__()
        self.match_repo = match_repo
        self.game_repo = game_repo
        self.converter = match_converter

    @log_execution(include_args=True, include_result=False, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self, game_id, pagination, filters, sort_params
    ) -> tuple[list[MatchResponseDTO], int]:
        self.logger.info(f"Getting matches for game_id: {game_id}")
        matches, count = await self.match_repo.get_by_game_id(
            game_id, pagination, filters, sort_params
        )

        game = await self.game_repo.get_by_id(game_id)

        if not matches:
            self.logger.warning(
                "No matches found with the given filters and pagination"
            )
            return [], 0

        self.logger.info(f"Found {count} matches for game_id: {game_id}")

        return self.converter.to_dto_list(matches, game), count
