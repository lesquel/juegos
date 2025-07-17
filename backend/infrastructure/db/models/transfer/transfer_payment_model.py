from sqlalchemy import Column, String, Float, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import Enum as SqlEnum
from sqlalchemy.orm import relationship
import uuid

from application.enums import TransferStateEnum
from ...base import Base
from ..common import TimeStampModelMixin


class TransferPaymentModel(Base, TimeStampModelMixin):
    __tablename__ = "transfer_payments"

    transfer_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
    )

    transfer_img = Column(String(255), nullable=False)
    transfer_amount = Column(Float, nullable=False)
    transfer_state = Column(
        SqlEnum(TransferStateEnum, name="transferstateenum", create_type=True),
        nullable=False,
        default=TransferStateEnum.PENDING,
    )
    transfer_description = Column(Text, nullable=True)

    user = relationship("UserModel", back_populates="transfers")

    def __repr__(self):
        return f"Transfer by {self.user.email} on {self.created_at} - Amount: {self.transfer_amount}"
