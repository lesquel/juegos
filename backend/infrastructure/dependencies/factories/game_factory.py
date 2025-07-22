from domain.enums import GameType
from domain.game_engines import Conecta4Game, TictactoeGame


def get_game_engine(game_type: GameType):
    if game_type == GameType.conecta4:
        return Conecta4Game()
    elif game_type == GameType.tictactoe:
        return TictactoeGame()
    raise ValueError("Game engine no soportado")
