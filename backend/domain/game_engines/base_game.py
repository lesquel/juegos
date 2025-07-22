from abc import ABC, abstractmethod


class BaseGameEngine(ABC):
    def __init__(self):
        self.board = self.create_board()
        self.current_player = "R"

    @abstractmethod
    def create_board(self):
        ...

    @abstractmethod
    def apply_move(self, move: dict):
        ...

    @abstractmethod
    def check_winner(self):
        ...
