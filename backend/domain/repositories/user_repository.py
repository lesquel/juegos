from abc import abstractmethod
from typing import Optional

from domain.entities import UserEntity
from interfaces.api.common.filters.specific_filters import UserFilterParams
from .base_repository import IBaseRepository


class IUserRepository(IBaseRepository[UserEntity, UserFilterParams]):
    """Repositorio específico para usuarios"""

    
    @abstractmethod
    def get_by_email(self, email: str) -> Optional[UserEntity]:
        """
        Retrieves a user by their email address.

        :param email: The email address of the user to retrieve.
        :return: The User object corresponding to the given email.
        """
        pass
