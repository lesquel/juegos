import logging
import logging.config
import logging.handlers
from typing import Dict, Any
import sys
from pathlib import Path

from infrastructure.core.settings_config import settings


def get_relative_path(file_path: str) -> str:
    """Convierte una ruta absoluta a relativa al proyecto."""
    project_root = Path(__file__).resolve().parents[2]
    try:
        return str(Path(file_path).relative_to(project_root)).replace("\\", "/")
    except ValueError:
        return Path(file_path).name


class CustomFormatter(logging.Formatter):
    """Formatter personalizado que muestra rutas relativas."""

    def format(self, record):
        if hasattr(record, "pathname"):
            record.filename = get_relative_path(record.pathname)
        return super().format(record)


class LoggingConfig:
    """Configuración centralizada de logging."""

    @staticmethod
    def get_logging_config() -> Dict[str, Any]:
        app_settings = settings.app_settings
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)

        debug_mode = app_settings.debug
        env = app_settings.environment

        formatter_style = {
            "detailed": {
                "()": CustomFormatter,
                "format": "[{asctime}] {levelname} - {filename}:{lineno} in {funcName}() - {message}",
                "style": "{",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "console": {
                "()": CustomFormatter,
                "format": (
                    "{levelname} - {filename}:{lineno} - {message}"
                    if debug_mode
                    else "[{asctime}] {levelname} - {message}"
                ),
                "style": "{",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        }

        handlers = {
            "console": {
                "class": "logging.StreamHandler",
                "level": "DEBUG" if debug_mode else "INFO",
                "formatter": "console",
                "stream": sys.stdout,
            },
            "file_info": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "INFO",
                "formatter": "detailed",
                "filename": f"logs/{env}.log",
                "maxBytes": 10_485_760,  # 10 MB
                "backupCount": 5,
                "encoding": "utf-8",
            },
            "file_error": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "ERROR",
                "formatter": "detailed",
                "filename": f"logs/{env}_errors.log",
                "maxBytes": 10_485_760,
                "backupCount": 5,
                "encoding": "utf-8",
            },
        }

        return {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": formatter_style,
            "handlers": handlers,
            "loggers": {
                "app": {
                    "level": "DEBUG" if debug_mode else "INFO",
                    "handlers": ["console", "file_info", "file_error"],
                    "propagate": False,
                },
                "sqlalchemy.engine": {
                    "level": "INFO" if debug_mode else "WARNING",
                    "handlers": ["file_info"],
                    "propagate": False,
                },
                "uvicorn": {
                    "level": "INFO",
                    "handlers": ["console"],
                    "propagate": False,
                },
            },
            "root": {
                "level": "DEBUG" if debug_mode else "INFO",
                "handlers": ["console", "file_info", "file_error"],
            },
        }

    @staticmethod
    def setup_logging() -> logging.Logger:
        logging.config.dictConfig(LoggingConfig.get_logging_config())
        logger = logging.getLogger("app")
        logger.info("Logging configured successfully")
        return logger


def get_logger(name: str = None) -> logging.Logger:
    return logging.getLogger(name or "app")


# Configura logging automáticamente al importar
app_logger = LoggingConfig.setup_logging()
