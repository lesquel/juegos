# main.py

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from infrastructure.websockets.websocket_manager import WebSocketManager


app = FastAPI()
ws_manager = WebSocketManager()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>WebSocket Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <textarea id="chat" cols="100" rows="10" readonly></textarea><br>
        <input type="text" id="messageInput" autocomplete="off"/>
        <button onclick="sendMessage()">Send</button>
        <script>
            const chat = document.getElementById("chat");
            const ws = new WebSocket("ws://localhost:8001/ws");

            ws.onmessage = function(event) {
                chat.value += 'Server: ' + event.data + '\\n';
            };

            function sendMessage() {
                const input = document.getElementById("messageInput");
                ws.send(input.value);
                chat.value += 'You: ' + input.value + '\\n';
                input.value = '';
            }
        </script>
    </body>
</html>
"""


@app.get("/")
async def get():
    return HTMLResponse(html)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await ws_manager.broadcast(f"Mensaje recibido: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
        print("Cliente desconectado")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8001)
