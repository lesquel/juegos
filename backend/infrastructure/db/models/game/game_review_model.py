import uuid

from sqlalchemy import Column, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from ...base import Base
from ..common import TimeStampModelMixin


class GameReviewModel(Base, TimeStampModelMixin):
    __tablename__ = "game_reviews"

    review_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )

    game_id = Column(
        UUID(as_uuid=True),
        ForeignKey("games.game_id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
    )

    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)

    game = relationship("GameModel", back_populates="reviews")
    user = relationship("UserModel", back_populates="reviews")

    def __repr__(self):
        return f"Review by {self.user.email}: {self.comment[:20]}... on game {self.game.game_name}"
