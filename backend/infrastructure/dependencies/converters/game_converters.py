"""
Proveedores de convertidores para juegos, categorías y reseñas.

Este módulo contiene las funciones que crean instancias de convertidores
relacionados con games, categories y reviews.
"""

from application.converters.game.category_converter import CategoryEntityToDTOConverter
from application.converters.game.game_converter import GameEntityToDTOConverter
from application.converters.game.game_review_converter import (
    GameReviewBidirectionalConverter,
    GameReviewDTOToEntityConverter,
    GameReviewEntityToDTOConverter,
)
from application.mixins.dto_converter_mixin import (
    BidirectionalConverter,
    DTOToEntityConverter,
    EntityToDTOConverter,
)


def get_game_converter() -> EntityToDTOConverter:
    """
    Proveedor para el convertidor de juegos.

    Returns:
        EntityToDTOConverter: Convertidor de GameEntity a GameResponseDTO
    """
    return GameEntityToDTOConverter()


def get_category_converter() -> EntityToDTOConverter:
    """
    Proveedor para el convertidor de categorías.

    Returns:
        EntityToDTOConverter: Convertidor de CategoryEntity a CategoryResponseDTO
    """
    return CategoryEntityToDTOConverter()


def get_game_review_entity_to_dto_converter() -> EntityToDTOConverter:
    """
    Proveedor para el convertidor de reseñas de juegos (Entity -> DTO).

    Returns:
        EntityToDTOConverter: Convertidor de GameReviewEntity a GameReviewResponseDTO
    """
    return GameReviewEntityToDTOConverter()


def get_game_review_dto_to_entity_converter() -> DTOToEntityConverter:
    """
    Proveedor para el convertidor de reseñas de juegos (DTO -> Entity).

    Returns:
        DTOToEntityConverter: Convertidor de GameReviewRequestDTO a GameReviewEntity
    """
    return GameReviewDTOToEntityConverter()


def get_game_review_converter() -> BidirectionalConverter:
    """
    Proveedor para el convertidor bidireccional de reseñas de juegos.

    Returns:
        BidirectionalConverter: Convertidor bidireccional entre GameReviewEntity y
        GameReviewResponseDTO/GameReviewRequestDTO
    """
    return GameReviewBidirectionalConverter()


# Exportar todos los proveedores
__all__ = [
    "get_game_converter",
    "get_category_converter",
    "get_game_review_entity_to_dto_converter",
    "get_game_review_dto_to_entity_converter",
    "get_game_review_converter",
]
