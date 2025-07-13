from fastapi import Depends

from application.mixins.dto_converter_mixin import EntityToDTOConverter, BidirectionalConverter
from application.use_cases.transfer import (
    CreateTransferPaymentUseCase,
    UpdateTransferPaymentStateUseCase,
    GetUserTransferPaymentsUseCase,
)
from domain.repositories import ITransferPaymentRepository

from ..repositories import get_transfer_payment_repository
from ..converters import get_transfer_payment_bidirectional_converter

def get_transfer_payment_for_id_use_case(
    transfer_repo: ITransferPaymentRepository = Depends(get_transfer_payment_repository),
    transfer_converter: EntityToDTOConverter = Depends(
        get_transfer_payment_bidirectional_converter
    ),
) -> GetUserTransferPaymentsUseCase:
    """
    Proveedor para el caso de uso de obtener una transferencia de pago por ID.

    Args:
        transfer_repo: Repositorio de transferencias de pago inyectado
        transfer_converter: Convertidor de transferencias de pago inyectado

    Returns:
        GetUserTransferPaymentsUseCase: Caso de uso configurado
    """
    return GetUserTransferPaymentsUseCase(
        transfer_repo=transfer_repo, transfer_converter=transfer_converter
    )


def get_user_transfer_payments_use_case(
    transfer_repo: ITransferPaymentRepository = Depends(get_transfer_payment_repository),
    transfer_converter: EntityToDTOConverter = Depends(
        get_transfer_payment_bidirectional_converter
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


def get_create_transfer_payment_use_case(
    transfer_repo: ITransferPaymentRepository = Depends(get_transfer_payment_repository),
    transfer_converter: BidirectionalConverter = Depends(
        get_transfer_payment_bidirectional_converter
    ),
) -> CreateTransferPaymentUseCase:
    """
    Proveedor para el caso de uso de crear una transferencia de pago.

    Args:
        transfer_repo: Repositorio de usuarios inyectado
        transfer_converter: Convertidor de usuario inyectado

    Returns:
        CreateTransferPaymentUseCase: Caso de uso configurado
    """
    return CreateTransferPaymentUseCase(
        transfer_repo=transfer_repo, transfer_converter=transfer_converter
    )


def get_update_transfer_payment_use_case(
    transfer_repo: ITransferPaymentRepository = Depends(get_transfer_payment_repository),
    transfer_converter: BidirectionalConverter = Depends(
        get_transfer_payment_bidirectional_converter
    ),
) -> UpdateTransferPaymentStateUseCase:
    """
    Proveedor para el caso de uso de actualizar una transferencia de pago.

    Args:
        transfer_repo: Repositorio de usuarios inyectado
        transfer_converter: Convertidor de usuario inyectado

    Returns:
        UpdateTransferPaymentStateUseCase: Caso de uso configurado
    """
    return UpdateTransferPaymentStateUseCase(
        transfer_repo=transfer_repo, transfer_converter=transfer_converter
    )


# Exportar todos los proveedores
__all__ = []
