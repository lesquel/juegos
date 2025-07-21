"""Entidad de dominio para usuarios."""

from typing import Optional

from domain.enums import UserRole

from ..time_stamp_entity_mixin import TimeStampEntityMixin


class UserEntity(TimeStampEntityMixin):
    """Entidad de dominio para usuarios."""

    def __init__(
        self,
        user_id: Optional[str],
        email: str,
        hashed_password: str,
        virtual_currency: float = 0.0,
        role: UserRole = UserRole.USER,
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ):
        super().__init__(created_at, updated_at)

        self.user_id = user_id
        self.email = email
        self.hashed_password = hashed_password
        self.virtual_currency = virtual_currency
        self.role = role

    def __repr__(self):
        return f"UserEntity(user_id={self.user_id}, email={self.email})"
