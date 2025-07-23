# Documentación de Peticiones WebSocket - Sistema de Juegos

Esta documentación describe todas las peticiones WebSocket que el sistema acepta y sus formatos esperados.

## 📋 Tipos de Mensaje Soportados

El sistema reconoce los siguientes tipos de mensaje a través del campo `type` o `action`:

- `join_game` - Unirse a un juego
- `create_game` - Crear un juego (redirige a join_game)
- `make_move` - Realizar un movimiento
- `restart_game` - Reiniciar el juego
- `get_game_state` - Obtener estado actual del juego

---

## 🎮 1. Unirse a un Juego

### Petición
```json
{
  "type": "join_game",
  "player_id": "user123"
}
```

### Campos
- `type`: `"join_game"` (requerido)
- `player_id`: ID del jugador (opcional si hay autenticación)

### Respuesta de éxito
```json
{
  "type": "game_state",
  "game_id": "match_abc123",
  "player_id": "user123",
  "player_color": "red",
  "state": "waiting_for_players",
  "current_player": 1,
  "board": null,
  "winner": null
}
```

### Notificación a otros jugadores
```json
{
  "type": "player_joined",
  "player_id": "user123",
  "player_symbol": "X",
  "players_count": 1
}
```

---

## 🎯 2. Realizar un Movimiento

### Petición - TicTacToe
```json
{
  "type": "make_move", 
  "player_id": "user123",
  "move": {
    "row": 1,
    "col": 2
  }
}
```

### Petición - Connect4
```json
{
  "type": "make_move",
  "player_id": "user123",
  "move": {
    "column": 3
  }
}
```

### Campos
- `type`: `"make_move"` (requerido)
- `player_id`: ID del jugador que hace el movimiento (requerido)
- `move`: Objeto con los datos específicos del movimiento (requerido)

### Respuesta de éxito (broadcast a todos)
```json
{
  "type": "move_made",
  "player_id": "user123",
  "player_symbol": "X",
  "move": {
    "row": 1,
    "col": 2
  },
  "result": {
    "valid": true,
    "winner": null,
    "game_over": false
  },
  "game_state": {
    "board": [
      ["", "", ""],
      ["", "", "X"],
      ["", "", ""]
    ],
    "current_player": "O",
    "winner": null,
    "game_over": false
  }
}
```

### Respuesta de error
```json
{
  "type": "error",
  "message": "No es tu turno"
}
```

```json
{
  "type": "error",
  "message": "Movimiento inválido"
}
```

---

## 🔄 3. Reiniciar Juego

### Petición
```json
{
  "type": "restart_game"
}
```

### Campos
- `type`: `"restart_game"` (requerido)

### Respuesta (broadcast a todos)
```json
{
  "type": "game_restarted",
  "game_state": {
    "board": [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ],
    "current_player": "X",
    "winner": null,
    "game_over": false
  }
}
```

---

## 📊 4. Obtener Estado del Juego

### Petición
```json
{
  "type": "get_game_state"
}
```

### Campos
- `type`: `"get_game_state"` (requerido)

### Respuesta
```json
{
  "type": "game_state",
  "game_state": {
    "board": [
      ["X", "O", ""],
      ["", "X", ""],
      ["", "", "O"]
    ],
    "current_player": "X",
    "winner": null,
    "game_over": false
  },
  "players": {
    "user123": "X",
    "user456": "O"
  }
}
```

---

## 🆕 5. Crear Juego

### Petición
```json
{
  "type": "create_game",
  "player_id": "user123"
}
```

### Comportamiento
- Internamente redirige a `join_game`
- Crea el juego si no existe
- Une al jugador al juego

---

## 🚨 Manejo de Errores

### Errores Comunes

#### Juego no encontrado
```json
{
  "type": "error",
  "message": "Juego no encontrado"
}
```

#### Player ID requerido
```json
{
  "type": "error", 
  "message": "Player ID required"
}
```

#### No es tu turno
```json
{
  "type": "error",
  "message": "No es tu turno"
}
```

#### Movimiento inválido
```json
{
  "type": "error",
  "message": "Movimiento inválido en la posición (1,2)"
}
```

---

## 🔗 Conexión WebSocket

### URL de Conexión
```
ws://localhost:8000/ws/game/{match_id}
```

### Parámetros de URL
- `match_id`: Identificador único del match/partida

### Headers (si hay autenticación)
```
Authorization: Bearer <token>
```

---

## 💡 Ejemplos de Flujo Completo

### Flujo TicTacToe

1. **Jugador 1 se une**
```json
→ {"type": "join_game", "player_id": "player1"}
← {"type": "game_state", "player_color": "red", "state": "waiting_for_players"}
```

2. **Jugador 2 se une**
```json
→ {"type": "join_game", "player_id": "player2"}
← {"type": "game_state", "player_color": "blue", "state": "playing"}
← {"type": "player_joined", "player_id": "player2", "players_count": 2}
```

3. **Jugador 1 hace movimiento**
```json
→ {"type": "make_move", "player_id": "player1", "move": {"row": 0, "col": 0}}
← {"type": "move_made", "player_symbol": "X", "result": {"valid": true}}
```

4. **Obtener estado actual**
```json
→ {"type": "get_game_state"}
← {"type": "game_state", "game_state": {...}, "players": {...}}
```

5. **Reiniciar juego**
```json
→ {"type": "restart_game"}
← {"type": "game_restarted", "game_state": {...}}
```

---

## 🎲 Especificaciones por Juego

### TicTacToe (3 en Raya)
- **Jugadores**: 2 activos + espectadores ilimitados
- **Símbolos**: "X", "O", "S" (espectador)
- **Colores**: "red", "blue", "spectator"
- **Movimiento**: `{"row": 0-2, "col": 0-2}`

### Connect4 (4 en Línea)
- **Jugadores**: 2 activos + espectadores ilimitados
- **Símbolos**: "R", "Y", "S" (espectador)
- **Colores**: "red", "yellow", "spectator"
- **Movimiento**: `{"column": 0-6}`

---

## 🔧 Notas Técnicas

- El campo `type` o `action` puede ser usado indistintamente
- Los mensajes no reconocidos se retransmiten a todos los jugadores
- La autenticación puede proporcionar automáticamente el `player_id`
- Los espectadores reciben todas las actualizaciones pero no pueden jugar
- El sistema mantiene el estado del juego hasta que se desconectan todos los jugadores