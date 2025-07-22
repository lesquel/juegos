import uuid

from sqlalchemy import Column, Float, Integer, String, Text, event
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.exc import IntegrityError

from .common import TimeStampModelMixin
from ..base import Base

class AccountModel(Base,TimeStampModelMixin):
    __tablename__ = "accounts"

    accound_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    account_onwer_name = Column(String(100), nullable=False, unique=True, index=True)
    account_number = Column(String(100), nullable=False, unique=True, index=True)
    account_description = Column(Text, nullable=True)

    def __repr__(self):
        return f"{self.account_onwer_name}"
    



class AppInfoModel(Base,TimeStampModelMixin):
    __tablename__ = "app_info"
    site_name = Column(String(100), nullable=False, unique=True, index=True)
    site_icon = Column(String(100), nullable=False, unique=True, index=True)
    site_logo = Column(String(100), nullable=False, unique=True, index=True)
    accounts = relationship(
        "AccountModel", back_populates="app_info", cascade="all, delete-orphan", lazy="joined")
    
    def __repr__(self):
        return f"{self.site_name}"


# Event listener para validar que solo existe un registro de AppInfoModel
@event.listens_for(AppInfoModel, 'before_insert')
def validate_single_app_info(mapper, connection, target):
    """Valida que solo pueda existir un registro de AppInfoModel para admin"""
    # Verificar si ya existe un registro
    result = connection.execute(
        f"SELECT COUNT(*) FROM {AppInfoModel.__tablename__}"
    ).scalar()
    
    if result > 0:
        raise IntegrityError(
            "Solo puede existir una configuración de aplicación. Use la opción de editar en lugar de crear una nueva.",
            None,
            None
        )