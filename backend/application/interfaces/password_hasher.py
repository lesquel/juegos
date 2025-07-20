from abc import ABC, abstractmethod


class IPasswordHasher(ABC):
    """Interface para servicios de hashing de contraseñas"""

    @abstractmethod
    def hash(self, password: str) -> str:
        """Genera un hash de la contraseña"""

    @abstractmethod
    def verify(self, plain_password: str, hashed_password: str) -> bool:
        """Verifica si la contraseña coincide con el hash"""
