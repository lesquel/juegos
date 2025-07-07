"""
Excepciones relacionadas con transferencias
"""

from .base import DomainException


class TransferNotFoundError(DomainException):
    """Transferencia no encontrada"""

    def __init__(
        self,
        message: str = "Transfer not found",
        identifier: str = "transfer_not_found",
    ):
        super().__init__(message, 404, identifier)


class InvalidTransferStateError(DomainException):
    """Estado de transferencia inválido"""

    def __init__(
        self,
        message: str = "Invalid transfer state",
        identifier: str = "invalid_transfer_state",
    ):
        super().__init__(message, 400, identifier)
