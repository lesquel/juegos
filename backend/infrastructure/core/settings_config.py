from .specific_settings import AppSettings, JWTSettings, DatabaseSettings


class Settings:
    def __init__(self):
        self.app_settings = AppSettings.load_from_env("app")
        self.database_settings = DatabaseSettings.load_from_env("db")
        self.jwt_settings = JWTSettings.load_from_env("jwt")


settings = Settings()