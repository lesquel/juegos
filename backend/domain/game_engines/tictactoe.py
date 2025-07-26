from typing import Any, Dict, Optional

from .base_game import BaseGameEngine


class TictactoeGame(BaseGameEngine):
    """Motor de juego para Tic Tac Toe"""

    def __init__(self):
        # Inicializar propiedades específicas del juego primero
        self.rows = 3
        self.columns = 3
        self.move_count = 0
        self.game_over = False
        self.winner = None
        self.winning_positions = []
        # Usar símbolos R y Y para compatibilidad con Connect4
        self.players = {"R": "Jugador 1", "Y": "Jugador 2"}

        # Llamar al constructor padre después de inicializar propiedades
        super().__init__()
        # Forzar la creación del tablero correcto para TicTacToe
        self.board = self.create_board()
        # Sobrescribir el jugador actual para Tic Tac Toe (primer jugador es R)
        self.current_player = "R"

    def create_board(self):
        return [[" " for _ in range(3)] for _ in range(3)]

    def reset_game(self):
        """Reinicia el juego a su estado inicial"""
        self.board = self.create_board()
        self.current_player = "R"  # Primer jugador es R
        self.move_count = 0
        self.game_over = False
        self.winner = None
        self.winning_positions = []

    def apply_move(self, move: dict) -> Dict[str, Any]:
        """Aplica un movimiento al tablero"""
        if self.game_over:
            raise ValueError("El juego ya ha terminado")

        row = move.get("row")
        col = move.get("column")

        if row is None or col is None:
            raise ValueError("Movimiento inválido: falta fila o columna")

        if row < 0 or row >= 3 or col < 0 or col >= 3:
            raise ValueError("Posición fuera del tablero")

        if self.board[row][col] != " ":
            raise ValueError("Posición ya ocupada")

        # Colocar la pieza
        self.board[row][col] = self.current_player
        self.move_count += 1

        # Verificar ganador
        self.check_winner()

        # Crear respuesta del movimiento
        move_result = {
            "valid": True,
            "row": row,
            "column": col,
            "player": self.current_player,
            "move_count": self.move_count,
            "board": self.board,
            "game_over": self.game_over,
            "winner": self.winner,
            "winning_positions": self.winning_positions,
            "is_tie": False,
        }

        # Verificar empate
        if not self.game_over and self.move_count == 9:
            self.game_over = True
            move_result["is_tie"] = True
            move_result["game_over"] = True

        # Cambiar turno si el juego continúa
        if not self.game_over:
            self.current_player = "Y" if self.current_player == "R" else "R"

        return move_result

    def check_winner(self) -> Optional[Dict[str, Any]]:
        """Verifica si hay un ganador"""
        # Verificar filas
        for row in range(3):
            if self.board[row][0] == self.board[row][1] == self.board[row][2] != " ":
                self.winning_positions = [[row, 0], [row, 1], [row, 2]]
                self._set_winner(self.board[row][0])
                return {"winner": self.winner, "positions": self.winning_positions}

        # Verificar columnas
        for col in range(3):
            if self.board[0][col] == self.board[1][col] == self.board[2][col] != " ":
                self.winning_positions = [[0, col], [1, col], [2, col]]
                self._set_winner(self.board[0][col])
                return {"winner": self.winner, "positions": self.winning_positions}

        # Verificar diagonal principal
        if self.board[0][0] == self.board[1][1] == self.board[2][2] != " ":
            self.winning_positions = [[0, 0], [1, 1], [2, 2]]
            self._set_winner(self.board[0][0])
            return {"winner": self.winner, "positions": self.winning_positions}

        # Verificar diagonal secundaria
        if self.board[0][2] == self.board[1][1] == self.board[2][0] != " ":
            self.winning_positions = [[0, 2], [1, 1], [2, 0]]
            self._set_winner(self.board[0][2])
            return {"winner": self.winner, "positions": self.winning_positions}

        return None

    def _set_winner(self, winner_symbol: str):
        """Establece el ganador del juego"""
        self.game_over = True
        self.winner = winner_symbol

    def get_game_state(self) -> Dict[str, Any]:
        """Retorna el estado completo del juego"""
        return {
            "board": self.board,
            "current_player": self.current_player,
            "move_count": self.move_count,
            "game_over": self.game_over,
            "winner": self.winner,
            "winning_positions": self.winning_positions,
            "players": self.players,
        }

    def is_valid_move(self, row: int, col: int) -> bool:
        """Verifica si un movimiento es válido"""
        if self.game_over:
            return False
        if row < 0 or row >= 3 or col < 0 or col >= 3:
            return False
        return self.board[row][col] == " "

    def get_board(self) -> list:
        """Retorna el tablero de Tic-Tac-Toe (3x3) en el formato correcto"""
        return self.board
