from sqladmin import ModelView
from markupsafe import Markup
from starlette.requests import Request
from sqlalchemy import select
from sqlalchemy.orm import selectinload  # I
from infrastructure.db.models import TransferPaymentModel
from app_setup.admin.mixins import ImageUploadAdminMixin


class TransferPaymentAdmin(
    ImageUploadAdminMixin, ModelView, model=TransferPaymentModel
):
    """Panel de administración para pagos de transferencia"""

    name = "Transferencia"
    name_plural = "Transferencias"
    icon = "fa-solid fa-money-bill-transfer"

    # Propiedades requeridas por ImageUploadMixin
    @property
    def image_field_name(self) -> str:
        return "transfer_img"

    @property
    def image_subfolder(self) -> str:
        return "transfers"

    @property
    def primary_key_field(self):
        return TransferPaymentModel.transfer_id

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.setup_image_handling()

    # Columnas visibles en tabla
    column_list = [
        TransferPaymentModel.transfer_id,
        TransferPaymentModel.user,
        TransferPaymentModel.transfer_img,
        TransferPaymentModel.transfer_amount,
        TransferPaymentModel.transfer_state,
        TransferPaymentModel.transfer_description,
        TransferPaymentModel.created_at,
        TransferPaymentModel.updated_at,
    ]

    column_details_list = column_list

    # Campos editables
    form_columns = [
        TransferPaymentModel.user_id,
        TransferPaymentModel.transfer_amount,
        TransferPaymentModel.transfer_state,
        TransferPaymentModel.transfer_description,
    ]

    # Filtros y búsqueda
    column_searchable_list = [
        TransferPaymentModel.transfer_description,
        "user.email",  # Permite búsqueda por email del usuario
    ]
    column_filters = [
        TransferPaymentModel.transfer_state,
        TransferPaymentModel.transfer_amount,
        TransferPaymentModel.created_at,
        TransferPaymentModel.updated_at,
    ]
    column_sortable_list = [
        TransferPaymentModel.transfer_amount,
        TransferPaymentModel.transfer_state,
        TransferPaymentModel.created_at,
        TransferPaymentModel.updated_at,
    ]

    # Etiquetas personalizadas
    column_labels = {
        TransferPaymentModel.transfer_id: "ID de Transferencia",
        TransferPaymentModel.user: "Email del Usuario",
        TransferPaymentModel.transfer_amount: "Cantidad",
        TransferPaymentModel.transfer_state: "Estado",
        TransferPaymentModel.transfer_description: "Descripción",
        TransferPaymentModel.created_at: "Fecha de Creación",
        TransferPaymentModel.updated_at: "Última Actualización",
    }


    badge_state = lambda m, a: (
        "success"
        if m.transfer_state.value == "APPROVED"
        else "warning" if m.transfer_state.value == "PENDING" else "danger"
    )

    # Formato de columnas (tabla principal)
    column_formatters = {
        TransferPaymentModel.user: lambda m, a: m.user.email if m.user else "N/A",
        TransferPaymentModel.transfer_amount: lambda m, a: f"${m.transfer_amount:.2f}",
        TransferPaymentModel.created_at: lambda m, a: m.created_at.strftime(
            "%d/%m/%Y %H:%M"
        ),
        TransferPaymentModel.updated_at: lambda m, a: m.updated_at.strftime(
            "%d/%m/%Y %H:%M"
        ),
        TransferPaymentModel.transfer_description: lambda m, a: (
            (m.transfer_description[:50] + "...")
            if m.transfer_description and len(m.transfer_description) > 50
            else m.transfer_description
        ),
        TransferPaymentModel.transfer_state: lambda m, a: Markup(
            f"""
            <span class='badge badge-{TransferPaymentAdmin.badge_state(m,a)}>
            {m.transfer_state.value}
            </span>
        """
        ),
    }

    # Exportar
    can_export = True
    export_max_rows = 1000
    export_types = ["csv", "xlsx"]

    async def get_query(self, request: Request):
        from infrastructure.db.models import (
            UserModel,
        )

        query = select(self.model).options(selectinload(TransferPaymentModel.user))

        search_term = request.query_params.get("search")
        if search_term:
            # Buscar por descripción o email del usuario
            query = query.join(TransferPaymentModel.user).filter(
                (TransferPaymentModel.transfer_description.ilike(f"%{search_term}%"))
                | (UserModel.email.ilike(f"%{search_term}%"))
            )
        return query
