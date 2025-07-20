from infrastructure.db.models import GameReviewModel
from sqladmin import ModelView


class GameReviewAdmin(ModelView):
    """Panel de administración para reseñas de juegos"""

    model = GameReviewModel

    # Configuración de categoría/módulo
    name = "Reseña"
    name_plural = "Reseñas de Juegos"
    icon = "fa-solid fa-star"

    # Configuración de columnas
    column_list = [
        GameReviewModel.review_id,
        GameReviewModel.game,
        GameReviewModel.user,
        GameReviewModel.rating,
        GameReviewModel.comment,
        GameReviewModel.created_at,
        GameReviewModel.updated_at,
    ]

    # Columnas a mostrar en detalle
    column_details_list = column_list

    # Columnas editables
    form_columns = [
        GameReviewModel.game,
        GameReviewModel.user,
        GameReviewModel.rating,
        GameReviewModel.comment,
    ]

    # Columnas para búsqueda
    column_searchable_list = [GameReviewModel.comment]

    # Columnas para filtrado
    column_filters = [
        GameReviewModel.rating,
        GameReviewModel.game,
        GameReviewModel.user,
        GameReviewModel.created_at,
        GameReviewModel.updated_at,
    ]

    # Configuración de ordenamiento
    column_sortable_list = [
        GameReviewModel.rating,
        GameReviewModel.created_at,
        GameReviewModel.updated_at,
    ]

    # Configuración de paginación
    page_size = 25
    page_size_options = [25, 50, 100]

    # Personalizar etiquetas de columnas
    column_labels = {
        GameReviewModel.review_id: "ID de Reseña",
        GameReviewModel.game: "Juego",
        GameReviewModel.user: "Usuario",
        GameReviewModel.rating: "Calificación",
        GameReviewModel.comment: "Comentario",
        GameReviewModel.created_at: "Fecha de Creación",
        GameReviewModel.updated_at: "Última Actualización",
    }

    # Formatear columnas
    column_formatters = {
        GameReviewModel.game: lambda m, a: m.game.game_name if m.game else "N/A",
        GameReviewModel.user: lambda m, a: m.user.email if m.user else "N/A",
        GameReviewModel.created_at: lambda m, a: m.created_at.strftime(
            "%d/%m/%Y %H:%M"
        ),
        GameReviewModel.updated_at: lambda m, a: m.updated_at.strftime(
            "%d/%m/%Y %H:%M"
        ),
        GameReviewModel.comment: lambda m, a: (m.comment[:50] + "...")
        if m.comment and len(m.comment) > 50
        else m.comment,
        GameReviewModel.rating: lambda m, a: f"{'⭐' * m.rating} ({m.rating}/5)",
    }

    # Configuración de exportación
    can_export = True
    export_max_rows = 1000
    export_types = ["csv", "xlsx"]
