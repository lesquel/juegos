from abc import abstractmethod
from typing import Optional

from domain.common import BaseFilterParams
from domain.entities import UserEntity

from .base_repository import IBaseRepository
from .common import ModelType


class IUserRepository(IBaseRepository[UserEntity, BaseFilterParams, ModelType]):
    """Repositorio específico para usuarios"""

    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[UserEntity]:
        """
        Retrieves a user by their email address.

        :param email: The email address of the user to retrieve.
        :return: The User object corresponding to the given email.
        """
