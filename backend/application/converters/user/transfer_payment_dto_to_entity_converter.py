"""
Conversor de TransferPaymentRequestDTO a TransferPaymentEntity.
"""

from typing import Optional
from application.mixins.dto_converter_mixin import DTOToEntityConverter
from application.mixins.logging_mixin import LoggingMixin
from domain.entities.transfer.transfer_payment import TransferPaymentEntity
from dtos.request.transfer.transfer_payment_request_dto import TransferPaymentRequestDTO
from application.enums import TransferStateEnum


class TransferPaymentDTOToEntityConverter(DTOToEntityConverter[TransferPaymentRequestDTO, TransferPaymentEntity], LoggingMixin):
    """Convierte TransferPaymentRequestDTO a TransferPaymentEntity."""

    def __init__(self):
        super().__init__()

    def to_entity(self, dto: TransferPaymentRequestDTO) -> TransferPaymentEntity:
        """
        Implementación del método abstracto requerido.
        
        Nota: Para casos reales use convert_with_context() con parámetros adicionales.
        
        Args:
            dto: El DTO a convertir
            
        Raises:
            ValueError: Si se llama sin contexto adicional
        """
        raise ValueError(
            "Para convertir TransferPaymentRequestDTO use convert_with_context() "
            "con parámetros adicionales: user_id, transfer_id y transfer_state"
        )

    def convert_with_context(
        self, 
        dto: TransferPaymentRequestDTO, 
        user_id: str,
        transfer_id: Optional[str] = None,
        transfer_state: TransferStateEnum = TransferStateEnum.PENDING
    ) -> TransferPaymentEntity:
        """
        Convierte un DTO de solicitud TransferPayment a entidad con contexto adicional.
        
        Args:
            dto: El DTO de solicitud a convertir
            user_id: ID del usuario que realiza la transferencia
            transfer_id: ID de la transferencia (opcional para creación)
            transfer_state: Estado inicial de la transferencia
            
        Returns:
            TransferPaymentEntity: La entidad convertida
        """
        self.logger.debug(f"Converting TransferPaymentRequestDTO to TransferPaymentEntity for user: {user_id}")
        
        try:
            entity = TransferPaymentEntity(
                transfer_id=transfer_id,
                user_id=user_id,
                transfer_img=dto.transfer_img,
                transfer_amount=dto.transfer_amount,
                transfer_state=transfer_state,
                transfer_description=dto.transfer_description
            )
            
            self.logger.debug("Successfully converted TransferPaymentRequestDTO to TransferPaymentEntity")
            return entity
            
        except Exception as e:
            self.logger.error(f"Error converting DTO to TransferPaymentEntity: {str(e)}")
            raise
