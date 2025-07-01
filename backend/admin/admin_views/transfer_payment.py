"""
Vista de administración para Pagos de Transferencia
"""

from sqladmin import ModelView
from infrastructure.db.models.transfer_payment_model import TransferPaymentModel


class TransferPaymentAdmin(ModelView, model=TransferPaymentModel):
    """Panel de administración para pagos de transferencia"""

    # Configuración de columnas
    column_list = [
        TransferPaymentModel.transfer_id,
        TransferPaymentModel.user_id,
        TransferPaymentModel.transfer_img,
        TransferPaymentModel.transfer_amount,
        TransferPaymentModel.transfer_state,
        TransferPaymentModel.transfer_description,
        TransferPaymentModel.created_at,
        TransferPaymentModel.updated_at,
    ]

    # Columnas a mostrar en detalle
    column_details_list = [
        TransferPaymentModel.transfer_id,
        TransferPaymentModel.user_id,
        TransferPaymentModel.transfer_img,
        TransferPaymentModel.transfer_amount,
        TransferPaymentModel.transfer_state,
        TransferPaymentModel.transfer_description,
        TransferPaymentModel.created_at,
        TransferPaymentModel.updated_at,
    ]

    # Columnas editables
    form_columns = [
        TransferPaymentModel.user_id,
        TransferPaymentModel.transfer_img,
        TransferPaymentModel.transfer_amount,
        TransferPaymentModel.transfer_state,
        TransferPaymentModel.transfer_description,
    ]

    # Columnas para búsqueda
    column_searchable_list = [TransferPaymentModel.transfer_description]

    # Columnas para filtrado
    column_filters = [
        TransferPaymentModel.user_id,
        TransferPaymentModel.transfer_state,
        TransferPaymentModel.transfer_amount,
        TransferPaymentModel.created_at,
        TransferPaymentModel.updated_at,
    ]

    # Configuración de ordenamiento
    column_sortable_list = [
        TransferPaymentModel.transfer_amount,
        TransferPaymentModel.transfer_state,
        TransferPaymentModel.created_at,
        TransferPaymentModel.updated_at,
    ]

    # Configuración de paginación
    page_size = 25
    page_size_options = [25, 50, 100]

    # Título personalizado
    name = "Pago de Transferencia"
    name_plural = "Pagos de Transferencias"
    icon = "fa-solid fa-money-bill-transfer"

    # Personalizar etiquetas de columnas
    column_labels = {
        TransferPaymentModel.transfer_id: "ID de Transferencia",
        TransferPaymentModel.user_id: "ID del Usuario",
        TransferPaymentModel.transfer_img: "Imagen de Transferencia",
        TransferPaymentModel.transfer_amount: "Cantidad",
        TransferPaymentModel.transfer_state: "Estado",
        TransferPaymentModel.transfer_description: "Descripción",
        TransferPaymentModel.created_at: "Fecha de Creación",
        TransferPaymentModel.updated_at: "Última Actualización",
    }

    # Formatear columnas
    column_formatters = {
        TransferPaymentModel.transfer_amount: lambda m, a: f"${m.transfer_amount:.2f}",
        TransferPaymentModel.created_at: lambda m, a: m.created_at.strftime("%d/%m/%Y %H:%M"),
        TransferPaymentModel.updated_at: lambda m, a: m.updated_at.strftime("%d/%m/%Y %H:%M"),
        TransferPaymentModel.transfer_description: lambda m, a: (m.transfer_description[:50] + "...") if m.transfer_description and len(m.transfer_description) > 50 else m.transfer_description,
        TransferPaymentModel.transfer_state: lambda m, a: f"<span class='badge badge-{'success' if m.transfer_state.value == 'APPROVED' else 'warning' if m.transfer_state.value == 'PENDING' else 'danger'}'>{m.transfer_state.value}</span>",
    }

    # Configuración de exportación
    can_export = True
    export_max_rows = 1000
    export_types = ["csv", "xlsx"]
