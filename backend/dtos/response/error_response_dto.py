from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime


class ErrorDetail(BaseModel):
    """Detalle específico de un error"""
    field: Optional[str] = None
    message: str
    code: Optional[str] = None


class ErrorResponse(BaseModel):
    """Respuesta estándar para errores"""
    success: bool = False
    error: str
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime
    path: Optional[str] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ValidationErrorResponse(ErrorResponse):
    """Respuesta específica para errores de validación"""
    validation_errors: List[ErrorDetail] = []


class BusinessErrorResponse(ErrorResponse):
    """Respuesta específica para errores de negocio"""
    business_rule: Optional[str] = None


class AuthenticationErrorResponse(ErrorResponse):
    """Respuesta específica para errores de autenticación"""
    auth_required: bool = True
    token_expired: bool = False
