from typing import List, Optional
from .time_stamp_entity_mixin import TimeStampEntityMixin


class AccountEntity(TimeStampEntityMixin):
    def __init__(
        self,
        account_id: str,
        account_name: str,
        account_number: str,
        account_description: str,
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ):
        super().__init__(created_at, updated_at)

        self.account_id = account_id
        self.account_owner_name = account_name
        self.account_number = account_number
        self.account_description = account_description

class AppInfoEntity(TimeStampEntityMixin):
    def __init__(
        self,
        site_name: str,
        site_icon: str,
        site_logo: str,
        accounts: List[AccountEntity],

        created_at: Optional[str] = None,
        updated_at: Optional[str] = None):
        super().__init__(created_at, updated_at)
        self.site_name = site_name
        self.site_icon = site_icon
        self.site_logo = site_logo
        self.accounts = accounts
