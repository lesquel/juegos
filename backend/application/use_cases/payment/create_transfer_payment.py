from application.enums import TransferStateEnum
from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import BidirectionalConverter
from application.services.file_upload_service import FileUploadService
from domain.repositories.transfer_payment_repository import ITransferPaymentRepository
from dtos.request.transfer.transfer_payment_request import (
    CreateTransferPaymentFormDTO,
    CreateTransferPaymentInternalDTO,
)
from dtos.response.transfer.transfer_payment_response_dto import (
    TransferPaymentResponseDTO,
)
from dtos.response.user.user_response import UserBaseResponseDTO
from infrastructure.logging import log_execution, log_performance


class CreateTransferPaymentUseCase(
    BaseUseCase[CreateTransferPaymentFormDTO, TransferPaymentResponseDTO]
):
    """Caso de uso para crear una nueva transferencia de pago."""

    def __init__(
        self,
        user: UserBaseResponseDTO,
        transfer_repo: ITransferPaymentRepository,
        transfer_converter: BidirectionalConverter,
        file_upload_service: FileUploadService,
    ):
        super().__init__()
        self.user = user
        self.transfer_repo = transfer_repo
        self.transfer_converter = transfer_converter
        self.file_upload_service = file_upload_service

    @log_execution(include_args=False, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self, form_data: CreateTransferPaymentFormDTO
    ) -> TransferPaymentResponseDTO:
        """
        Crea una nueva transferencia de pago.

        Args:
            form_data: Datos del formulario con archivo de imagen
        """

        self.logger.info(f"Creating transfer payment for user {self.user.user_id}")

        try:
            # Subir imagen y obtener URL
            image_url = await self.file_upload_service.execute(
                form_data.transfer_img, subfolder="transfers"
            )

            # Crear DTO interno con la URL de la imagen
            internal_dto = CreateTransferPaymentInternalDTO(
                transfer_img=image_url,
                transfer_amount=form_data.transfer_amount,
                transfer_description=form_data.transfer_description,
            )

            # Convertir DTO a entidad
            transfer_entity = self.transfer_converter.from_request_dto(
                internal_dto,
                self.user.user_id,
                transfer_state=TransferStateEnum.PENDING,
            )

            # Crear la transferencia
            created_transfer = await self.transfer_repo.save(transfer_entity)

            # Convertir entidad a DTO de respuesta
            response_dto = self.transfer_converter.to_dto(created_transfer)

            self.logger.info(
                f"Transfer payment created successfully: {created_transfer.transfer_id}"
            )
            return response_dto

        except Exception as e:
            self.logger.error(f"Error creating transfer payment: {str(e)}")
            # Si hubo error después de subir la imagen, intentar eliminarla
            if "image_url" in locals():
                await self.file_upload_service.delete_image(image_url)
            raise
