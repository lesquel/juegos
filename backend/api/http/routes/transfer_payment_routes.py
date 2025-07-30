from typing import Optional
from uuid import UUID

from api.http.common import (
    PaginationParams,
    SortParams,
    get_pagination_params,
    get_sort_params,
)
from api.http.common.response_utils import handle_paginated_request
from application.use_cases.payment import (
    CreateTransferPaymentUseCase,
    GetTransferPaymentByIdUseCase,
    GetUserTransferPaymentsUseCase,
)
from dtos import PaginatedResponseDTO
from dtos.request.transfer.transfer_payment_request import CreateTransferPaymentFormDTO
from dtos.response.transfer import TransferPaymentResponseDTO
from fastapi import APIRouter, Depends, File, Form, Request, UploadFile
from infrastructure.dependencies.use_cases.transfer_payment_use_cases import (
    get_create_transfer_payment_use_case,
    get_user_transfer_payment_for_id_use_case,
    get_user_transfer_payments_use_case,
)
from infrastructure.logging import get_logger

from ..common.filters.specific_filters import (
    TransferPaymentFilterParams,
    get_transfer_payment_filter_params,
)

transfer_router = APIRouter(prefix="/users", tags=["Transfer Payments"])

# Configurar logger
logger = get_logger("transfer_routes")


@transfer_router.get(
    "/{user_id}/transfers",
    response_model=PaginatedResponseDTO[TransferPaymentResponseDTO],
)
async def get_user_transfer_payments(
    user_id: UUID,
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    sort_params: SortParams = Depends(get_sort_params),
    filters: TransferPaymentFilterParams = Depends(get_transfer_payment_filter_params),
    use_case: GetUserTransferPaymentsUseCase = Depends(
        get_user_transfer_payments_use_case,
    ),
) -> PaginatedResponseDTO[TransferPaymentResponseDTO]:
    """
    Obtiene usuarios paginados con filtros opcionales.

    Query Parameters:
    - page: Número de página (default: 1)
    - limit: Elementos por página (default: 10, max: 100)
    - email: Filtrar por email (búsqueda parcial)
    - min_currency: Moneda virtual mínima
    - max_currency: Moneda virtual máxima
    """

    return await handle_paginated_request(
        endpoint_name="GET /transfer_payments",
        request=request,
        pagination=pagination,
        sort_params=sort_params,
        filters=filters,
        use_case_execute=lambda p, f, s: use_case.execute(str(user_id), p, f, s),
        logger=logger,
    )


@transfer_router.get(
    "/transfers/{transfer_id}", response_model=TransferPaymentResponseDTO
)
async def get_user_transfer_payment_by_id(
    transfer_id: UUID,
    use_case: GetTransferPaymentByIdUseCase = Depends(
        get_user_transfer_payment_for_id_use_case
    ),
) -> TransferPaymentResponseDTO:
    """
    Obtiene un usuario específico por ID.

    Args:
        user_id: ID del usuario a obtener
    """

    return await use_case.execute(str(transfer_id))


@transfer_router.post("/transfers", response_model=TransferPaymentResponseDTO)
async def create_user_transfer_payment(
    transfer_img: UploadFile = File(
        ..., description="Imagen del comprobante de transferencia"
    ),
    transfer_amount: float = Form(..., gt=0, description="Monto de la transferencia"),
    transfer_description: Optional[str] = Form(
        None, max_length=500, description="Descripción opcional"
    ),
    use_case: CreateTransferPaymentUseCase = Depends(
        get_create_transfer_payment_use_case
    ),
) -> TransferPaymentResponseDTO:
    """
    Crea un nuevo pago de transferencia para un usuario.

    Args:
        user_id: ID del usuario para el cual se crea la transferencia
        transfer_img: Archivo de imagen del comprobante
        transfer_amount: Monto de la transferencia
        transfer_description: Descripción opcional de la transferencia
    """

    # Crear el objeto DTO de formulario
    form_data = CreateTransferPaymentFormDTO(
        transfer_img=transfer_img,
        transfer_amount=transfer_amount,
        transfer_description=transfer_description,
    )
    return await use_case.execute(form_data=form_data)
