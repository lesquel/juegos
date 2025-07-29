from sqlalchemy import Enum


class OnlineGameType(str, Enum):
    conecta4 = "conecta4"
    tictactoe = "tictactoe"
