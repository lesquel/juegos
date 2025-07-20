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


class MatchJoinError(DomainException):
    """Error al unirse a la partida"""

    def __init__(
        self,
        message: str = "Error joining match",
        identifier: str = "match_join_error",
    ):
        super().__init__(message, 400, identifier)


class MatchValidationError(DomainException):
    """Error de validación de partida"""

    def __init__(
        self,
        message: str = "Match validation error",
        identifier: str = "match_validation_error",
    ):
        super().__init__(message, 422, identifier)


class MatchScoreError(DomainException):
    """Error al actualizar la puntuación de la partida"""

    def __init__(
        self,
        message: str = "Error updating match score",
        identifier: str = "match_score_error",
    ):
        super().__init__(message, 400, identifier)
