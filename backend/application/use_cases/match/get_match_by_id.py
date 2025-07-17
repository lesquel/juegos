from domain.repositories.match_repository import IMatchRepository
from domain.exceptions.match import MatchNotFoundError
from dtos.response.match.match_response import MatchResponseDTO
from application.interfaces.base_use_case import BaseGetByIdUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter


class GetMatchByIdUseCase(BaseGetByIdUseCase[MatchResponseDTO]):
    """Caso de uso para obtener una partida por ID."""

    def __init__(
        self,
        match_repo: IMatchRepository,
        match_converter: EntityToDTOConverter,
    ):
        super().__init__(match_repo, match_converter)

    def _get_not_found_exception(self, entity_id: str) -> Exception:
        """Obtiene la excepción para entidad no encontrada."""
        return MatchNotFoundError(f"Match with ID {entity_id} not found")
