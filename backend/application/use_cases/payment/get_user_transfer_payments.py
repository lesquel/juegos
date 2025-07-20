from typing import List, Tuple

from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.repositories.transfer_payment_repository import ITransferPaymentRepository
from dtos.response.transfer.transfer_payment_response_dto import (
    TransferPaymentResponseDTO,
)
from infrastructure.logging import log_execution, log_performance


class GetUserTransferPaymentsUseCase(BaseUseCase):
    """Caso de uso para obtener todas las transferencias de un usuario."""

    def __init__(
        self,
        transfer_repo: ITransferPaymentRepository,
        transfer_converter: EntityToDTOConverter,
    ):
        super().__init__()
        self.transfer_repo = transfer_repo
        self.transfer_converter = transfer_converter

    @log_execution(include_args=True, include_result=False, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self, user_id: str, pagination, filters, sort_params
    ) -> Tuple[List[TransferPaymentResponseDTO], int]:
        """
        Obtiene todas las transferencias de un usuario.

        Args:
            user_id: ID del usuario

        Returns:
            List[TransferPaymentResponseDTO]: Lista de transferencias del usuario
        """
        self.logger.info(f"Getting transfer payments for user {user_id}")

        # Obtener las transferencias del usuario
        transfers, count = await self.transfer_repo.get_by_user_id(
            user_id, pagination, filters, sort_params
        )

        # Convertir entidades a DTOs
        self.logger.info(f"Found {len(transfers)} transfer payments for user {user_id}")
        return self.transfer_converter.to_dto_list(transfers), count
