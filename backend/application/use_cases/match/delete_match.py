from domain.repositories.match_repository import IMatchRepository
from domain.exceptions.match import MatchNotFoundError
from application.interfaces.base_use_case import BaseUseCase
from infrastructure.logging import log_execution, log_performance


class DeleteMatchUseCase(BaseUseCase[str, bool]):
    """Caso de uso para eliminar una partida."""

    def __init__(self, match_repo: IMatchRepository):
        super().__init__()
        self.match_repo = match_repo

    @log_execution(include_args=True, include_result=True, log_level="WARNING")
    @log_performance(threshold_seconds=2.0)
    async def execute(self, match_id: str) -> bool:
        """
        Elimina una partida específica.

        Args:
            match_id: ID de la partida a eliminar

        Returns:
            bool: True si se eliminó correctamente

        Raises:
            MatchNotFoundError: Si la partida no existe
        """
        self.logger.warning(f"Attempting to delete match {match_id}")

        # Verificar que la partida existe
        match = await self.match_repo.get_by_id(match_id)
        if not match:
            self.logger.error(f"Match not found for deletion: {match_id}")
            raise MatchNotFoundError(f"Match with ID {match_id} not found")

        # Verificar si la partida tiene participantes activos
        participants = await self.match_repo.get_match_participants(match_id)
        if participants:
            self.logger.warning(f"Deleting match {match_id} with {len(participants)} participants")

        # Eliminar la partida
        success = await self.match_repo.delete(match_id)

        if success:
            self.logger.warning(f"Match {match_id} deleted successfully")
        else:
            self.logger.error(f"Failed to delete match {match_id}")

        return success
