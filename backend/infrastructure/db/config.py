from infrastructure.core import settings


def get_postgres_url() -> str:
    """Get synchronous PostgreSQL URL for migrations and admin"""
    database_settings = settings.database_settings
    return (
        f"postgresql+psycopg2://{database_settings.postgres_user}:{database_settings.postgres_password}"
        f"@{database_settings.postgres_host}:{database_settings.postgres_port}/{database_settings.postgres_db}"
    )


def get_async_postgres_url() -> str:
    """Get asynchronous PostgreSQL URL for application"""
    database_settings = settings.database_settings
    return (
        f"postgresql+asyncpg://{database_settings.postgres_user}:{database_settings.postgres_password}"
        f"@{database_settings.postgres_host}:{database_settings.postgres_port}/{database_settings.postgres_db}"
    )
