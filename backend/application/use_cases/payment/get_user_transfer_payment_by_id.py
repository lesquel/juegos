from typing import List

from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.repositories.transfer_payment_repository import ITransferPaymentRepository
from dtos.response.transfer.transfer_payment_response_dto import (
    TransferPaymentResponseDTO,
)
from infrastructure.logging import log_execution, log_performance


class GetTransferPaymentByIdUseCase(BaseUseCase):
    """Caso de uso para obtener todas las transferencias de un usuario."""

    def __init__(
        self,
        transfer_repo: ITransferPaymentRepository,
        transfer_converter: EntityToDTOConverter,
    ):
        super().__init__()
        self.transfer_repository = transfer_repo
        self.transfer_converter = transfer_converter

    @log_execution(include_args=True, include_result=False, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(self, transfer_id: str) -> List[TransferPaymentResponseDTO]:
        """
        Obtiene todas las transferencias de un usuario.

        Args:
            user_id: ID del usuario

        Returns:
            List[TransferPaymentResponseDTO]: Lista de transferencias del usuario
        """
        self.logger.info(f"Getting transfer payments for user {transfer_id}")

        # Obtener las transferencias del usuario
        transfer = await self.transfer_repository.get_transfer_id(transfer_id)

        # Convertir entidades a DTOs
        self.logger.info(f"Found transfer payment for user {transfer.user_id}")
        return self.transfer_converter.to_dto(transfer)
