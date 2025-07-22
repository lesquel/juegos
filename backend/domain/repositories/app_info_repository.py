from abc import abstractmethod
from typing import Optional

from domain.entities.app_info import AppInfoEntity


class IAppInfoRepository:
    """Repositorio específico para la informacion de la aplicación."""

    @abstractmethod
    async def get_app_info(self) -> Optional[AppInfoEntity]: ...
