from typing import Protocol


class IFile(Protocol):
    filename: str

    async def read(self) -> bytes:
        ...
