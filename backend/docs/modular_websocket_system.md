# Sistema Modular de WebSocket Game Managers

## Descripción General

El sistema de WebSocket para juegos ha sido refactorizado para ser más modular y extensible. Ahora cada tipo de juego tiene su propio manager especializado que hereda de una clase base común.

## Arquitectura

### Estructura de Clases

```
BaseGameWebSocketManager (ABC)
├── Connect4WebSocketManager
├── TictactoeWebSocketManager
└── [Futuros managers de juego]

UnifiedGameWebSocketManager
└── Delega a managers específicos según el tipo de juego
```

### Componentes Principales

#### 1. BaseGameWebSocketManager
- **Ubicación**: `infrastructure/websockets/managers/base_game_manager.py`
- **Propósito**: Clase base abstracta que define la interfaz común para todos los managers de juego
- **Responsabilidades**:
  - Manejo de conexiones WebSocket
  - Lógica común de juegos (join, move, restart, etc.)
  - Gestión de jugadores y estados de partida
  - Broadcasting de mensajes

#### 2. Managers Específicos

##### Connect4WebSocketManager
- **Ubicación**: `infrastructure/websockets/managers/connect4_manager.py`
- **Configuración**:
  - Máximo 2 jugadores activos
  - Símbolos: "R" (rojo), "Y" (amarillo), "S" (espectador)
  - Colores: "red", "yellow", "spectator"

##### TictactoeWebSocketManager
- **Ubicación**: `infrastructure/websockets/managers/tictactoe_manager.py`
- **Configuración**:
  - Máximo 2 jugadores activos
  - Símbolos: "X", "O", "S" (espectador)
  - Colores: "blue", "red", "spectator"

#### 3. Game Manager Factory
- **Ubicación**: `infrastructure/websockets/managers/game_manager_factory.py`
- **Propósito**: Factory pattern para crear y gestionar instancias de managers
- **Características**:
  - Registry de tipos de juego disponibles
  - Instancias singleton por tipo de juego
  - API para registrar nuevos tipos de juego

#### 4. Unified Game Manager
- **Ubicación**: `infrastructure/websockets/unified_game_manager.py`
- **Propósito**: Manager unificado que mantiene compatibilidad con el código existente
- **Responsabilidades**:
  - Delegar llamadas a managers específicos
  - Mantener mapeo de match_id → game_type
  - Proporcionar una interfaz unificada

## Flujo de Funcionamiento

### 1. Inicialización
```python
# El sistema automáticamente registra los managers disponibles
game_manager = get_game_websocket_manager()  # Retorna UnifiedGameWebSocketManager
```

### 2. Conexión de Cliente
```python
# El cliente se conecta al WebSocket
connection_successful = game_manager.connect(match_id, websocket, user_id)
```

### 3. Mensaje de Join Game
```python
# El cliente envía un mensaje join_game con game_type
message = {
    "type": "join_game",
    "game_type": "connect4",  # o "tictactoe"
    "match_id": "uuid...",
    "player_id": "uuid..."
}

# El UnifiedGameManager:
# 1. Identifica el game_type del mensaje
# 2. Obtiene el manager específico para ese tipo
# 3. Delega el manejo del mensaje
await game_manager.handle_game_message(match_id, websocket, message, user_id)
```

### 4. Delegación Automática
- Una vez que se identifica el tipo de juego para un match, todas las operaciones subsecuentes se delegan automáticamente al manager específico
- El mapeo match_id → game_type se mantiene durante toda la vida del match

## Ventajas del Nuevo Sistema

### 1. Modularidad
- Cada tipo de juego tiene su propia lógica encapsulada
- Fácil mantenimiento y debugging por tipo de juego
- Código más limpio y organizado

### 2. Extensibilidad
- Agregar nuevos tipos de juego es simple:
```python
class NewGameWebSocketManager(BaseGameWebSocketManager):
    # Implementar métodos abstractos
    pass

# Registrar el nuevo manager
register_game_manager("new_game", NewGameWebSocketManager)
```

### 3. Configurabilidad
- Cada manager puede tener configuraciones específicas:
  - Número máximo de jugadores
  - Símbolos y colores de jugadores
  - Lógica específica del juego

### 4. Retrocompatibilidad
- El `UnifiedGameWebSocketManager` mantiene la misma interfaz que el manager anterior
- No se requieren cambios en `routes.py` u otros archivos existentes

### 5. Separación de Responsabilidades
- Lógica común en la clase base
- Lógica específica en managers derivados
- Factory pattern para gestión de instancias

## Agregar un Nuevo Tipo de Juego

### Paso 1: Crear el Manager
```python
# infrastructure/websockets/managers/nuevo_juego_manager.py
from .base_game_manager import BaseGameWebSocketManager
from infrastructure.dependencies.factories import get_game_engine
from domain.enums.online_game_type import GameType

class NuevoJuegoWebSocketManager(BaseGameWebSocketManager):
    @property
    def game_type(self) -> str:
        return "nuevo_juego"

    def create_game_engine(self, match_id: str):
        return get_game_engine(GameType.nuevo_juego)

    def get_max_players(self) -> int:
        return 4  # Ejemplo: hasta 4 jugadores

    def assign_player_symbol(self, current_players: int) -> str:
        symbols = ["A", "B", "C", "D"]
        return symbols[current_players] if current_players < 4 else "S"

    def get_player_color_from_symbol(self, symbol: str) -> str:
        colors = {"A": "red", "B": "blue", "C": "green", "D": "yellow", "S": "spectator"}
        return colors.get(symbol, "spectator")
```

### Paso 2: Registrar el Manager
```python
# En infrastructure/websockets/managers/game_manager_factory.py
from .nuevo_juego_manager import NuevoJuegoWebSocketManager

def _register_default_managers(self):
    # Managers existentes...
    self.register("nuevo_juego", NuevoJuegoWebSocketManager)
```

### Paso 3: Actualizar Imports
```python
# En infrastructure/websockets/managers/__init__.py
from .nuevo_juego_manager import NuevoJuegoWebSocketManager

__all__ = [
    # Existentes...
    "NuevoJuegoWebSocketManager"
]
```

¡Y listo! El nuevo tipo de juego estará disponible automáticamente.

## Testing

Para testing, cada manager se puede probar de forma independiente:

```python
# Test específico para Connect4
connect4_manager = Connect4WebSocketManager()
# Test lógica específica de connect4...

# Test específico para TicTacToe
tictactoe_manager = TictactoeWebSocketManager()
# Test lógica específica de tictactoe...

# Test del sistema unificado
unified_manager = UnifiedGameWebSocketManager()
# Test delegación automática...
```

## Logging

Cada manager tiene su propio logger con namespace específico:
- `"websockets.base_game_manager"` - Para la clase base
- `"websockets.unified_game_manager"` - Para el manager unificado
- Los managers específicos heredan el logger de la clase base

## Migración

La migración del sistema anterior es automática. El código existente seguirá funcionando sin cambios porque:

1. La interfaz del `UnifiedGameWebSocketManager` es compatible con el `GameWebSocketManager` anterior
2. Se mantienen todos los métodos públicos existentes
3. El comportamiento por defecto es Connect4, como antes

El archivo `GameWebSocketManager` original puede mantenerse como referencia o eliminarse una vez confirmado que todo funciona correctamente.
