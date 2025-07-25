from infrastructure.db.models import MatchParticipationModel
from sqladmin import ModelView


class MatchParticipationAdmin(ModelView, model=MatchParticipationModel):
    """Panel de administración para participaciones en partidas"""

    # Configuración de categoría/módulo
    name = "Participación"
    name_plural = "Participaciones"
    icon = "fa-solid fa-users-gear"

    # Configuración de columnas
    column_list = [
        MatchParticipationModel.id,
        MatchParticipationModel.match_id,
        MatchParticipationModel.user,
        MatchParticipationModel.score,
        MatchParticipationModel.created_at,
        MatchParticipationModel.updated_at,
    ]

    # Columnas a mostrar en detalle
    column_details_list = [
        MatchParticipationModel.id,
        MatchParticipationModel.match_id,
        MatchParticipationModel.user,
        MatchParticipationModel.score,
        MatchParticipationModel.created_at,
        MatchParticipationModel.updated_at,
    ]

    # Columnas editables
    form_columns = [
        MatchParticipationModel.match_id,
        MatchParticipationModel.user,
        MatchParticipationModel.score,
    ]

    # Columnas para filtrado
    column_filters = [
        MatchParticipationModel.match_id,
        MatchParticipationModel.user,
        MatchParticipationModel.score,
        MatchParticipationModel.created_at,
        MatchParticipationModel.updated_at,
    ]

    # Configuración de ordenamiento
    column_sortable_list = [
        MatchParticipationModel.score,
        MatchParticipationModel.created_at,
        MatchParticipationModel.updated_at,
    ]

    # Configuración de paginación
    page_size = 25
    page_size_options = [25, 50, 100]

    # Personalizar etiquetas de columnas
    column_labels = {
        MatchParticipationModel.id: "ID",
        MatchParticipationModel.match_id: "ID de Partida",
        MatchParticipationModel.user: "Usuario",
        MatchParticipationModel.score: "Puntuación",
        MatchParticipationModel.created_at: "Fecha de Creación",
        MatchParticipationModel.updated_at: "Última Actualización",
    }

    # Formatear columnas
    column_formatters = {
        MatchParticipationModel.created_at: lambda m, a: m.created_at.strftime(
            "%d/%m/%Y %H:%M"
        ),
        MatchParticipationModel.updated_at: lambda m, a: m.updated_at.strftime(
            "%d/%m/%Y %H:%M"
        ),
    }

    # Configuración de exportación
    can_export = True
    export_max_rows = 1000
    export_types = ["csv", "xlsx"]
