from sqlalchemy import Column, String, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import Enum as SqlEnum
from sqlalchemy.orm import relationship
import uuid

from ...base import Base
from application.enums import UserRole
from ..common import TimeStampModelMixin


ON_DELETE_CASCADE = "all, delete-orphan"

class UserModel(Base, TimeStampModelMixin):
    __tablename__ = "users"

    user_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    virtual_currency = Column(Float, default=0.0, nullable=False)

    role = Column(
        SqlEnum(UserRole, name="userrole", create_type=True),
        default=UserRole.USER,
        nullable=False,
    )

    reviews = relationship(
        "GameReviewModel", back_populates="user", cascade=ON_DELETE_CASCADE
    )
    transfers = relationship(
        "TransferPaymentModel", back_populates="user", cascade=ON_DELETE_CASCADE
    )
    won_matches = relationship(
        "MatchModel",
        back_populates="winner",
        foreign_keys="[MatchModel.winner_id]",
    )
    match_participations = relationship(
        "MatchParticipationModel", back_populates="user", cascade=ON_DELETE_CASCADE
    )

    created_matches = relationship(
        "MatchModel",
        back_populates="creator",
        foreign_keys="[MatchModel.created_by_id]",
    )

    def __repr__(self):
        return f"{self.email}"
