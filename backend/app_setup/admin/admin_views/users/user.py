from infrastructure.db.models import UserModel
from sqladmin import ModelView


class UserAdmin(ModelView):
    """Panel de administración para usuarios"""

    model = UserModel

    # Configuración de categoría/módulo
    name = "Usuarios"
    name_plural = "Usuarios"
    icon = "fa-solid fa-users"

    # Configuración de columnas
    column_list = [
        UserModel.user_id,
        UserModel.email,
        UserModel.virtual_currency,
        UserModel.role,
        UserModel.created_at,
        UserModel.updated_at,
    ]

    # Columnas a mostrar en detalle
    column_details_list = [
        UserModel.user_id,
        UserModel.email,
        UserModel.virtual_currency,
        UserModel.role,
        UserModel.created_at,
        UserModel.updated_at,
    ]

    # Columnas editables
    form_columns = [
        UserModel.email,
        UserModel.virtual_currency,
        UserModel.role,
    ]

    # Columnas para búsqueda
    column_searchable_list = [UserModel.email]

    # Columnas para filtrado
    column_filters = [
        UserModel.email,
        UserModel.role,
        UserModel.virtual_currency,
        UserModel.created_at,
    ]

    # Configuración de ordenamiento
    column_sortable_list = [
        UserModel.email,
        UserModel.virtual_currency,
        UserModel.created_at,
        UserModel.updated_at,
    ]

    # Configuración de paginación
    page_size = 25
    page_size_options = [25, 50, 100]

    # Personalizar etiquetas de columnas
    column_labels = {
        UserModel.user_id: "ID de Usuario",
        UserModel.email: "Correo Electrónico",
        UserModel.virtual_currency: "Moneda Virtual",
        UserModel.created_at: "Fecha de Creación",
        UserModel.updated_at: "Última Actualización",
        UserModel.role: "Rol",
    }

    # Formatear columnas
    column_formatters = {
        UserModel.virtual_currency: lambda m, a: f"${m.virtual_currency:.2f}",
        UserModel.created_at: lambda m, a: m.created_at.strftime("%d/%m/%Y %H:%M"),
        UserModel.updated_at: lambda m, a: m.updated_at.strftime("%d/%m/%Y %H:%M"),
    }

    # Configuración de exportación
    can_export = True
    export_max_rows = 1000
    export_types = ["csv", "xlsx"]
