from fastapi import Depends

from application.mixins.dto_converter_mixin import (
    EntityToDTOConverter,
    BidirectionalConverter,
)
from application.use_cases.payment import (
    CreateTransferPaymentUseCase,
    GetUserTransferPaymentsUseCase,
)
from application.use_cases.payment.get_user_transfer_payment_by_id import (
    GetTransferPaymentByIdUseCase,
)
from application.services.file_upload_service import FileUploadService
from domain.repositories import ITransferPaymentRepository
from dtos.response.user.user_response import UserBaseResponseDTO
from infrastructure.dependencies.services.file_upload_service import (
    get_file_upload_service,
)
from infrastructure.dependencies.use_cases.auth_use_cases import (
    get_current_user_from_request_use_case,
)


from ..repositories import get_transfer_payment_repository
from ..converters import (
    get_transfer_payment_bidirectional_converter,
    get_transfer_payment_entity_to_dto_converter,
)


def get_user_transfer_payments_use_case(
    transfer_repo: ITransferPaymentRepository = Depends(
        get_transfer_payment_repository
    ),
    transfer_converter: EntityToDTOConverter = Depends(
        get_transfer_payment_entity_to_dto_converter
    ),
) -> GetUserTransferPaymentsUseCase:
    """
    Proveedor para el caso de uso de obtener usuario por ID.

    Args:
        transfer_repo: Repositorio de usuarios inyectado
        transfer_converter: Convertidor de usuario inyectado

    Returns:
        GetUserTransferPaymentsUseCase: Caso de uso configurado
    """
    return GetUserTransferPaymentsUseCase(
        transfer_repo=transfer_repo, transfer_converter=transfer_converter
    )


def get_user_transfer_payment_for_id_use_case(
    transfer_repo: ITransferPaymentRepository = Depends(
        get_transfer_payment_repository
    ),
    transfer_converter: EntityToDTOConverter = Depends(
        get_transfer_payment_entity_to_dto_converter
    ),
) -> GetTransferPaymentByIdUseCase:
    """
    Proveedor para el caso de uso de obtener una transferencia de pago por ID.

    Args:
        transfer_repo: Repositorio de transferencias de pago inyectado
        transfer_converter: Convertidor de transferencias de pago inyectado

    Returns:
        GetTransferPaymentByIdUseCase: Caso de uso configurado
    """
    return GetTransferPaymentByIdUseCase(
        transfer_repo=transfer_repo, transfer_converter=transfer_converter
    )


def get_create_transfer_payment_use_case(
    user: UserBaseResponseDTO = Depends(get_current_user_from_request_use_case),
    transfer_repo: ITransferPaymentRepository = Depends(
        get_transfer_payment_repository
    ),
    transfer_converter: BidirectionalConverter = Depends(
        get_transfer_payment_bidirectional_converter
    ),
    file_upload_service: FileUploadService = Depends(get_file_upload_service),
) -> CreateTransferPaymentUseCase:
    """
    Proveedor para el caso de uso de crear una transferencia de pago.

    Args:
        transfer_repo: Repositorio de usuarios inyectado
        transfer_converter: Convertidor de usuario inyectado
        file_upload_service: Servicio de subida de archivos inyectado

    Returns:
        CreateTransferPaymentUseCase: Caso de uso configurado
    """
    return CreateTransferPaymentUseCase(
        user=user,
        transfer_repo=transfer_repo,
        transfer_converter=transfer_converter,
        file_upload_service=file_upload_service,
    )


# Exportar todos los proveedores
__all__ = [
    "get_user_transfer_payment_for_id_use_case",
    "get_user_transfer_payments_use_case",
    "get_create_transfer_payment_use_case",
]
