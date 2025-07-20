from application.converters.match import (
    MatchParticipantsResponseAssambler,
    MatchParticipationBidirectionalConverter,
)
from application.converters.match.match_converter import (
    MatchBidirectionalConverter,
    MatchEntityToDTOConverter,
)
from application.mixins.dto_converter_mixin import (
    BidirectionalConverter,
    EntityToDTOConverter,
)


def get_match_entity_to_dto_converter() -> EntityToDTOConverter:
    """Get match entity to DTO converter dependency."""
    return MatchEntityToDTOConverter()


def get_match_converter() -> BidirectionalConverter:
    """Get match converter dependency."""
    return MatchBidirectionalConverter()


def get_match_participation_converter() -> BidirectionalConverter:
    """Get match participation converter dependency."""
    return MatchParticipationBidirectionalConverter()


def get_match_participants_response_assembler() -> EntityToDTOConverter:
    """Get match participants response assembler dependency."""

    return MatchParticipantsResponseAssambler()
