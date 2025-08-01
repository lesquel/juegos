import uuid

from domain.enums import GameTypeEnum
from sqlalchemy import Column, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.types import Enum as SqlEnum

from ...base import Base
from ..common import TimeStampModelMixin, game_categories


class GameModel(Base, TimeStampModelMixin):
    __tablename__ = "games"

    game_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    game_name = Column(String(100), nullable=False, unique=True, index=True)
    game_description = Column(Text, nullable=False)
    game_url = Column(String(255), nullable=False)
    game_img = Column(String(255))

    game_capacity = Column(Integer, nullable=False, default=1, index=True)

    house_odds = Column(Float, default=1.0, nullable=False)

    game_type = Column(
        SqlEnum(GameTypeEnum, name="gametype", create_type=True), nullable=False
    )

    categories = relationship(
        "CategoryModel", secondary=game_categories, back_populates="games"
    )
    reviews = relationship(
        "GameReviewModel", back_populates="game", cascade="all, delete-orphan"
    )
    matches = relationship(
        "MatchModel", back_populates="game", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"{self.game_name}"
