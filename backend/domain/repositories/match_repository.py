from abc import abstractmethod
from typing import Optional

from domain.entities import MatchEntity
from interfaces.api.common.filters.specific_filters import MatchFilterParams
from .base_repository import IBaseRepository


class IMatchRepository(IBaseRepository[MatchEntity, MatchFilterParams]):
    """Repositorio específico para partidas"""

    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[MatchEntity]:
        """
        Retrieves a match by its email address.

        :param email: The email address of the match to retrieve.
        :return: The Match object corresponding to the given email.
        """
        pass
