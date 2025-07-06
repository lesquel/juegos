from typing import Any
from pydantic import ValidationInfo

class GameDTOValidators:
    """Validadores reutilizables para DTOs de juegos"""

    @staticmethod
    def validate_game_rating(rating: float) -> float:
        if rating < 1 or rating > 5:
            raise ValueError("Game rating must be between 1 and 5")
        return rating


    @staticmethod
    def at_least_one_field(values: dict[str, Any], field: str) -> Any:
        """
        Valida que al menos uno de los campos tenga un valor

        Args:
            values: Diccionario de valores del DTO
            field: Nombre del campo actual

        Returns:
            Any: Valor del campo validado

        Raises:
            ValueError: Si ninguno de los campos tiene un valor
        """
        if not any(values.values()):
            raise ValueError(f"At least one field must be provided for {field}")

        return values.get(field)


def game_rating_validator(v: float) -> float:
    """Field validator para calificaciones de juegos"""
    return GameDTOValidators.validate_game_rating(v)

def at_least_one_field_validator(v: Any, values: dict[str, Any], field: str) -> Any:
    """Field validator para asegurar al menos un campo con valor"""
    return GameDTOValidators.at_least_one_field(values, field) if v is None else v