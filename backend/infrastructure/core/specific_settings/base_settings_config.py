import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

ENV = os.getenv("ENVIRONMENT", "dev")


class BaseSettingsConfig(BaseSettings):
    @classmethod
    def load_from_env(cls, prefix: str):
        print(f"Loading environment variables for prefix: {prefix} with ENV '{ENV}'")
        env_file_with_env = Path(f"./infrastructure/core/envs/.{prefix}.{ENV}.env")
        env_file_generic = Path(f"./infrastructure/core/envs/.{prefix}.env")

        if env_file_with_env.exists():
            load_dotenv(dotenv_path=env_file_with_env, override=True)
        elif env_file_generic.exists():
            load_dotenv(dotenv_path=env_file_generic, override=True)
        else:
            raise FileNotFoundError(f"No .env file found for {prefix} with ENV '{ENV}'")

        return cls()

    class Config:
        env_file_encoding = "utf-8"
