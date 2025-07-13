from fastapi import Depends

from application.mixins.dto_converter_mixin import EntityToDTOConverter
from application.use_cases.game import (
    GetAllGamesUseCase,
    GetGameByIdUseCase,
    GetGamesByCategoryIdUseCase,
)
from domain.repositories import IGameRepository

from ..repositories import get_game_repository
from ..converters import get_game_converter


def get_all_games_use_case(
    game_repo: IGameRepository = Depends(get_game_repository),
    game_converter: EntityToDTOConverter = Depends(get_game_converter),
) -> GetAllGamesUseCase:
    return GetAllGamesUseCase(
        game_repo=game_repo,
        game_converter=game_converter
    )


def get_game_by_id_use_case(
    game_repo: IGameRepository = Depends(get_game_repository),
    game_converter: EntityToDTOConverter = Depends(get_game_converter),
) -> GetGameByIdUseCase:
    return GetGameByIdUseCase(
        game_repo=game_repo,
        game_converter=game_converter
    )


def get_games_by_category_id_use_case(
    game_repo: IGameRepository = Depends(get_game_repository),
    game_converter: EntityToDTOConverter = Depends(get_game_converter),
) -> GetGamesByCategoryIdUseCase:
    return GetGamesByCategoryIdUseCase(
        game_repo=game_repo,
        game_converter=game_converter
    )


__all__ = [
    "get_all_games_use_case",
    "get_game_by_id_use_case", 
    "get_games_by_category_id_use_case",
]