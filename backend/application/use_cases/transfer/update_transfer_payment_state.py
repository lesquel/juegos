"""
Caso de uso para actualizar el estado de una transferencia de pago.

Este módulo contiene la lógica para actualizar el estado de una transferencia
de pago (por ejemplo, de PENDING a APPROVED o REJECTED).
"""

from typing import Optional
from domain.repositories.transfer_payment_repository import ITransferPaymentRepository
from dtos.response.user.transfer_payment_response_dto import TransferPaymentResponseDTO
from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from application.enums import TransferStateEnum
from domain.exceptions.transfer import TransferNotFoundError
from infrastructure.logging import log_execution, log_performance


class UpdateTransferPaymentStateUseCase(BaseUseCase[None, TransferPaymentResponseDTO]):
    """Caso de uso para actualizar el estado de una transferencia de pago."""

    def __init__(self, transfer_repository: ITransferPaymentRepository, transfer_converter: EntityToDTOConverter):
        super().__init__()
        self.transfer_repository = transfer_repository
        self.converter = transfer_converter

    @log_execution(include_args=True, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(self, transfer_id: str, new_state: TransferStateEnum) -> TransferPaymentResponseDTO:
        """
        Actualiza el estado de una transferencia de pago.

        Args:
            transfer_id: ID de la transferencia
            new_state: Nuevo estado de la transferencia

        Returns:
            TransferPaymentResponseDTO: DTO con los datos de la transferencia actualizada

        Raises:
            TransferNotFoundError: Si la transferencia no existe
        """
        self.logger.info(f"Updating transfer payment {transfer_id} state to {new_state}")

        try:
            # Actualizar el estado de la transferencia
            updated_transfer = await self.transfer_repository.update_state(transfer_id, new_state)

            if not updated_transfer:
                raise TransferNotFoundError(f"Transfer with ID {transfer_id} not found")

            # Convertir entidad a DTO de respuesta
            response_dto = self.converter.to_dto(updated_transfer)

            self.logger.info(f"Transfer payment {transfer_id} state updated to {new_state}")
            return response_dto

        except Exception as e:
            self.logger.error(f"Error updating transfer payment {transfer_id} state: {str(e)}")
            raise
