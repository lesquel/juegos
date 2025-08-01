from app_setup.admin.mixins import ImageUploadAdminMixin
from infrastructure.db.models import GameModel
from markupsafe import Markup
from sqladmin import ModelView


class GameAdmin(ImageUploadAdminMixin, ModelView, model=GameModel):
    """Panel de administración para juegos"""

    # Configuración de categoría/módulo
    name = "Juego"
    name_plural = "Juegos"
    icon = "fa-solid fa-gamepad"

    # Propiedades requeridas por ImageUploadMixin
    @property
    def image_field_name(self) -> str:
        return "game_img"

    @property
    def image_subfolder(self) -> str:
        return "games"

    @property
    def primary_key_field(self):
        return GameModel.game_id

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Configurar manejo de imágenes después de la inicialización
        self.setup_image_handling()

    # Configuración de columnas
    column_list = [
        GameModel.game_id,
        GameModel.game_name,
        GameModel.game_description,
        GameModel.game_url,
        GameModel.game_img,
        GameModel.categories,
        GameModel.game_capacity,
        GameModel.game_type,
        GameModel.created_at,
        GameModel.updated_at,
    ]

    # Columnas a mostrar en detalle
    column_details_list = column_list
    # Columnas editables
    form_columns = [
        GameModel.game_name,
        GameModel.game_description,
        GameModel.game_url,
        GameModel.game_img,
        GameModel.categories,
        GameModel.game_type,
        GameModel.game_capacity,
        GameModel.house_odds,
    ]

    # Columnas para búsqueda
    column_searchable_list = [GameModel.game_name, GameModel.game_description]

    # Columnas para filtrado
    column_filters = [
        GameModel.game_name,
        GameModel.created_at,
        GameModel.updated_at,
    ]

    # Configuración de ordenamiento
    column_sortable_list = [
        GameModel.game_name,
        GameModel.created_at,
        GameModel.updated_at,
    ]

    # Configuración de paginación
    page_size = 25
    page_size_options = [25, 50, 100]

    # Personalizar etiquetas de columnas
    column_labels = {
        GameModel.game_id: "ID del Juego",
        GameModel.game_name: "Nombre del Juego",
        GameModel.game_description: "Descripción",
        GameModel.game_url: "URL del Juego",
        GameModel.game_img: "Imagen del Juego",
        GameModel.categories: "Categorías",
        GameModel.created_at: "Fecha de Creación",
        GameModel.updated_at: "Última Actualización",
    }

    # Formatear columnas
    column_formatters = {
        GameModel.created_at: lambda m, a: m.created_at.strftime("%d/%m/%Y %H:%M"),
        GameModel.updated_at: lambda m, a: m.updated_at.strftime("%d/%m/%Y %H:%M"),
        GameModel.game_description: lambda m, a: (
            (m.game_description[:50] + "...")
            if len(m.game_description) > 50
            else m.game_description
        ),
        GameModel.game_url: lambda m, a: Markup(
            f"<a href='{m.game_url}' target='_blank'>{m.game_url[:30]}...</a>"
            if len(m.game_url) > 30
            else f"<a href='{m.game_url}' target='_blank'>{m.game_url}</a>"
        ),
        GameModel.categories: lambda m, a: (
            ", ".join([cat.category_name for cat in m.categories])
            if m.categories
            else "Sin categorías"
        ),
    }

    # Configuración de exportación
    can_export = True
    export_max_rows = 1000
    export_types = ["csv", "xlsx"]
