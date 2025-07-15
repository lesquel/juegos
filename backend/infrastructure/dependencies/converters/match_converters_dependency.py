"""Match converters dependencies."""

from application.converters.match.match_converter import MatchConverter
from application.converters.match.match_participation_converter import MatchParticipationConverter


def get_match_converter() -> MatchConverter:
    """Get match converter dependency."""
    return MatchConverter()


def get_match_participation_converter() -> MatchParticipationConverter:
    """Get match participation converter dependency."""
    return MatchParticipationConverter()
