from typing import Optional


class UserEntity:
    def __init__(
        self,
        user_id: Optional[str],
        username: str,
        email: str,
        hashed_password: str,
        virtual_currency: float = 0.0,
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ):

        self.user_id = user_id
        self.username = username
        self.email = email
        self.hashed_password = hashed_password
        self.virtual_currency = virtual_currency
        self.created_at = created_at
        self.updated_at = updated_at
        

    def __repr__(self):
        return f"User(user_id={self.user_id}, username='{self.username}', email='{self.email}')"
