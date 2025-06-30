"""
Adaptador para manejar excepciones del dominio y convertirlas a respuestas HTTP
Este adaptador pertenece a la capa de interfaces/infraestructura
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from domain.exceptions  import (
    DomainException,
    AuthenticationError,
    UserAlreadyExistsError,
    UserNotFoundError,
    InvalidTokenError,
    ValidationError,
)
from infrastructure.logging import get_logger

# Configurar logger
logger = get_logger("exception_handler")


class DomainExceptionHandler:
    """Maneja las excepciones del dominio y las convierte a HTTPException"""

    @staticmethod
    def handle(exception: DomainException) -> HTTPException:
        """Convierte una excepción del dominio a HTTPException"""
        logger.warning(f"Domain exception occurred: {type(exception).__name__} - {exception.message}")

        if isinstance(exception, AuthenticationError):
            return HTTPException(status_code=401, detail=exception.message)

        elif isinstance(exception, InvalidTokenError):
            return HTTPException(status_code=401, detail=exception.message)

        elif isinstance(exception, UserAlreadyExistsError):
            return HTTPException(status_code=400, detail=exception.message)

        elif isinstance(exception, UserNotFoundError):
            return HTTPException(status_code=404, detail=exception.message)

        elif isinstance(exception, ValidationError):
            return HTTPException(status_code=400, detail=exception.message)

        else:
            # Excepción genérica del dominio
            logger.error(f"Unhandled domain exception: {type(exception).__name__} - {exception.message}")
            return HTTPException(status_code=500, detail="Internal server error")


class GlobalExceptionHandler:
    """Handler global para excepciones no capturadas"""

    @staticmethod
    def setup_handlers(app: FastAPI):
        """Configura handlers globales en la aplicación FastAPI"""

        @app.exception_handler(DomainException)
        async def domain_exception_handler(request, exc: DomainException):
            logger.error(f"Domain exception in request {request.url}: {type(exc).__name__} - {exc.message}")
            http_exc = DomainExceptionHandler.handle(exc)
            return JSONResponse(
                status_code=http_exc.status_code,
                content={"error": http_exc.detail},
            )

        async def not_found_handler(request, exc):
            logger.warning(f"404 error for request {request.url}: {getattr(exc, 'detail', 'Resource not found')}")
            detail = getattr(exc, "detail", "Resource not found")
            return JSONResponse(
                status_code=404,
                content={"error": detail},
            )

        @app.exception_handler(500)
        async def internal_error_handler(request, exc):
            logger.error(f"Internal server error in request {request.url}: {getattr(exc, 'detail', 'Internal server error')}")
            detail = getattr(exc, "detail", "Internal server error")
            return JSONResponse(
                status_code=500,
                content={"error": detail},
            )
