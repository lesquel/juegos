"""
Sistema de manejo de excepciones simplificado - Similar a Django
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
import traceback

from domain.exceptions import DomainException
from infrastructure.logging import get_logger

logger = get_logger("exception_handler")


class ErrorHandlerMiddleware:
    """Middleware para manejo de errores - Similar al de Django"""

    @staticmethod
    def handle_domain_exception(request: Request, exc: DomainException) -> JSONResponse:
        """Maneja excepciones del dominio - Similar a process_exception de Django"""

        # Log del error
        logger.warning(f"[{exc.identifier}] {exc.message} - Path: {request.url}")

        # Crear respuesta de error similar a Django
        error_response = {
            "errors": {exc.identifier: [exc.message]},
            "code": exc.code,
        }

        return JSONResponse(status_code=exc.code, content=error_response)

    @staticmethod
    def handle_validation_error(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """Maneja errores de validación de Pydantic"""

        # Convertir errores de Pydantic a formato similar a Django
        errors = {}
        for error in exc.errors():
            field = (
                ".".join(str(x) for x in error["loc"]) if error["loc"] else "validation"
            )
            if field not in errors:
                errors[field] = []
            errors[field].append(error["msg"])

        error_response = {
            "errors": errors,
            "code": 400,
        }

        logger.warning(
            f"Validation error: {len(exc.errors())} field(s) - Path: {request.url}"
        )
        return JSONResponse(status_code=400, content=error_response)

    @staticmethod
    def handle_database_error(request: Request, exc: Exception) -> JSONResponse:
        """Maneja errores de base de datos"""

        if isinstance(exc, IntegrityError):
            # Errores de integridad
            if "unique" in str(exc.orig).lower():
                error_response = {
                    "errors": {"database": ["Resource already exists"]},
                    "code": 409,
                }
                status_code = 409
            elif "foreign key" in str(exc.orig).lower():
                error_response = {
                    "errors": {"database": ["Referenced resource not found"]},
                    "code": 400,
                }
                status_code = 400
            else:
                error_response = {
                    "errors": {"database": ["Data integrity violation"]},
                    "code": 409,
                }
                status_code = 409

        elif isinstance(exc, OperationalError):
            error_response = {
                "errors": {"database": ["Database operation failed"]},
                "code": 503,
            }
            status_code = 503
        else:
            error_response = {
                "errors": {"database": ["Database error occurred"]},
                "code": 500,
            }
            status_code = 500

        logger.error(f"Database error: {str(exc)} - Path: {request.url}")
        return JSONResponse(status_code=status_code, content=error_response)

    @staticmethod
    def handle_generic_exception(request: Request, exc: Exception) -> JSONResponse:
        """Maneja excepciones genéricas no capturadas"""

        error_response = {
            "errors": {"internal_server_error": [str(exc)]},
            "code": 500,
        }

        # Log completo del error para debugging
        logger.error(
            f"Unhandled exception: {type(exc).__name__}: {str(exc)} - Path: {request.url}"
        )
        logger.error(f"Traceback: {traceback.format_exc()}")

        return JSONResponse(status_code=500, content=error_response)


def setup_exception_handlers(app: FastAPI):
    """Configura los handlers de excepciones - Similar al setup de Django"""

    handler = ErrorHandlerMiddleware()

    # Handler para excepciones del dominio
    @app.exception_handler(DomainException)
    async def domain_exception_handler(request: Request, exc: DomainException):
        return handler.handle_domain_exception(request, exc)

    # Handler para errores de validación de Pydantic
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ):
        return handler.handle_validation_error(request, exc)

    # Handler para errores de base de datos
    @app.exception_handler(IntegrityError)
    async def integrity_error_handler(request: Request, exc: IntegrityError):
        return handler.handle_database_error(request, exc)

    @app.exception_handler(OperationalError)
    async def operational_error_handler(request: Request, exc: OperationalError):
        return handler.handle_database_error(request, exc)

    # Handler para excepciones genéricas (catch-all)
    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        return handler.handle_generic_exception(request, exc)

    logger.info("✅ Exception handlers configured (Django-style)")


class GlobalExceptionHandler:
    @staticmethod
    def setup_error_handlers(app: FastAPI):
        setup_exception_handlers(app)
