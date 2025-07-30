from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.exceptions.app_info import AppInfoNotFound
from domain.repositories.app_info_repository import IAppInfoRepository

from .base_use_case import BaseUseCase


class GetAppInfoUseCase(BaseUseCase):
    def __init__(
        self,
        app_info_repo: IAppInfoRepository,
        app_info_converter: EntityToDTOConverter,
    ):
        self.app_info_repo = app_info_repo
        self.app_info_converter = app_info_converter

    async def execute(self):
        info = await self.app_info_repo.get_app_info()
        if not info:
            raise AppInfoNotFound(
                "App information not found",
            )

        return self.app_info_converter.to_dto(info)
