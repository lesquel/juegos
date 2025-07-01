"""
Vista de administración para Participaciones en Partidas
"""

from sqladmin import ModelView
from infrastructure.db.models.match_participation_model import MatchParticipationModel


class MatchParticipationAdmin(ModelView, model=MatchParticipationModel):
    """Panel de administración para participaciones en partidas"""

    # Configuración de columnas
    column_list = [
        MatchParticipationModel.id,
        MatchParticipationModel.match_id,
        MatchParticipationModel.user_id,
        MatchParticipationModel.score,
        MatchParticipationModel.bet_amount,
        MatchParticipationModel.created_at,
        MatchParticipationModel.updated_at,
    ]

    # Columnas a mostrar en detalle
    column_details_list = [
        MatchParticipationModel.id,
        MatchParticipationModel.match_id,
        MatchParticipationModel.user_id,
        MatchParticipationModel.score,
        MatchParticipationModel.bet_amount,
        MatchParticipationModel.created_at,
        MatchParticipationModel.updated_at,
    ]

    # Columnas editables
    form_columns = [
        MatchParticipationModel.match_id,
        MatchParticipationModel.user_id,
        MatchParticipationModel.score,
        MatchParticipationModel.bet_amount,
    ]

    # Columnas para filtrado
    column_filters = [
        MatchParticipationModel.match_id,
        MatchParticipationModel.user_id,
        MatchParticipationModel.score,
        MatchParticipationModel.bet_amount,
        MatchParticipationModel.created_at,
        MatchParticipationModel.updated_at,
    ]

    # Configuración de ordenamiento
    column_sortable_list = [
        MatchParticipationModel.score,
        MatchParticipationModel.bet_amount,
        MatchParticipationModel.created_at,
        MatchParticipationModel.updated_at,
    ]

    # Configuración de paginación
    page_size = 25
    page_size_options = [25, 50, 100]

    # Título personalizado
    name = "Participación en Partida"
    name_plural = "Participaciones en Partidas"
    icon = "fa-solid fa-users-gear"

    # Personalizar etiquetas de columnas
    column_labels = {
        MatchParticipationModel.id: "ID",
        MatchParticipationModel.match_id: "ID de Partida",
        MatchParticipationModel.user_id: "ID del Usuario",
        MatchParticipationModel.score: "Puntuación",
        MatchParticipationModel.bet_amount: "Cantidad Apostada",
        MatchParticipationModel.created_at: "Fecha de Creación",
        MatchParticipationModel.updated_at: "Última Actualización",
    }

    # Formatear columnas
    column_formatters = {
        MatchParticipationModel.bet_amount: lambda m, a: f"${m.bet_amount:.2f}",
        MatchParticipationModel.created_at: lambda m, a: m.created_at.strftime("%d/%m/%Y %H:%M"),
        MatchParticipationModel.updated_at: lambda m, a: m.updated_at.strftime("%d/%m/%Y %H:%M"),
    }

    # Configuración de exportación
    can_export = True
    export_max_rows = 1000
    export_types = ["csv", "xlsx"]
