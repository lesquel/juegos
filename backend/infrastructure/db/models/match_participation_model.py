from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from ..base import Base
from .time_stamp_model_mixin import TimeStampModelMixin


class MatchParticipationModel(Base, TimeStampModelMixin):
    __tablename__ = "match_participations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    match_id = Column(UUID(as_uuid=True), ForeignKey("matches.match_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)

    score = Column(Integer, nullable=False)
    bet_amount = Column(Float, default=0.0, nullable=False)

    match = relationship("MatchModel", back_populates="participants")
    user = relationship("UserModel", back_populates="match_participations")

    def __repr__(self):
        return (
            f"<MatchParticipationModel(match_id={self.match_id}, user_id={self.user_id}, "
            f"score={self.score}, bet_amount={self.bet_amount})>"
        )
