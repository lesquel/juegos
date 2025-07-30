from typing import List

from domain.exceptions.match import MatchNotFoundError
from domain.interfaces import BaseAssembler, BaseUseCase
from domain.repositories.match_repository import IMatchRepository
from infrastructure.logging import log_execution, log_performance


class GetMatchParticipantsUseCase(BaseUseCase[str, List[str]]):
    """Caso de uso para obtener los participantes de una partida."""

    def __init__(
        self,
        match_repo: IMatchRepository,
        match_participants_assambler: BaseAssembler,
    ):
        super().__init__()
        self.match_repo = match_repo
        self.match_participants_assambler = match_participants_assambler

    @log_execution(include_args=True, include_result=False, log_level="INFO")
    @log_performance(threshold_seconds=1.0)
    async def execute(self, match_id: str) -> List[str]:
        """
        Obtiene la lista de participantes de una partida.

        Args:
            match_id: ID de la partida

        Returns:
            List[str]: Lista de IDs de usuarios participantes

        Raises:
            MatchNotFoundError: Si la partida no existe
        """
        self.logger.info(f"Getting participants for match {match_id}")

        # Verificar que la partida existe
        match = await self.match_repo.get_by_id(match_id)
        if not match:
            self.logger.error(f"Match not found: {match_id}")
            raise MatchNotFoundError(f"Match with ID {match_id} not found")

        # Obtener participantes
        participants = await self.match_repo.get_match_participant_ids(match_id)

        self.logger.info(f"Found {len(participants)} participants for match {match_id}")

        return self.match_participants_assambler.assemble(match, participants)
