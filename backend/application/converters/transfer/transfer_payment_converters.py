from typing import Optional

from application.mixins import BidirectionalConverter, LoggingMixin
from domain.entities.transfer.transfer_payment import TransferPaymentEntity
from domain.enums import TransferStateEnum
from dtos.request.transfer.transfer_payment_request import (
    CreateTransferPaymentInternalDTO,
)
from dtos.response.transfer.transfer_payment_response_dto import (
    TransferPaymentResponseDTO,
)

from .transfer_payment_dto_to_entity_converter import (
    TransferPaymentDTOToEntityConverter,
)

# Import the modularized converters
from .transfer_payment_entity_to_dto_converter import (
    TransferPaymentEntityToDTOConverter,
)


class TransferPaymentBidirectionalConverter(
    BidirectionalConverter[TransferPaymentEntity, TransferPaymentResponseDTO],
    LoggingMixin,
):
    """Conversor bidireccional para TransferPayment."""

    def __init__(self):
        super().__init__()
        self.entity_to_dto = TransferPaymentEntityToDTOConverter()
        self.dto_to_entity = TransferPaymentDTOToEntityConverter()

    def to_dto(self, entity: TransferPaymentEntity) -> TransferPaymentResponseDTO:
        """
        Convierte entidad a DTO de respuesta.

        Args:
            entity: La entidad a convertir

        Returns:
            TransferPaymentResponseDTO: El DTO convertido
        """
        self.logger.debug(
            f"Converting TransferPaymentEntity to TransferPaymentResponseDTO for transfer: {entity.transfer_id}"
        )
        return self.entity_to_dto.to_dto(entity)

    def to_entity(self, dto: TransferPaymentResponseDTO) -> TransferPaymentEntity:
        """
        Convierte DTO de respuesta a entidad.

        Args:
            dto: El DTO de respuesta a convertir

        Returns:
            TransferPaymentEntity: La entidad convertida
        """
        self.logger.debug(
            f"Converting TransferPaymentResponseDTO to TransferPaymentEntity for transfer: {dto.transfer_id}"
        )
        return self.dto_to_entity.to_entity(dto)

    def from_request_dto(
        self,
        dto: CreateTransferPaymentInternalDTO,
        user_id: str,
        transfer_id: Optional[str] = None,
        transfer_state: TransferStateEnum = TransferStateEnum.PENDING,
    ) -> TransferPaymentEntity:
        """
        Convierte DTO de solicitud a entidad.

        Args:
            dto: El DTO de solicitud interno a convertir
            user_id: ID del usuario que realiza la transferencia
            transfer_id: ID de la transferencia (opcional)
            transfer_state: Estado inicial de la transferencia

        Returns:
            TransferPaymentEntity: La entidad convertida
        """
        self.logger.debug(
            f"Converting TransferPaymentInternalDTO to TransferPaymentEntity for user: {user_id}"
        )
        return self.dto_to_entity.convert_with_context(
            dto, user_id, transfer_state, transfer_id
        )
