import uuid

from domain.enums import AccountTypeEnum
from sqlalchemy import Column, ForeignKey, String, Text, event, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import relationship
from sqlalchemy.types import Enum as SqlEnum

from ..base import Base
from .common import TimeStampModelMixin


class AccountModel(Base, TimeStampModelMixin):
    __tablename__ = "accounts"

    account_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    account_owner_name = Column(String(100), nullable=False, unique=True, index=True)
    account_number = Column(String(100), nullable=False, unique=True, index=True)
    account_description = Column(Text, nullable=True)

    account_type = Column(
        SqlEnum(AccountTypeEnum, name="accounttype", create_type=True), nullable=False
    )
    app_info_id = Column(UUID(as_uuid=True), ForeignKey("app_info.app_info_id"))
    app_info = relationship("AppInfoModel", back_populates="accounts")

    def __repr__(self):
        return f"{self.account_owner_name}"


class AppInfoModel(Base, TimeStampModelMixin):
    __tablename__ = "app_info"
    app_info_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    site_name = Column(String(100), nullable=False, unique=True, index=True)
    site_icon = Column(String(250), nullable=False, unique=True, index=True)
    site_logo = Column(String(250), nullable=False, unique=True, index=True)
    accounts = relationship(
        "AccountModel",
        back_populates="app_info",
        cascade="all, delete-orphan",
        lazy="joined",
    )

    def __repr__(self):
        return f"{self.site_name}"


# Event listener para validar que solo existe un registro de AppInfoModel
@event.listens_for(AppInfoModel, "before_insert")
def validate_single_app_info(_mapper, connection, _target):
    """Valida que solo pueda existir un registro de AppInfoModel para admin"""
    # Verificar si ya existe un registro usando SQLAlchemy 2.x syntax
    # Usar text() para SQL raw
    result = connection.execute(
        text(f"SELECT COUNT(*) FROM {AppInfoModel.__tablename__}")
    ).scalar()

    if result > 0:
        raise IntegrityError(
            "Solo puede existir una configuración de aplicación. Use la opción de editar en lugar de crear una nueva.",
            None,
            None,
        )
