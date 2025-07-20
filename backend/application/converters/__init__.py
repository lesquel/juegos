"""
Conversores de aplicación para todas las entidades.

Este módulo expone todos los conversores necesarios para transformar
entre entidades del dominio y sus DTOs correspondientes.
"""

from .auth import *
from .game import *
from .match import *
from .user import *

__all__ = [
    # User converters
    "UserEntityToDTOConverter",
    "UserDTOToEntityConverter",
    "UserBidirectionalConverter",
    "TransferPaymentEntityToDTOConverter",
    "TransferPaymentDTOToEntityConverter",
    "TransferPaymentBidirectionalConverter",
    # Game converters
    "GameEntityToDTOConverter",
    "CategoryEntityToDTOConverter",
    "CategoryBidirectionalConverter",
    "GameReviewEntityToDTOConverter",
    "GameReviewDTOToEntityConverter",
    "GameReviewBidirectionalConverter",
    # Match converters
    "MatchEntityToDTOConverter",
    "MatchSummaryConverter",
    "CreateMatchDTOToEntityConverter",
    "MatchBidirectionalConverter",
    "MatchParticipationEntityToDTOConverter",
    "JoinMatchDTOToEntityConverter",
    "MatchParticipationBidirectionalConverter",
    # Auth converters
    "UserRequestToEntityConverter",
    "UserEntityToResponseConverter",
]
