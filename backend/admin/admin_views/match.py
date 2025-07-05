from sqladmin import ModelView
from infrastructure.db.models.match_model import MatchModel


class MatchAdmin(ModelView, model=MatchModel):
    """Panel de administración para partidas"""

    # Configuración de columnas
    column_list = [
        MatchModel.match_id,
        MatchModel.game_id,
        MatchModel.winner_id,
        MatchModel.start_time,
        MatchModel.end_time,
        MatchModel.created_at,
        MatchModel.updated_at,
    ]

    # Columnas a mostrar en detalle
    column_details_list = [
        MatchModel.match_id,
        MatchModel.game_id,
        MatchModel.winner_id,
        MatchModel.start_time,
        MatchModel.end_time,
        MatchModel.created_at,
        MatchModel.updated_at,
    ]

    # Columnas editables
    form_columns = [
        MatchModel.game_id,
        MatchModel.winner_id,
        MatchModel.start_time,
        MatchModel.end_time,
    ]

    # Columnas para filtrado
    column_filters = [
        MatchModel.game_id,
        MatchModel.winner_id,
        MatchModel.start_time,
        MatchModel.end_time,
        MatchModel.created_at,
        MatchModel.updated_at,
    ]

    # Configuración de ordenamiento
    column_sortable_list = [
        MatchModel.start_time,
        MatchModel.end_time,
        MatchModel.created_at,
        MatchModel.updated_at,
    ]

    # Configuración de paginación
    page_size = 25
    page_size_options = [25, 50, 100]

    # Título personalizado
    name = "Partida"
    name_plural = "Partidas"
    icon = "fa-solid fa-trophy"

    # Personalizar etiquetas de columnas
    column_labels = {
        MatchModel.match_id: "ID de Partida",
        MatchModel.game_id: "ID del Juego",
        MatchModel.winner_id: "ID del Ganador",
        MatchModel.start_time: "Hora de Inicio",
        MatchModel.end_time: "Hora de Fin",
        MatchModel.created_at: "Fecha de Creación",
        MatchModel.updated_at: "Última Actualización",
    }

    # Formatear columnas
    column_formatters = {
        MatchModel.start_time: lambda m, a: m.start_time.strftime("%d/%m/%Y %H:%M"),
        MatchModel.end_time: lambda m, a: m.end_time.strftime("%d/%m/%Y %H:%M"),
        MatchModel.created_at: lambda m, a: m.created_at.strftime("%d/%m/%Y %H:%M"),
        MatchModel.updated_at: lambda m, a: m.updated_at.strftime("%d/%m/%Y %H:%M"),
    }

    # Configuración de exportación
    can_export = True
    export_max_rows = 1000
    export_types = ["csv", "xlsx"]
