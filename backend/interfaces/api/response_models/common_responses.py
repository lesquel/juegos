"""
Modelos de respuesta estandarizados para la API
"""

from typing import Generic, TypeVar, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """Respuesta API estandarizada"""

    message: Optional[str] = None
    data: Optional[T] = None


class SuccessResponse(ApiResponse[T]):
    """Respuesta exitosa"""

    success: bool = True
    model_config = ConfigDict(extra="ignore")


class ErrorResponse(ApiResponse[None]):
    """Respuesta de error"""

    success: bool = False  # sobrescribe el valor por defecto

    errors: Optional[Dict[str, Any]] = None
    model_config = ConfigDict(extra="ignore")
