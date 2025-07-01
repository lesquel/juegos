from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from ..base import Base
from .time_stamp_model_mixin import TimeStampModelMixin


class MatchModel(Base, TimeStampModelMixin):
    __tablename__ = "matches"

    match_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )

    game_id = Column(UUID(as_uuid=True), ForeignKey("games.game_id", ondelete="CASCADE"), nullable=False)
    winner_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)

    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)

    game = relationship("GameModel", back_populates="matches")
    winner = relationship("UserModel", back_populates="won_matches", foreign_keys=[winner_id])

    participants = relationship("MatchParticipationModel", back_populates="match", cascade="all, delete-orphan")
    

    def __repr__(self):
        return (
            f"<MatchModel(match_id={self.match_id}, game_id={self.game_id}, "
            f"start_time={self.start_time}, end_time={self.end_time}, winner_id={self.winner_id})>"
        )
