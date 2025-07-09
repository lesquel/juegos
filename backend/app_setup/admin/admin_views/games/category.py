from sqladmin import ModelView
from infrastructure.db.models.category_model import CategoryModel


class CategoryAdmin(ModelView, model=CategoryModel):
    """Panel de administración para categorías"""
    
    # Configuración de categoría/módulo
    name = "Categoría"
    name_plural = "Categorías"
    icon = "fa-solid fa-tags"
    category = "Juegos"

    # Configuración de columnas
    column_list = [
        CategoryModel.category_id,
        CategoryModel.category_name,
        CategoryModel.category_img,
        CategoryModel.category_description,
        CategoryModel.games,
        CategoryModel.created_at,
        CategoryModel.updated_at,
    ]

    # Columnas a mostrar en detalle
    column_details_list = [
        CategoryModel.category_id,
        CategoryModel.category_name,
        CategoryModel.category_img,
        CategoryModel.category_description,
        CategoryModel.games,
        CategoryModel.created_at,
        CategoryModel.updated_at,
    ]

    # Columnas editables
    form_columns = [
        CategoryModel.category_name,
        CategoryModel.category_img,
        CategoryModel.category_description,
        CategoryModel.games,
    ]

    # Columnas para búsqueda
    column_searchable_list = [CategoryModel.category_name, CategoryModel.category_description]

    # Columnas para filtrado
    column_filters = [
        CategoryModel.category_name,
        CategoryModel.created_at,
        CategoryModel.updated_at,
    ]

    # Configuración de ordenamiento
    column_sortable_list = [
        CategoryModel.category_name,
        CategoryModel.created_at,
        CategoryModel.updated_at,
    ]

    # Configuración de paginación
    page_size = 25
    page_size_options = [25, 50, 100]

    # Título personalizado
    name = "Categoría"
    name_plural = "Categorías"
    icon = "fa-solid fa-tags"

    # Personalizar etiquetas de columnas
    column_labels = {
        CategoryModel.category_id: "ID de Categoría",
        CategoryModel.category_name: "Nombre de Categoría",
        CategoryModel.category_img: "Imagen de Categoría",
        CategoryModel.category_description: "Descripción",
        CategoryModel.games: "Juegos",
        CategoryModel.created_at: "Fecha de Creación",
        CategoryModel.updated_at: "Última Actualización",
    }

    # Formatear columnas
    column_formatters = {
        CategoryModel.created_at: lambda m, a: m.created_at.strftime("%d/%m/%Y %H:%M"),
        CategoryModel.updated_at: lambda m, a: m.updated_at.strftime("%d/%m/%Y %H:%M"),
        CategoryModel.category_description: lambda m, a: (m.category_description[:50] + "...") if m.category_description and len(m.category_description) > 50 else m.category_description,
        CategoryModel.games: lambda m, a: ", ".join([game.game_name for game in m.games]) if m.games else "Sin juegos",
    }

    # Configuración de exportación
    can_export = True
    export_max_rows = 1000
    export_types = ["csv", "xlsx"]
