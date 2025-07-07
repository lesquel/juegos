from abc import abstractmethod
from typing import Optional

from domain.entities import TransferPaymentEntity
from interfaces.api.common.filters.specific_filters import TransferPaymentFilterParams
from .base_repository import IBaseRepository


class ITransferPaymentRepository(IBaseRepository[TransferPaymentEntity, TransferPaymentFilterParams]):
    """Repositorio específico para transferencias de pago"""

    @abstractmethod
    def get_by_email(self, email: str) -> Optional[TransferPaymentEntity]:
        """
        Retrieves a transfer payment by the user's email address.

        :param email: The email address of the user to retrieve.
        :return: The User object corresponding to the given email.
        """
        pass
