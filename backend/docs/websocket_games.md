# WebSocket para Juegos - Documentación

## Descripción General

Este sistema implementa WebSockets para juegos multijugador en tiempo real, específicamente diseñado para Connect 4 y extensible para otros juegos como Tic Tac Toe.

## Arquitectura

### Componentes Principales

1. **GameWebSocketManager**: Maneja las conexiones WebSocket específicas para juegos
2. **Conecta4Game**: Motor de juego para Connect 4
3. **TictactoeGame**: Motor de juego para Tic Tac Toe
4. **WebSocket Routes**: Endpoints para las conexiones WebSocket

### Flujo de Comunicación

```
Cliente ←→ WebSocket ←→ GameWebSocketManager ←→ GameEngine
```

## Endpoints WebSocket

### Conexión Principal
```
ws://localhost:8000/ws/games/{match_id}
```

- `match_id`: Identificador único de la partida

## Tipos de Mensajes

### 1. Unirse al Juego
**Cliente → Servidor**
```json
{
    "type": "join_game",
    "player_id": "player_123",
    "game_type": "conecta4"
}
```

**Servidor → Todos los Clientes**
```json
{
    "type": "player_joined",
    "player_id": "player_123",
    "player_symbol": "R",
    "players_count": 1,
    "game_state": {
        "board": [...],
        "current_player": "R",
        "move_count": 0,
        "game_over": false,
        "winner": null,
        "winning_positions": [],
        "curr_columns": [5, 5, 5, 5, 5, 5, 5],
        "players": {"R": "Rojo", "Y": "Amarillo"}
    }
}
```

### 2. Realizar Movimiento
**Cliente → Servidor**
```json
{
    "type": "make_move",
    "player_id": "player_123",
    "move": {
        "column": 3
    }
}
```

**Servidor → Todos los Clientes**
```json
{
    "type": "move_made",
    "player_id": "player_123",
    "player_symbol": "R",
    "move": {"column": 3},
    "result": {
        "valid": true,
        "row": 5,
        "column": 3,
        "player": "R",
        "move_count": 1,
        "board": [...],
        "game_over": false,
        "winner": null,
        "winning_positions": [],
        "is_tie": false
    },
    "game_state": {...}
}
```

### 3. Reiniciar Juego
**Cliente → Servidor**
```json
{
    "type": "restart_game",
    "player_id": "player_123"
}
```

**Servidor → Todos los Clientes**
```json
{
    "type": "game_restarted",
    "game_state": {
        "board": [...],
        "current_player": "R",
        "move_count": 0,
        "game_over": false,
        "winner": null,
        "winning_positions": [],
        "curr_columns": [5, 5, 5, 5, 5, 5, 5],
        "players": {"R": "Rojo", "Y": "Amarillo"}
    }
}
```

### 4. Obtener Estado del Juego
**Cliente → Servidor**
```json
{
    "type": "get_game_state",
    "player_id": "player_123"
}
```

**Servidor → Cliente Solicitante**
```json
{
    "type": "game_state",
    "game_state": {...},
    "players": {
        "player_123": "R",
        "player_456": "Y"
    }
}
```

### 5. Manejo de Errores
**Servidor → Cliente**
```json
{
    "type": "error",
    "message": "No es tu turno"
}
```

## Reglas del Juego Connect 4

### Objetivo
Conectar 4 fichas del mismo color en línea (horizontal, vertical o diagonal).

### Mecánica
1. Los jugadores alternan turnos
2. Las fichas caen por gravedad en la columna seleccionada
3. Primer jugador en conseguir 4 en línea gana
4. Si el tablero se llena sin ganador, es empate

### Estados de Juego
- **Jugando**: Esperando movimiento del jugador actual
- **Ganado**: Un jugador ha conseguido 4 en línea
- **Empate**: Tablero lleno sin ganador

## Implementación Frontend

### Conexión WebSocket
```javascript
const wsUrl = `ws://localhost:8000/ws/games/${matchId}`;
const socket = new WebSocket(wsUrl);

socket.onopen = function(event) {
    console.log('Conectado al WebSocket');
};

socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    handleWebSocketMessage(message);
};
```

### Envío de Mensajes
```javascript
function joinGame() {
    const message = {
        type: 'join_game',
        player_id: playerId,
        game_type: 'conecta4'
    };
    socket.send(JSON.stringify(message));
}

function makeMove(column) {
    const message = {
        type: 'make_move',
        player_id: playerId,
        move: { column: column }
    };
    socket.send(JSON.stringify(message));
}
```

## Extensibilidad

### Agregar Nuevos Juegos

1. **Crear Motor de Juego**
```python
class NuevoJuegoGame(BaseGameEngine):
    def create_board(self):
        # Implementar tablero específico
        pass

    def apply_move(self, move: dict):
        # Implementar lógica de movimiento
        pass

    def check_winner(self):
        # Implementar detección de ganador
        pass
```

2. **Actualizar Enum**
```python
class GameType(str, Enum):
    conecta4 = "conecta4"
    tictactoe = "tictactoe"
    nuevo_juego = "nuevo_juego"  # Agregar aquí
```

3. **Actualizar GameWebSocketManager**
```python
def create_game(self, match_id: str, game_type: str):
    if game_type == GameType.nuevo_juego:
        game = NuevoJuegoGame()
    # ... resto del código
```

## Configuración y Despliegue

### Dependencias
- FastAPI
- WebSockets
- Uvicorn

### Ejecutar Servidor
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Configuración CORS (si es necesario)
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing

### Probar WebSocket con Cliente Web
1. Abrir `static/connect4_multiplayer.html` en el navegador
2. Presionar "Unirse al Juego"
3. Abrir otra pestaña con el mismo archivo
4. Ambos jugadores pueden jugar en tiempo real

### Probar con Herramientas
- WebSocket clients como wscat
- Browser Developer Tools
- Postman WebSocket feature

## Manejo de Errores

### Errores Comunes
1. **"Juego no encontrado"**: El match_id no existe
2. **"No es tu turno"**: El jugador intenta mover fuera de turno
3. **"Columna llena"**: En Connect 4, la columna está completa
4. **"Posición ya ocupada"**: En Tic Tac Toe, la casilla ya tiene una ficha

### Reconexión
El sistema limpia automáticamente los juegos cuando no quedan conexiones activas.

## Consideraciones de Rendimiento

1. **Memoria**: Los juegos se almacenan en memoria durante la sesión
2. **Conexiones**: Cada match puede tener múltiples observadores
3. **Limpieza**: Los recursos se liberan automáticamente al desconectar

## Seguridad

1. **Validación**: Todos los movimientos se validan en el servidor
2. **Turnos**: Solo el jugador actual puede realizar movimientos
3. **Estado**: El estado del juego es autoridad en el servidor
