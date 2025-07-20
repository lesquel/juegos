import re


class AuthDTOValidators:
    """Validadores reutilizables para DTOs"""

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


def password_validator(v: str) -> str:
    """Field validator para contraseñas"""
    return AuthDTOValidators.validate_password(v)
