from fastapi import Depends
from sqlalchemy.orm import Session

from application.use_cases.game import GetAllGamesUseCase, GetGameByIdUseCase
from domain.repositories import IGameRepository
from infrastructure.db.repositories.game_repository import (
    PostgresGameRepository,
)

from infrastructure.db.connection import get_db


def get_game_repository(db: Session = Depends(get_db)) -> IGameRepository:
    return PostgresGameRepository(db)


def get_all_games_use_case(
    game_repo: IGameRepository = Depends(get_game_repository),
) -> GetAllGamesUseCase:
    return GetAllGamesUseCase(game_repo=game_repo)


def get_game_by_id_use_case(
    game_repo: IGameRepository = Depends(get_game_repository),
) -> GetGameByIdUseCase:
    return GetGameByIdUseCase(game_repo=game_repo)
