from application.mixins import EntityToDTOConverter, LoggingMixin
from domain.entities.transfer.transfer_payment import TransferPaymentEntity
from dtos.response.transfer.transfer_payment_response_dto import (
    TransferPaymentResponseDTO,
)


class TransferPaymentEntityToDTOConverter(
    EntityToDTOConverter[TransferPaymentEntity, TransferPaymentResponseDTO],
    LoggingMixin,
):
    """Convierte TransferPaymentEntity a TransferPaymentResponseDTO."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: TransferPaymentEntity) -> TransferPaymentResponseDTO:
        """
        Convierte una entidad TransferPayment a DTO de respuesta.

        Args:
            entity: La entidad TransferPayment a convertir

        Returns:
            TransferPaymentResponseDTO: El DTO de respuesta convertido
        """
        self.logger.debug(
            f"Converting TransferPaymentEntity to TransferPaymentResponseDTO for transfer: {entity.transfer_id}"
        )
        dto = TransferPaymentResponseDTO(
            transfer_id=entity.transfer_id,
            user_id=entity.user_id,
            transfer_img=entity.transfer_img,
            transfer_amount=entity.transfer_amount,
            transfer_state=entity.transfer_state,
            transfer_description=entity.transfer_description,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

        self.logger.debug(
            "Successfully converted TransferPaymentEntity to TransferPaymentResponseDTO"
        )
        return dto
