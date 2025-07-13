from typing import List
from domain.repositories.transfer_payment_repository import ITransferPaymentRepository
from dtos.response.user.transfer_payment_response_dto import TransferPaymentResponseDTO
from application.interfaces.base_use_case import BaseUseCase
from application.converters.user.transfer_payment_converters import (
    TransferPaymentEntityToDTOConverter,
)
from infrastructure.logging import log_execution, log_performance


class GetUserTransferPaymentsUseCase(BaseUseCase):
    """Caso de uso para obtener todas las transferencias de un usuario."""

    def __init__(self, transfer_repository: ITransferPaymentRepository):
        super().__init__()
        self.transfer_repository = transfer_repository
        self.converter = TransferPaymentEntityToDTOConverter()

    @log_execution(include_args=True, include_result=False, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(self, user_id: str) -> List[TransferPaymentResponseDTO]:
        """
        Obtiene todas las transferencias de un usuario.

        Args:
            user_id: ID del usuario

        Returns:
            List[TransferPaymentResponseDTO]: Lista de transferencias del usuario
        """
        self.logger.info(f"Getting transfer payments for user {user_id}")

        try:
            # Obtener las transferencias del usuario
            transfers = await self.transfer_repository.get_by_user_id(user_id)

            # Convertir entidades a DTOs
            response_dtos = [self.converter.to_dto(transfer) for transfer in transfers]

            self.logger.info(
                f"Found {len(response_dtos)} transfer payments for user {user_id}"
            )
            return response_dtos

        except Exception as e:
            self.logger.error(
                f"Error getting transfer payments for user {user_id}: {str(e)}"
            )
            raise
