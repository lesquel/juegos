from sqlalchemy import Enum


class GameType(str, Enum):
    conecta4 = "conecta4"
    tictactoe = "tictactoe"
