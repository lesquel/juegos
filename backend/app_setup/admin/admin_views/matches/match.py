from infrastructure.db.models import MatchModel
from sqladmin import ModelView


class MatchAdmin(ModelView, model=MatchModel):
    """Panel de administración para partidas"""

    # Configuración de categoría/módulo
    name = "Partida"
    name_plural = "Partidas"
    icon = "fa-solid fa-trophy"

    # Configuración de columnas
    column_list = [
        MatchModel.match_id,
        MatchModel.game,
        MatchModel.winner,
        MatchModel.creator,
        MatchModel.participants,
        MatchModel.is_finished,
        MatchModel.base_bet_amount,
        MatchModel.created_at,
        MatchModel.updated_at,
    ]

    # Columnas a mostrar en detalle
    column_details_list = column_list

    # Columnas editables
    form_columns = [
        MatchModel.game,
        MatchModel.winner,
        MatchModel.base_bet_amount,
        MatchModel.is_finished,
    ]

    # Columnas para filtrado
    column_filters = [
        MatchModel.game,
        MatchModel.winner,
        MatchModel.creator,
        MatchModel.is_finished,
        MatchModel.created_at,
        MatchModel.updated_at,
    ]

    # Configuración de ordenamiento
    column_sortable_list = [
        MatchModel.base_bet_amount,
        MatchModel.created_at,
        MatchModel.updated_at,
    ]

    # Configuración de paginación
    page_size = 25
    page_size_options = [25, 50, 100]

    # Personalizar etiquetas de columnas
    column_labels = {
        MatchModel.match_id: "ID de Partida",
        MatchModel.game: "Juego",
        MatchModel.winner: "Ganador",
        MatchModel.creator: "Creador",
        MatchModel.participants: "Participantes",
        MatchModel.created_at: "Fecha de Creación",
        MatchModel.updated_at: "Última Actualización",
    }

    # Formatear columnas
    column_formatters = {
        MatchModel.winner: lambda m, a: m.winner.email if m.winner else "N/A",
        MatchModel.creator: lambda m, a: m.creator.email if m.creator else "N/A",
        MatchModel.game: lambda m, a: m.game.game_name if m.game else "N/A",
        MatchModel.participants: lambda m, a: (
            [p.user for p in m.participants] if m.participants else []
        ),
        MatchModel.created_at: lambda m, a: m.created_at.strftime("%d/%m/%Y %H:%M"),
        MatchModel.updated_at: lambda m, a: m.updated_at.strftime("%d/%m/%Y %H:%M"),
    }

    # Configuración de exportación
    can_export = True
    export_max_rows = 1000
    export_types = ["csv", "xlsx"]
