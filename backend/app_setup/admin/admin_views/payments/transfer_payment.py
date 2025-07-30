from app_setup.admin.mixins import ImageUploadAdminMixin
from infrastructure.db.connection import AsyncSessionLocal
from infrastructure.db.models import TransferPaymentModel
from infrastructure.db.models.user.user_model import UserModel
from markupsafe import Markup
from sqladmin import ModelView
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from starlette.requests import Request


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
        TransferPaymentModel.transfer_state,
    ]

    # Filtros y búsqueda
    column_searchable_list = [
        TransferPaymentModel.transfer_description,
        "user.email",
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

    @staticmethod
    def get_badge_state(state_value: str) -> str:
        """Devuelve el color del badge según el estado"""
        if state_value == "completed":
            return "success"
        elif state_value == "pending":
            return "warning"
        return "danger"

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
            <span class='badge badge-{TransferPaymentAdmin.get_badge_state(m.transfer_state.value)}'>
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
        from infrastructure.db.models import UserModel

        query = select(self.model).options(selectinload(TransferPaymentModel.user))

        search_term = request.query_params.get("search")
        if search_term:
            query = query.join(TransferPaymentModel.user).filter(
                (TransferPaymentModel.transfer_description.ilike(f"%{search_term}%"))
                | (UserModel.email.ilike(f"%{search_term}%"))
            )
        return query

    async def on_model_edit(
        self, data: dict, model: TransferPaymentModel, is_created: bool
    ) -> None:
        """Se ejecuta después de editar un modelo"""

        try:
            if not is_created and str(model.transfer_state).lower() == "completed":
                async with AsyncSessionLocal() as session:
                    # Obtener el estado original desde la base de datos
                    result = await session.execute(
                        select(TransferPaymentModel.transfer_state).where(
                            TransferPaymentModel.transfer_id == model.transfer_id
                        )
                    )
                    original_state = result.scalar_one_or_none()

                    # Si el estado original no era COMPLETED, actualizamos el saldo
                    if (
                        original_state is not None
                        and str(original_state).lower() != "completed"
                    ):
                        # Sumar la cantidad al saldo del usuario
                        update_result = await session.execute(
                            update(UserModel)
                            .where(UserModel.user_id == model.user_id)
                            .values(
                                virtual_currency=UserModel.virtual_currency
                                + model.transfer_amount
                            )
                        )

                        if update_result.rowcount == 1:
                            await session.commit()

        except Exception:
            import traceback

            traceback.print_exc()
            raise

    async def after_model_change(
        self, data, model, is_created, request: Request
    ) -> None:
        """Se ejecuta después de crear o actualizar un modelo"""

        try:
            # Solo procesar si es una actualización y el estado es COMPLETED

            if not is_created and str(model.transfer_state).lower() == "completed":
                async with AsyncSessionLocal() as session:
                    # Obtener el estado original desde la base de datos
                    result = await session.execute(
                        select(TransferPaymentModel.transfer_state).where(
                            TransferPaymentModel.transfer_id == model.transfer_id
                        )
                    )
                    original_state = result.scalar_one_or_none()

                    # Si el estado original no era COMPLETED, actualizamos el saldo
                    if (
                        original_state is not None
                        and str(original_state).lower() != "completed"
                    ):
                        # Sumar la cantidad al saldo del usuario
                        result = await session.execute(
                            update(UserModel)
                            .where(UserModel.user_id == model.user_id)
                            .values(
                                virtual_currency=UserModel.virtual_currency
                                + model.transfer_amount
                            )
                        )

                        if result.rowcount == 1:
                            await session.commit()

        except Exception:
            import traceback

            traceback.print_exc()
            raise
