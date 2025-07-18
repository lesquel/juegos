from typing import Any

from domain.exceptions.match import MatchScoreError


class MatchDTOValidators:
    """Validadores reutilizables para DTOs de partidas"""

    @staticmethod
    def validate_bet_amount(value: Any) -> float:
        """Valida el monto apostado, debe ser mayor o igual a 0 y redondeado a 2 decimales."""
        if value is not None and value < 0:
            raise ValueError("El monto apostado no puede ser negativo")
        if value is not None:
            return round(value, 2)
        return value

    @staticmethod
    def validate_user_score(value: Any) -> float:
        """Valida que la puntuación del usuario sea un número de punto flotante no negativo."""
        if value is not None and (not isinstance(value, float) or value < 0):
            raise MatchScoreError(
                "La puntuación del usuario debe ser un número de punto flotante no negativo"
            )
        return value


# Funciones compatibles con field_validator de Pydantic v2
def validate_bet_amount_validator(v: Any) -> float:
    """Field validator para el monto apostado."""
    return MatchDTOValidators.validate_bet_amount(v)


def validate_user_score_validator(v: Any) -> int:
    """Field validator para la puntuación del usuario."""
    return MatchDTOValidators.validate_user_score(v)
