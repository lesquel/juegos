from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel

T = TypeVar("T")


class PaginationInfoDTO(BaseModel):
    count: int
    pages: int
    page_number: int
    next: Optional[str]
    prev: Optional[str]


class PaginatedResponseDTO(BaseModel, Generic[T]):
    info: PaginationInfoDTO
    results: List[T]
