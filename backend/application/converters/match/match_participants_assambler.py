"""Conversor DTO para entidad MatchParticipation."""

from application.mixins.logging_mixin import LoggingMixin
from domain.entities.match.match import MatchEntity
from domain.interfaces.base_assembler import BaseAssembler
from dtos.response.match.match_participants_response import MatchParticipantsResponseDTO


class MatchParticipantsResponseAssambler(
    BaseAssembler[MatchParticipantsResponseDTO], LoggingMixin
):
    """Convierte una lista de MatchParticipation a MatchParticipantsResponseDTO."""

    def __init__(self):
        super().__init__()

    def assemble(
        self, match: MatchEntity, list_participants: list[str]
    ) -> MatchParticipantsResponseDTO:
        """Convierte una lista de MatchParticipation a MatchParticipantsResponseDTO."""

        print(
            f"Converting match {match.match_id} with participants {list_participants}"
        )

        return MatchParticipantsResponseDTO(
            match_id=str(match.match_id),
            game_id=str(match.game_id),
            user_ids=list_participants,
        )
