from typing import Any, Dict, List, Optional

from .base_game import BaseGameEngine


class Conecta4Game(BaseGameEngine):
    def __init__(self):
        # Inicializar propiedades específicas del juego primero
        self.rows = 6
        self.columns = 7
        self.curr_columns = [
            5,
            5,
            5,
            5,
            5,
            5,
            5,
        ]  # Índice de la última fila disponible por columna
        self.move_count = 0
        self.game_over = False
        self.winner = None
        self.winning_positions = []
        self.players = {"R": "Rojo", "Y": "Amarillo"}

        # Llamar al constructor padre después de inicializar propiedades
        super().__init__()

    def create_board(self):
        return [[" " for _ in range(self.columns)] for _ in range(self.rows)]

    def apply_move(self, move: dict) -> Dict[str, Any]:
        """
        Aplica un movimiento al tablero y retorna el estado del juego
        """
        if self.game_over:
            raise ValueError("El juego ya ha terminado")

        col = move.get("column")
        if col is None or col < 0 or col >= self.columns:
            raise ValueError("Columna inválida")

        # Verificar si la columna está llena
        if self.curr_columns[col] < 0:
            raise ValueError("Columna llena")

        # Colocar la pieza
        row = self.curr_columns[col]
        self.board[row][col] = self.current_player
        self.move_count += 1

        # Actualizar disponibilidad de columna
        self.curr_columns[col] -= 1

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

        # Verificar empate (tablero lleno)
        if not self.game_over and self.move_count == 42:
            self.game_over = True
            move_result["is_tie"] = True
            move_result["game_over"] = True

        # Cambiar turno si el juego continúa
        if not self.game_over:
            self.current_player = "Y" if self.current_player == "R" else "R"

        return move_result

    def check_winner(self) -> Optional[Dict[str, Any]]:
        """
        Verifica si hay un ganador en el tablero actual
        """
        # Verificar en todas las direcciones
        directions = [
            (0, 1),  # Horizontal
            (1, 0),  # Vertical
            (1, 1),  # Diagonal ↘
            (1, -1),  # Diagonal ↙
        ]

        for dr, dc in directions:
            winner_result = self._check_direction(dr, dc)
            if winner_result:
                return winner_result

        return None

    def _check_direction(self, dr: int, dc: int) -> Optional[Dict[str, Any]]:
        """Verifica ganador en una dirección específica"""
        for r in range(self.rows):
            for c in range(self.columns):
                if self.board[r][c] != " ":
                    positions = self._get_consecutive_positions(r, c, dr, dc)
                    if len(positions) >= 4:
                        self.winning_positions = positions[:4]
                        self._set_winner(self.board[r][c])
                        return {
                            "winner": self.winner,
                            "positions": self.winning_positions,
                        }
        return None

    def _get_consecutive_positions(
        self, start_r: int, start_c: int, dr: int, dc: int
    ) -> List[List[int]]:
        """Obtiene posiciones consecutivas del mismo jugador en una dirección"""
        positions = []
        player = self.board[start_r][start_c]
        r, c = start_r, start_c

        while (
            0 <= r < self.rows and 0 <= c < self.columns and self.board[r][c] == player
        ):
            positions.append([r, c])
            r += dr
            c += dc

        return positions

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
            "curr_columns": self.curr_columns,
            "players": self.players,
        }

    def is_valid_move(self, column: int) -> bool:
        """Verifica si un movimiento es válido"""
        if self.game_over:
            return False
        if column < 0 or column >= self.columns:
            return False
        return self.curr_columns[column] >= 0

    def get_board(self) -> List[List]:
        """Retorna el estado actual del tablero"""
        # Convertir el tablero a números para el frontend
        # R -> 1, Y -> 2, " " -> 0
        numeric_board = []
        for row in self.board:
            numeric_row = []
            for cell in row:
                if cell == "R":
                    numeric_row.append(1)
                elif cell == "Y":
                    numeric_row.append(2)
                else:
                    numeric_row.append(0)
            numeric_board.append(numeric_row)
        return numeric_board
