from abc import abstractmethod
from typing import Optional, List

from domain.entities import TransferPaymentEntity
from interfaces.api.common.filters.specific_filters import TransferPaymentFilterParams
from application.enums import TransferStateEnum
from .base_repository import IBaseRepository


class ITransferPaymentRepository(IBaseRepository[TransferPaymentEntity, TransferPaymentFilterParams]):
    """Repositorio específico para transferencias de pago"""

    @abstractmethod
    async def get_by_user_id(self, user_id: str) -> List[TransferPaymentEntity]:
        """
        Obtiene todas las transferencias de un usuario.

        Args:
            user_id: El ID del usuario

        Returns:
            List[TransferPaymentEntity]: Lista de transferencias del usuario
        """
        pass

    @abstractmethod
    async def get_by_state(self, state: TransferStateEnum) -> List[TransferPaymentEntity]:
        """
        Obtiene todas las transferencias por estado.

        Args:
            state: El estado de las transferencias

        Returns:
            List[TransferPaymentEntity]: Lista de transferencias con el estado especificado
        """
        pass

    @abstractmethod
    async def update_state(self, transfer_id: str, new_state: TransferStateEnum) -> Optional[TransferPaymentEntity]:
        """
        Actualiza el estado de una transferencia.

        Args:
            transfer_id: El ID de la transferencia
            new_state: El nuevo estado

        Returns:
            Optional[TransferPaymentEntity]: La transferencia actualizada
        """
        pass
