"""
Excepciones relacionadas con partidas/matches
"""

from ..base import DomainException


class MatchNotFoundError(DomainException):
    """Partida no encontrada"""

    def __init__(
        self, message: str = "Match not found", identifier: str = "match_not_found"
    ):
        super().__init__(message, 404, identifier)


class MatchAlreadyFinishedError(DomainException):
    """Partida ya terminada"""

    def __init__(
        self,
        message: str = "Match has already finished",
        identifier: str = "match_already_finished",
    ):
        super().__init__(message, 400, identifier)


class MatchNotStartedError(DomainException):
    """Partida no iniciada"""

    def __init__(
        self,
        message: str = "Match has not started yet",
        identifier: str = "match_not_started",
    ):
        super().__init__(message, 400, identifier)


class AlreadyParticipatingError(DomainException):
    """Ya está participando en la partida"""

    def __init__(
        self,
        message: str = "User is already participating in this match",
        identifier: str = "already_participating",
    ):
        super().__init__(message, 409, identifier)
