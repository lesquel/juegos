"""
Validadores customizados para la aplicación
"""

import re
from typing import Any
from pydantic import ValidationInfo


class CustomValidators:
    """Validadores reutilizables para diferentes campos"""

    @staticmethod
    def validate_password(password: str) -> str:
        """
        Valida que la contraseña cumpla con los requisitos mínimos

        Args:
            password: Contraseña a validar

        Returns:
            str: Contraseña validada

        Raises:
            ValueError: Si la contraseña no cumple los requisitos
        """
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")

        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain at least one uppercase letter")

        if not re.search(r"[a-z]", password):
            raise ValueError("Password must contain at least one lowercase letter")

        if not re.search(r"\d", password):
            raise ValueError("Password must contain at least one digit")

        return password

    @staticmethod
    def validate_username(username: str) -> str:
        """
        Valida el formato del nombre de usuario

        Args:
            username: Nombre de usuario a validar

        Returns:
            str: Username validado

        Raises:
            ValueError: Si el username no es válido
        """
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters long")

        if len(username) > 50:
            raise ValueError("Username must be less than 50 characters")

        if not re.match(r"^[a-zA-Z0-9_-]+$", username):
            raise ValueError(
                "Username can only contain letters, numbers, underscores and hyphens"
            )

        return username.lower()



def password_validator(cls: Any, v: str, info: ValidationInfo) -> str:
    """Field validator para contraseñas"""
    return CustomValidators.validate_password(v)


def username_validator(cls: Any, v: str, info: ValidationInfo) -> str:
    """Field validator para usernames"""
    return CustomValidators.validate_username(v)


