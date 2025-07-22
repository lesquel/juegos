from .http.routes import http_routers
from .websockets import websocket_routers

routers = http_routers + websocket_routers
