from sqlalchemy import Column, Float, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from infrastructure.db.models import user

from ...base import Base
from ..common import TimeStampModelMixin


class MatchModel(Base, TimeStampModelMixin):
    __tablename__ = "matches"

    match_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )

    game_id = Column(
        UUID(as_uuid=True),
        ForeignKey("games.game_id", ondelete="CASCADE"),
    )
    created_by_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
    )
    winner_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
        nullable=True,
    )

    base_bet_amount = Column(
        Float, default=0.0, comment="Monto base apostado en la partida"
    )

    game = relationship("GameModel", back_populates="matches")
    winner = relationship(
        "UserModel", back_populates="won_matches", foreign_keys=[winner_id]
    )

    participants = relationship(
        "MatchParticipationModel", back_populates="match", cascade="all, delete-orphan"
    )

    creator = relationship(
        "UserModel", back_populates="created_matches", foreign_keys=[created_by_id]
    )

    def __repr__(self):
        winner_info = f", winner={self.winner_id}" if self.winner_id else ", no winner"
        return f"<MatchModel(id={self.match_id}{winner_info})>"
