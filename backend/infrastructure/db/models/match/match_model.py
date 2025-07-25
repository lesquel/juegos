import uuid

from sqlalchemy import Boolean, Column, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

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

    game = relationship("GameModel", back_populates="matches", lazy="joined")
    winner = relationship(
        "UserModel", back_populates="won_matches", foreign_keys=[winner_id]
    )

    is_finished = Column(
        Boolean,
        default=False,
        comment="Indica si la partida ha finalizado",
    )

    participants = relationship(
        "MatchParticipationModel",
        back_populates="match",
        cascade="all, delete-orphan",
        lazy="joined",
    )

    creator = relationship(
        "UserModel", back_populates="created_matches", foreign_keys=[created_by_id]
    )

    def __repr__(self):
        winner_info = f", winner={self.winner_id}" if self.winner_id else ", no winner"
        return f"Match created by {self.created_by_id} with base bet {self.base_bet_amount} {winner_info}"
