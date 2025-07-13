from abc import ABC, abstractmethod
from typing import TypeVar, Generic, Any

# Type variables para hacer la interfaz genérica
OutputType = TypeVar('OutputType')


class BaseAssembler(ABC, Generic[OutputType]):
    """
    Interfaz base para ensambladores que combinan múltiples entidades/datos
    en un objeto de respuesta completo.
    """

    @abstractmethod
    def assemble(self, *args, **kwargs) -> OutputType:
        """
        Ensambla uno o más objetos de entrada en un objeto de salida.

        Args:
            *args: Argumentos posicionales variables (objetos de entrada)
            **kwargs: Argumentos de palabra clave variables

        Returns:
            OutputType: Objeto ensamblado

        Raises:
            Exception: Si ocurre un error durante el ensamblaje
        """
        pass
