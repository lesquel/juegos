from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from ..base import Base

game_categories = Table(
    "game_categories",
    Base.metadata,
    Column(
        "game_id",
        UUID(as_uuid=True),
        ForeignKey("games.game_id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "category_id",
        UUID(as_uuid=True),
        ForeignKey("categories.category_id", ondelete="CASCADE"),
        primary_key=True,
    ),
)
