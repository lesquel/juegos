"""
Configuración de logging para la aplicación
"""

import logging
import logging.config
from typing import Dict, Any
import sys
from pathlib import Path

from infrastructure.core.settings_config import settings


class LoggingConfig:
    """Configuración centralizada de logging"""

    @staticmethod
    def get_logging_config() -> Dict[str, Any]:
        """Retorna la configuración de logging basada en el ambiente"""

        app_settings = settings.app_settings

        # Crear directorio de logs si no existe
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)

        config = {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "detailed": {
                    "format": "[{asctime}] {levelname} {name} - {message}",
                    "style": "{",
                    "datefmt": "%Y-%m-%d %H:%M:%S",
                },
                "simple": {"format": "{levelname} - {message}", "style": "{"},
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "level": "INFO" if app_settings.environment == "prod" else "DEBUG",
                    "formatter": "simple",
                    "stream": sys.stdout,
                },
                "file": {
                    "class": "logging.handlers.RotatingFileHandler",
                    "level": "INFO",
                    "formatter": "detailed",
                    "filename": f"logs/{app_settings.environment}.log",
                    "maxBytes": 10485760,  # 10MB
                    "backupCount": 5,
                },
                "error_file": {
                    "class": "logging.handlers.RotatingFileHandler",
                    "level": "ERROR",
                    "formatter": "detailed",
                    "filename": f"logs/{app_settings.environment}_errors.log",
                    "maxBytes": 10485760,  # 10MB
                    "backupCount": 5,
                },
            },
            "loggers": {
                # Logger de la aplicación
                "app": {
                    "level": "DEBUG" if app_settings.debug else "INFO",
                    "handlers": ["console", "file", "error_file"],
                    "propagate": False,
                },
                # Logger de SQLAlchemy
                "sqlalchemy.engine": {
                    "level": "INFO" if app_settings.debug else "WARNING",
                    "handlers": ["file"],
                    "propagate": False,
                },
                # Logger de uvicorn
                "uvicorn": {
                    "level": "INFO",
                    "handlers": ["console"],
                    "propagate": False,
                },
                # Logger de FastAPI
                "fastapi": {
                    "level": "INFO",
                    "handlers": ["console", "file"],
                    "propagate": False,
                },
            },
            "root": {"level": "INFO", "handlers": ["console"]},
        }

        return config

    @staticmethod
    def setup_logging():
        """Configura el sistema de logging"""
        config = LoggingConfig.get_logging_config()
        logging.config.dictConfig(config)

        # Crear logger principal de la aplicación
        logger = logging.getLogger("app")
        logger.info("Logging system configured successfully")

        return logger


# Instancia global del logger
def get_logger(name: str = "app") -> logging.Logger:
    """Obtiene un logger configurado"""
    return logging.getLogger(name)


# Configurar logging al importar el módulo
app_logger = LoggingConfig.setup_logging()
