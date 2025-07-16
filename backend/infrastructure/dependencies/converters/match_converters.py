from application.converters.match.match_converter import MatchBidirectionalConverter
from application.converters.match import (
    MatchParticipationBidirectionalConverter,
    MatchParticipantsResponseAssambler,
)



from application.mixins.dto_converter_mixin import (
    DTOToEntityConverter,
    EntityToDTOConverter,
    BidirectionalConverter,
)


def get_match_converter() -> BidirectionalConverter:
    """Get match converter dependency."""
    return MatchBidirectionalConverter()


def get_match_participation_converter() -> BidirectionalConverter:
    """Get match participation converter dependency."""
    return MatchParticipationBidirectionalConverter()


def get_match_participants_response_assembler() -> EntityToDTOConverter:
    """Get match participants response assembler dependency."""

    return MatchParticipantsResponseAssambler()