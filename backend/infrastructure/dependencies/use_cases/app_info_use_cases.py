from application.mixins.dto_converter_mixin import EntityToDTOConverter
from application.use_cases.get_app_info_use_case import GetAppInfoUseCase
from domain.repositories.app_info_repository import IAppInfoRepository
from fastapi import Depends

from ..converters import get_app_info_converter
from ..repositories import get_app_info_repository


def get_app_info_use_case(
    app_info_repo: IAppInfoRepository = Depends(get_app_info_repository),
    app_info_converter: EntityToDTOConverter = Depends(get_app_info_converter),
) -> GetAppInfoUseCase:
    return GetAppInfoUseCase(
        app_info_repo=app_info_repo, app_info_converter=app_info_converter
    )
