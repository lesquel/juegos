from typing import Optional

from application.mixins import DTOToEntityConverter, LoggingMixin
from domain.entities.transfer.transfer_payment import TransferPaymentEntity
from domain.enums import TransferStateEnum
from dtos.request.transfer.transfer_payment_request import (
    CreateTransferPaymentInternalDTO,
)


class TransferPaymentDTOToEntityConverter(
    DTOToEntityConverter[CreateTransferPaymentInternalDTO, TransferPaymentEntity],
    LoggingMixin,
):
    """Convierte TransferPaymentInternalDTO a TransferPaymentEntity."""

    def __init__(self):
        super().__init__()

    def to_entity(self, dto: CreateTransferPaymentInternalDTO) -> TransferPaymentEntity:
        """
        Implementación del método abstracto requerido.

        Nota: Para casos reales use convert_with_context() con parámetros adicionales.

        Args:
            dto: El DTO a convertir

        Raises:
            ValueError: Si se llama sin contexto adicional
        """
        raise ValueError(
            "Este método requiere parámetros adicionales. Use convert_with_context() en su lugar."
        )

    def convert_with_context(
        self,
        dto: CreateTransferPaymentInternalDTO,
        user_id: str,
        transfer_state: TransferStateEnum = TransferStateEnum.PENDING,
        transfer_id: Optional[str] = None,
    ) -> TransferPaymentEntity:
        """
        Convierte un DTO a entidad con contexto adicional.

        Args:
            dto: El DTO a convertir
            user_id: ID del usuario
            transfer_state: Estado de la transferencia
            transfer_id: ID de la transferencia (opcional para nuevas transferencias)

        Returns:
            TransferPaymentEntity: La entidad convertida
        """
        self.logger.debug(f"Converting DTO to entity for user {user_id}")

        return TransferPaymentEntity(
            transfer_id=transfer_id,
            user_id=user_id,
            transfer_img=dto.transfer_img,
            transfer_amount=dto.transfer_amount,
            transfer_state=transfer_state,
            transfer_description=dto.transfer_description,
        )
