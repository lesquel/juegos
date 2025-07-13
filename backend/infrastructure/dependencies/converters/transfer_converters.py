"""
Proveedores de convertidores para transferencias.

Este módulo contiene las funciones que crean instancias de convertidores
relacionados con transferencias de pago.
"""

from application.mixins.dto_converter_mixin import EntityToDTOConverter, BidirectionalConverter
from application.converters.user.transfer_payment_converters import (
    TransferPaymentEntityToDTOConverter,
    TransferPaymentBidirectionalConverter,
)


def get_transfer_payment_converter() -> EntityToDTOConverter:
    """
    Proveedor para el convertidor de transferencias de pago.
    
    Returns:
        EntityToDTOConverter: Convertidor de TransferPaymentEntity a TransferPaymentResponseDTO
    """
    return TransferPaymentEntityToDTOConverter()


def get_transfer_payment_bidirectional_converter() -> BidirectionalConverter:
    """
    Proveedor para el convertidor bidireccional de transferencias de pago.
    
    Returns:
        BidirectionalConverter: Convertidor bidireccional para TransferPayment
    """
    return TransferPaymentBidirectionalConverter()


# Exportar todos los proveedores
__all__ = [
    "get_transfer_payment_converter",
    "get_transfer_payment_bidirectional_converter",
]
