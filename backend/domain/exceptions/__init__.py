"""
Excepciones del dominio - Organizadas por módulos
"""

# Excepciones base
from .base import (
    DomainException,
    ValidationError,
    BusinessRuleViolationError,
    ConcurrencyError,
)

# Excepciones de autenticación
from .auth import (
    AuthenticationError,
    InvalidTokenError,
    ExpiredTokenError,
    InsufficientPermissionsError,
)

# Excepciones de usuario
from .user import (
    UserAlreadyExistsError,
    UserNotFoundError,
    FailedToRetrieveUserError,
    InsufficientFundsError,
    InvalidEmailFormatError,
    WeakPasswordError,
)

# Excepciones de juegos
from .game import (
    GameNotFoundError,
    GameAlreadyExistsError,
    ServiceIdRequiredError,
    CannotDeletePendingEventRentalError,
    CategoryNotFoundError,
    CategoryAlreadyExistsError,
)

# Excepciones de partidas
from .match import (
    MatchNotFoundError,
    MatchAlreadyFinishedError,
    MatchNotStartedError,
    AlreadyParticipatingError,
)

# Excepciones de transferencias
from .transfer import (
    TransferNotFoundError,
    InvalidTransferStateError,
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
