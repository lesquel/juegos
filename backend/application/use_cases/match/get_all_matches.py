from domain.repositories.match_repository import IMatchRepository
from dtos.response.match.match_response_dto import MatchSummaryResponseDTO
from application.interfaces.base_use_case import BasePaginatedUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter


class GetAllMatchesUseCase(BasePaginatedUseCase[MatchSummaryResponseDTO]):
    """Caso de uso para obtener todas las partidas con paginación."""

    def __init__(
        self,
        match_repo: IMatchRepository,
        match_converter: EntityToDTOConverter,
    ):
        super().__init__(match_repo, match_converter)
