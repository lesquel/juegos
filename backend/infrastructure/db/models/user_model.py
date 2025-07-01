from sqlalchemy import Column, String, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import Enum as SqlEnum
from sqlalchemy.orm import relationship
import uuid

from ..base import Base
from application.enums import UserRole

from .time_stamp_model_mixin import TimeStampModelMixin


class UserModel(Base, TimeStampModelMixin):
    __tablename__ = "users"

    user_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    virtual_currency = Column(Float, default=0.0, nullable=False)

    role = Column(
        SqlEnum(UserRole, name="userrole", create_type=True),
        default=UserRole.USER,
        nullable=False,
    )

    reviews = relationship(
        "GameReviewModel", back_populates="user", cascade="all, delete-orphan"
    )
    transfers = relationship(
        "TransferPaymentModel", back_populates="user", cascade="all, delete-orphan"
    )
    won_matches = relationship(
        "MatchModel",
        back_populates="winner",
        foreign_keys="[MatchModel.winner_id]",
    )
    match_participations = relationship(
        "MatchParticipationModel", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<UserModel(user_id={self.user_id}, username='{self.username}', email='{self.email}')>"
