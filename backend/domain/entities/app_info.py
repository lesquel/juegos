from typing import List, Optional
from .time_stamp_entity_mixin import TimeStampEntityMixin


class AccountEntity(TimeStampEntityMixin):
    def __init__(
        self,
        account_id: str,
        account_owner_name: str,
        account_number: str,
        account_description: str,
        account_type: str,
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ):
        super().__init__(created_at, updated_at)

        self.account_id = account_id
        self.account_owner_name = account_owner_name
        self.account_number = account_number
        self.account_description = account_description
        self.account_type = account_type


class AppInfoEntity(TimeStampEntityMixin):
    def __init__(
        self,
        app_info_id: str,
        site_name: str,
        site_icon: str,
        site_logo: str,
        accounts: List[AccountEntity],
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ):
        super().__init__(created_at, updated_at)
        self.app_info_id = app_info_id
        self.site_name = site_name
        self.site_icon = site_icon
        self.site_logo = site_logo
        self.accounts = accounts
