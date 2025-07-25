from typing import Dict, Optional

from fastapi import WebSocket
from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.player_manager")


class PlayerManager:
    """Maneja jugadores y sus conexiones WebSocket"""

    def __init__(self):
        self.match_players: Dict[
            str, Dict[str, str]
        ] = {}  # match_id -> {player_id -> symbol}
        self.match_users: Dict[
            str, Dict[str, WebSocket]
        ] = {}  # match_id -> {user_id -> websocket}

    def add_player_to_match(self, match_id: str, player_id: str, player_symbol: str):
        """Agrega un jugador a un match"""
        if match_id not in self.match_players:
            self.match_players[match_id] = {}
        self.match_players[match_id][player_id] = player_symbol
        logger.info(
            f"Added player {player_id} with symbol {player_symbol} to match {match_id}"
        )

    def get_player_symbol(self, match_id: str, player_id: str) -> Optional[str]:
        """Obtiene el símbolo del jugador en un match"""
        return self.match_players.get(match_id, {}).get(player_id)

    def get_players_count(self, match_id: str) -> int:
        """Obtiene el número de jugadores en un match"""
        return len(self.match_players.get(match_id, {}))

    def get_match_players(self, match_id: str) -> Dict[str, str]:
        """Obtiene todos los jugadores de un match"""
        return self.match_players.get(match_id, {})

    def is_player_in_match(self, match_id: str, player_id: str) -> bool:
        """Verifica si un jugador está en un match"""
        return player_id in self.match_players.get(match_id, {})

    def add_user_connection(
        self, match_id: str, user_id: str, websocket: WebSocket
    ) -> bool:
        """Agrega una conexión de usuario. Retorna False si ya existe"""
        if match_id in self.match_users and user_id in self.match_users[match_id]:
            existing_websocket = self.match_users[match_id][user_id]
            # Verificar si la conexión existente está realmente activa
            if (
                hasattr(existing_websocket, "application_state")
                and existing_websocket.application_state.value == 1
            ):  # CONNECTED
                logger.info(
                    f"User {user_id} already connected to match {match_id}, rejecting duplicate connection"
                )
                return False
            else:
                # La conexión anterior no está activa, reemplazarla
                logger.info(
                    f"Replacing inactive connection for user {user_id} in match {match_id}"
                )
                self.match_users[match_id][user_id] = websocket
                return True

        if match_id not in self.match_users:
            self.match_users[match_id] = {}

        self.match_users[match_id][user_id] = websocket
        logger.info(f"User {user_id} connected to match {match_id}")
        return True

    def remove_user_connection(self, match_id: str, user_id: str):
        """Remueve la conexión de un usuario"""
        if match_id in self.match_users:
            self.match_users[match_id].pop(user_id, None)
            if not self.match_users[match_id]:
                del self.match_users[match_id]

    def remove_match_data(self, match_id: str):
        """Elimina todos los datos de un match"""
        self.match_players.pop(match_id, None)
        self.match_users.pop(match_id, None)
        logger.info(f"Removed all player data for match {match_id}")

    def has_users_connected(self, match_id: str) -> bool:
        """Verifica si hay usuarios conectados en un match"""
        return bool(self.match_users.get(match_id))
