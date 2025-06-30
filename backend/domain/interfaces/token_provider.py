from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

class ITokenProvider(ABC):
    @abstractmethod
    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[int] = None) -> str:
        pass

    @abstractmethod
    def decode_token(self, token: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def verify_token(self, token: str) -> bool:
        pass

