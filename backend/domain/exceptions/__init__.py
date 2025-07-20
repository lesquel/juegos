"""
Excepciones del dominio - Organizadas por módulos
"""

# Excepciones de autenticación
from .auth import (
    AuthenticationError,
    ExpiredTokenError,
    InsufficientPermissionsError,
    InvalidTokenError,
)

# Excepciones base
from .base import (
    BusinessRuleViolationError,
    ConcurrencyError,
    DomainException,
    ValidationError,
)

# Excepciones de juegos
from .game import (
    CannotDeletePendingEventRentalError,
    CategoryAlreadyExistsError,
    CategoryNotFoundError,
    GameAlreadyExistsError,
    GameNotFoundError,
    GameReviewAlreadyExistsError,
    GameReviewNotFoundError,
    ServiceIdRequiredError,
)

# Excepciones de partidas
from .match import (
    AlreadyParticipatingError,
    MatchAlreadyFinishedError,
    MatchNotFoundError,
    MatchNotStartedError,
)

# Excepciones de transferencias
from .transfer import InvalidTransferStateError, TransferNotFoundError

# Excepciones de usuario
from .user import (
    FailedToRetrieveUserError,
    InsufficientFundsError,
    InvalidEmailFormatError,
    UserAlreadyExistsError,
    UserNotFoundError,
    WeakPasswordError,
)

__all__ = [
    # Base
    "DomainException",
    "ValidationError",
    "BusinessRuleViolationError",
    "ConcurrencyError",
    # Auth
    "AuthenticationError",
    "InvalidTokenError",
    "ExpiredTokenError",
    "InsufficientPermissionsError",
    # User
    "UserAlreadyExistsError",
    "UserNotFoundError",
    "FailedToRetrieveUserError",
    "InsufficientFundsError",
    "InvalidEmailFormatError",
    "WeakPasswordError",
    # Game
    "GameNotFoundError",
    "GameAlreadyExistsError",
    "ServiceIdRequiredError",
    "CannotDeletePendingEventRentalError",
    "CategoryNotFoundError",
    "CategoryAlreadyExistsError",
    # Match
    "MatchNotFoundError",
    "MatchAlreadyFinishedError",
    "MatchNotStartedError",
    "AlreadyParticipatingError",
    # Transfer
    "TransferNotFoundError",
    "InvalidTransferStateError",
]
