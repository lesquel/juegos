from .specific_settings import (
    AppSettings,
    DatabaseSettings,
    JWTSettings,
    StorageSettings,
)


class Settings:
    def __init__(self):
        self.app_settings = AppSettings.load_from_env("app")
        self.database_settings = DatabaseSettings.load_from_env("db")
        self.jwt_settings = JWTSettings.load_from_env("jwt")
        self.storage_settings = StorageSettings.load_from_env("storage")


settings = Settings()
