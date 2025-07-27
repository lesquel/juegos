import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

ENV = os.getenv("ENVIRONMENT", "dev")


class BaseSettingsConfig(BaseSettings):
    @classmethod
    def load_from_env(cls, prefix: str):
        env_file_with_env = Path(f"./infrastructure/core/envs/.{prefix}.{ENV}.env")
        env_file_generic = Path(f"./infrastructure/core/envs/.{prefix}.env")

        if ENV == "prod":
            return cls()
        elif env_file_with_env.exists():
            load_dotenv(dotenv_path=env_file_with_env, override=True)
        elif env_file_generic.exists():
            load_dotenv(dotenv_path=env_file_generic, override=True)
        else:
            raise FileNotFoundError(f"No .env file found for {prefix} with ENV '{ENV}'")

        return cls()
