from typing import Optional
from fastapi import Query
from pydantic import Field

from ..base_filter import BaseFilterParams
from ..filter_dependency_factory import build_filter_dependency


class MatchFilterParams(BaseFilterParams):
    """Filtros específicos para Partidas - hereda filtros base + específicos"""

    winner_id: Optional[str] = Field(
        None,
        description="ID del usuario ganador de la partida",
        example="123e4567-e89b-12d3-a456-426614174000",
    )
    min_base_bet_amount: Optional[float] = Field(
        None, ge=0, description="Apuesta base mínima"
    )
    max_base_bet_amount: Optional[float] = Field(
        None, ge=0, description="Apuesta base máxima"
    )
    
    def filter_winner_id(self, query, model, value):
        return self.any_filter(query, model.winner_id, "winner_id", value)

    
    def filter_min_base_bet_amount(self, query, model, value):
        return self.gte_filter(query, model.base_bet_amount, value)
    
    def filter_max_base_bet_amount(self, query, model, value):
        return self.lte_filter(query, model.base_bet_amount, value)
    

# Dependencies específicos para cada modelo
get_match_filter_params = build_filter_dependency(
    MatchFilterParams,
)
