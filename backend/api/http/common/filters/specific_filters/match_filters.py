from typing import Optional

from infrastructure.db.models.match.match_participation_model import (
    MatchParticipationModel,
)
from infrastructure.db.models.user.user_model import UserModel
from pydantic import Field

from ..base_filter import BaseFilterParams
from ..filter_dependency_factory import build_filter_dependency


class MatchFilterParams(BaseFilterParams):
    """Filtros específicos para Partidas - hereda filtros base + específicos"""

    winner_id: Optional[str] = Field(
        None,
        description="ID del usuario ganador de la partida",
    )

    participant_id: Optional[str] = Field(
        None,
        description="ID del usuario participante de la partida",
    )

    user_email: Optional[str] = Field(
        None,
        description="Email del usuario participante de la partida",
    )

    has_winner: Optional[bool] = Field(
        None,
        description="Indica si la partida tiene un ganador",
    )

    min_base_bet_amount: Optional[float] = Field(
        None, ge=0, description="Apuesta base mínima"
    )
    max_base_bet_amount: Optional[float] = Field(
        None, ge=0, description="Apuesta base máxima"
    )

    def filter_winner_id(self, query, model, value):
        return self.any_filter(query, model.winner_id, "winner_id", value)

    def filter_participant_id(self, query, model, value):
        if value:
            return query.filter(
                model.participants.any(MatchParticipationModel.user_id == value)
            )
        return query

    def filter_is_finished(self, query, model, value: bool):
        if value is not None:
            return query.filter(model.is_finished == value)
        return query

    def filter_user_email(self, query, model, value):
        if value:
            return query.filter(
                model.participants.any(
                    MatchParticipationModel.user.has(
                        UserModel.email.ilike(f"%{value}%")
                    )
                )
            )
        return query

    def filter_min_base_bet_amount(self, query, model, value):
        return self.gte_filter(query, model.base_bet_amount, value)

    def filter_max_base_bet_amount(self, query, model, value):
        return self.lte_filter(query, model.base_bet_amount, value)


# Dependencies específicos para cada modelo
get_match_filter_params = build_filter_dependency(
    MatchFilterParams,
)
