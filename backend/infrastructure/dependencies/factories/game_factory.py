from domain.game_engines import Conecta4Game, TictactoeGame
from infrastructure.websockets.game_names import CONNECT4_NAME, TICTACTOE_NAME


def get_game_engine(game_str: str):
    if game_str == CONNECT4_NAME:
        return Conecta4Game()
    elif game_str == TICTACTOE_NAME:
        return TictactoeGame()
    raise ValueError("Game engine no soportado")
