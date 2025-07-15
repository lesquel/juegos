from typing import Any
from datetime import datetime
from pydantic import ValidationInfo


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




# Funciones compatibles con field_validator de Pydantic v2
def validate_bet_amount_validator(v: Any) -> float:
    """Field validator para el monto apostado."""
    return MatchDTOValidators.validate_bet_amount(v)


def validate_end_after_start_validator(values: dict) -> str:
    """Field validator para validar que la hora de finalización sea posterior a la hora de inicio."""
    if values is not None:
        return MatchDTOValidators.validate_end_after_start(
            values.get("end_time"), values.get("start_time")
        )
    return v
