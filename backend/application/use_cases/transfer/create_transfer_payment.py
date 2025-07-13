from domain.entities.transfer.transfer_payment import TransferPaymentEntity
from domain.repositories.transfer_payment_repository import ITransferPaymentRepository
from dtos.request.transfer.transfer_payment_request_dto import CreateTransferPaymentRequestDTO
from dtos.response.user.transfer_payment_response_dto import TransferPaymentResponseDTO
from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import BidirectionalConverter
from application.enums import TransferStateEnum
from infrastructure.logging import log_execution, log_performance


class CreateTransferPaymentUseCase(BaseUseCase[CreateTransferPaymentRequestDTO, TransferPaymentResponseDTO]):
    """Caso de uso para crear una nueva transferencia de pago."""

    def __init__(self, transfer_repository: ITransferPaymentRepository, transfer_converter: BidirectionalConverter):
        super().__init__()
        self.transfer_repository = transfer_repository
        self.converter = transfer_converter

    @log_execution(include_args=False, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(self, request_dto: CreateTransferPaymentRequestDTO, user_id: str) -> TransferPaymentResponseDTO:
        """
        Crea una nueva transferencia de pago.

        Args:
            request_dto: DTO con los datos de la transferencia
            user_id: ID del usuario que realiza la transferencia

        Returns:
            TransferPaymentResponseDTO: DTO con los datos de la transferencia creada

        Raises:
            ValueError: Si los datos de entrada son inválidos
        """
        self.logger.info(f"Creating transfer payment for user {user_id}")

        try:
            # Convertir DTO a entidad
            transfer_entity = self.converter.from_request_dto(
                request_dto, 
                user_id, 
                transfer_state=TransferStateEnum.PENDING
            )

            # Crear la transferencia
            created_transfer = await self.transfer_repository.create(transfer_entity)

            # Convertir entidad a DTO de respuesta
            response_dto = self.converter.to_dto(created_transfer)

            self.logger.info(f"Transfer payment created successfully: {created_transfer.transfer_id}")
            return response_dto

        except Exception as e:
            self.logger.error(f"Error creating transfer payment: {str(e)}")
            raise
