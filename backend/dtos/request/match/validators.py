from typing import Any

from domain.exceptions.match import MatchScoreError, MatchValidationError


class MatchDTOValidators:
    """Validadores reutilizables para DTOs de partidas"""

    @staticmethod
    def validate_bet_amount(value: Any) -> float:
        """
        Valida el monto apostado.
        - Debe ser mayor a 0 (no se permiten apuestas de 0 o negativas)
        - Se redondea a 2 decimales para evitar problemas de precisión
        """
        if value is None:
            return 0.0

        try:
            # Convertir a float para normalizar
            float_value = float(value)

            if float_value <= 0:
                raise MatchValidationError("El monto apostado debe ser mayor a 0")

            # Verificar que no sea un número demasiado grande
            if float_value > 1000000:  # 1 millón como límite razonable
                raise MatchValidationError("El monto apostado es demasiado grande")

            return round(float_value, 2)

        except (ValueError, TypeError) as e:
            raise MatchValidationError(f"Monto apostado inválido: {str(e)}")

    @staticmethod
    def validate_user_score(value: Any) -> float:
        """
        Valida que la puntuación del usuario sea válida.
        - Debe ser un número no negativo
        - Se permite punto flotante para mayor flexibilidad
        """
        if value is None:
            return 0.0

        try:
            # Convertir a float
            float_value = float(value)

            if float_value < 0:
                raise MatchScoreError("La puntuación no puede ser negativa")

            # Verificar que no sea un número demasiado grande
            if float_value > 1000000:  # Límite razonable
                raise MatchScoreError("La puntuación es demasiado grande")

            return float_value

        except (ValueError, TypeError) as e:
            raise MatchScoreError(f"Puntuación inválida: {str(e)}")


# Funciones compatibles con field_validator de Pydantic v2
def validate_bet_amount_validator(v: Any) -> float:
    """Field validator para el monto apostado."""
    return MatchDTOValidators.validate_bet_amount(v)


def validate_user_score_validator(v: Any) -> float:  # Corregido: retorna float, no int
    """Field validator para la puntuación del usuario."""
    return MatchDTOValidators.validate_user_score(v)
