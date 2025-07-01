from typing import Optional
from application.enums import TransferStateEnum

from .time_stamp_entity_mixin import TimeStampEntityMixin


class TransferPayment(TimeStampEntityMixin):
    def __init__(
        self,
        transfer_id: Optional[str],
        user_id: str,
        transfer_img: str,
        transfer_amount: float,
        transfer_state: TransferStateEnum,
        transfer_description: Optional[str] = None,
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ):
        super().__init__(created_at, updated_at)

        self.transfer_id = transfer_id
        self.user_id = user_id
        self.transfer_img = transfer_img
        self.transfer_amount = transfer_amount
        self.transfer_state = transfer_state
        self.transfer_description = transfer_description

    def __repr__(self):
        return f"TransferPayment(transfer_id={self.transfer_id}, user_id={self.user_id}, transfer_amount={self.transfer_amount}, transfer_state='{self.transfer_state}')"
