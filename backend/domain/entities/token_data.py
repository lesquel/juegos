"""
Entidad del dominio para datos de token
"""

from dataclasses import dataclass


@dataclass
class TokenData:
    """Entidad que representa los datos internos del token"""

    sub: str  # Subject (identificador del usuario)
    
    def __post_init__(self):
        """Validaciones de la entidad"""
        if not self.sub or not isinstance(self.sub, str):
            raise ValueError("El campo 'sub' es requerido y debe ser una cadena")
