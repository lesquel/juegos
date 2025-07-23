"""Conversor DTO para entidad Game."""

from application.mixins import LoggingMixin
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.entities.app_info import AppInfoEntity
from dtos.response.app_info_response import AccountResponseDTO, AppInfoResponseDTO


class AppInfoEntityToDTOConverter(
    EntityToDTOConverter[AppInfoEntity, AppInfoResponseDTO], LoggingMixin
):
    """Convierte AppInfoEntity a AppInfoResponseDTO."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: AppInfoEntity) -> AppInfoResponseDTO:
        """Convierte AppInfoEntity a AppInfoResponseDTO."""
        self.logger.debug("Converting appInfoEntity to AppInfoResponseDTO")
        accounts = (
            [
                AccountResponseDTO(
                    account_id=str(account.account_id),
                    account_owner_name=account.account_owner_name,
                    account_number=account.account_number,
                    account_type=account.account_type,
                    account_description=account.account_description,
                )
                for account in entity.accounts
            ]
            if entity.accounts
            else None
        )

        dto = AppInfoResponseDTO(
            site_name=entity.site_name,
            site_icon=entity.site_icon,
            site_logo=entity.site_logo,
            accounts=accounts,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

        self.logger.debug("Successfully converted AppInfoEntity to AppInfoResponseDTO")
        return dto
