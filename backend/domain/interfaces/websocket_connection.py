from typing import Protocol


class WebSocketConnection(Protocol):
    async def accept(self) -> None:
        ...

    async def send_text(self, message: str) -> None:
        ...

    async def receive_text(self) -> str:
        ...

    async def close(self) -> None:
        ...
