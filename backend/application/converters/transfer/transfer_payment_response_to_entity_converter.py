"""
Conversor de TransferPaymentResponseDTO a TransferPaymentEntity.
"""

from application.mixins.logging_mixin import LoggingMixin
from domain.entities.transfer.transfer_payment import TransferPaymentEntity
from dtos.response.transfer.transfer_payment_response_dto import TransferPaymentResponseDTO


class TransferPaymentResponseToEntityConverter(LoggingMixin):
    """Convierte TransferPaymentResponseDTO a TransferPaymentEntity."""

    def __init__(self):
        super().__init__()

    def to_entity(self, dto: TransferPaymentResponseDTO) -> TransferPaymentEntity:
        """
        Convierte DTO de respuesta a entidad.
        
        Args:
            dto: El DTO de respuesta a convertir
            
        Returns:
            TransferPaymentEntity: La entidad convertida
        """
        self.logger.debug(f"Converting TransferPaymentResponseDTO to TransferPaymentEntity for transfer: {dto.transfer_id}")
        
        try:
            entity = TransferPaymentEntity(
                transfer_id=dto.transfer_id,
                user_id=dto.user_id,
                transfer_img=dto.transfer_img,
                transfer_amount=dto.transfer_amount,
                transfer_state=dto.transfer_state,
                transfer_description=dto.transfer_description,
                created_at=dto.created_at,
                updated_at=dto.updated_at
            )
            
            self.logger.debug("Successfully converted TransferPaymentResponseDTO to TransferPaymentEntity")
            return entity
            
        except Exception as e:
            self.logger.error(f"Error converting ResponseDTO to TransferPaymentEntity: {str(e)}")
            raise
