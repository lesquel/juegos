from typing import Optional


class TimeStampEntityMixin:
    def __init__(
        self,
        created_at: Optional[str],
        updated_at: Optional[str],
    ):
        self.created_at = created_at
        self.updated_at = updated_at
