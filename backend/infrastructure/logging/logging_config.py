import logging
import logging.config
from typing import Dict, Any
import sys
import os
from pathlib import Path

from infrastructure.core.settings_config import settings


def get_relative_path(file_path: str) -> str:
    """Convierte una ruta absoluta a relativa del proyecto."""
    try:
        # Obtener el directorio raíz del proyecto (donde está main.py)
        project_root = Path(__file__).parent.parent.parent  # backend/
        file_path_obj = Path(file_path)
        
        # Si es una ruta absoluta, convertir a relativa
        if file_path_obj.is_absolute():
            try:
                relative_path = file_path_obj.relative_to(project_root)
                return str(relative_path).replace("\\", "/")  # Usar / para consistencia
            except ValueError:
                # Si no puede ser relativa al proyecto, usar solo el nombre del archivo
                return file_path_obj.name
        else:
            # Ya es relativa
            return file_path
    except Exception:
        # En caso de error, usar solo el nombre del archivo
        return Path(file_path).name


class CustomFormatter(logging.Formatter):
    """Formatter personalizado que usa rutas relativas."""
    
    def format(self, record):
        # Convertir pathname a ruta relativa
        if hasattr(record, 'pathname'):
            record.filename = get_relative_path(record.pathname)
        
        return super().format(record)


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
                    "()": CustomFormatter,
                    "format": "[{asctime}] {levelname} - {filename}:{lineno} in {funcName}() - {message}",
                    "style": "{",
                    "datefmt": "%Y-%m-%d %H:%M:%S",
                },
                "development": {
                    "()": CustomFormatter,
                    "format": "{levelname} - {filename}:{lineno} - {message}",
                    "style": "{",
                },
                "production": {
                    "()": CustomFormatter,
                    "format": "[{asctime}] {levelname} - {message}",
                    "style": "{",
                    "datefmt": "%Y-%m-%d %H:%M:%S",
                },
                "simple": {
                    "format": "{levelname} - {message}", 
                    "style": "{"
                },
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "level": "INFO" if app_settings.environment == "prod" else "DEBUG",
                    "formatter": "development" if app_settings.environment != "prod" else "production",
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
