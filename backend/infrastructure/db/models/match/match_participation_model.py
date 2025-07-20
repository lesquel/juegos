import uuid

from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from ...base import Base
from ..common import TimeStampModelMixin


class MatchParticipationModel(Base, TimeStampModelMixin):
    __tablename__ = "match_participations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    match_id = Column(
        UUID(as_uuid=True),
        ForeignKey("matches.match_id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
    )

    score = Column(Integer, nullable=False)

    match = relationship("MatchModel", back_populates="participants", lazy="joined")
    user = relationship(
        "UserModel", back_populates="match_participations", lazy="joined"
    )

    def __repr__(self):
        return (
            f"<{self.user.email} in {self.match.game.game_name} - Score: {self.score}>"
        )
