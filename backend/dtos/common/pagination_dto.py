from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel

T = TypeVar("T")


class PaginationInfoDTO(BaseModel):
    """DTO para información de paginación"""
    
    count: int
    pages: int
    page_number: int
    next: Optional[str]
    prev: Optional[str]


class PaginatedResponseDTO(BaseModel, Generic[T]):
    """DTO genérico para respuestas paginadas"""
    
    info: PaginationInfoDTO
    results: List[T]
