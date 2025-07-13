

from typing import Generic, TypeVar, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict

DataType = TypeVar("DataType")


class ApiResponse(BaseModel, Generic[DataType]):
    """Respuesta API estandarizada"""

    message: Optional[str] = None
    data: Optional[DataType] = None


class SuccessResponse(ApiResponse[DataType]):
    """Respuesta exitosa"""

    success: bool = True
    model_config = ConfigDict(extra="ignore")


