from typing import Optional, Protocol


class IFile(Protocol):
    filename: Optional[str]

    async def read(self) -> bytes:
        ...
