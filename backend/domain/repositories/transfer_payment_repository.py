from abc import abstractmethod
from typing import List, Optional, Tuple

from application.common import BaseFilterParams, PaginationParams, SortParams
from domain.entities import TransferPaymentEntity
from domain.enums import TransferStateEnum

from .base_repository import IBaseRepository
from .common import ModelType


class ITransferPaymentRepository(
    IBaseRepository[TransferPaymentEntity, BaseFilterParams, ModelType]
):
    """Repositorio específico para transferencias de pago"""

    @abstractmethod
    async def get_by_user_id(
        self,
        user_id: str,
        pagination: PaginationParams,
        filters: BaseFilterParams,
        sort_params: SortParams,
    ) -> Tuple[List[TransferPaymentEntity], int]:
        """
        Obtiene todas las transferencias de un usuario.

        Args:
            user_id: El ID del usuario

        Returns:
            List[TransferPaymentEntity]: Lista de transferencias del usuario
        """

    @abstractmethod
    async def get_transfer_id(
        self, transfer_id: str
    ) -> Optional[TransferPaymentEntity]:
        """
        Obtiene una transferencia de un usuario por su ID.

        Args:
            user_id: El ID del usuario
            transfer_id: El ID de la transferencia

        Returns:
            Optional[TransferPaymentEntity]: La transferencia del usuario o None si no existe
        """

    @abstractmethod
    async def get_by_state(
        self, state: TransferStateEnum
    ) -> List[TransferPaymentEntity]:
        """
        Obtiene todas las transferencias por estado.

        Args:
            state: El estado de las transferencias

        Returns:
            List[TransferPaymentEntity]: Lista de transferencias con el estado especificado
        """

    @abstractmethod
    async def update_state(
        self, transfer_id: str, new_state: TransferStateEnum
    ) -> Optional[TransferPaymentEntity]:
        """
        Actualiza el estado de una transferencia.

        Args:
            transfer_id: El ID de la transferencia
            new_state: El nuevo estado

        Returns:
            Optional[TransferPaymentEntity]: La transferencia actualizada
        """
