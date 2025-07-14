from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from ...base import Base
from ..common import TimeStampModelMixin, game_categories


class CategoryModel(Base, TimeStampModelMixin):
    __tablename__ = "categories"

    category_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )

    category_name = Column(String(100), unique=True, nullable=False, index=True)
    category_img = Column(String(255), nullable=True)
    category_description = Column(Text, nullable=True)

    games = relationship(
        "GameModel", secondary=game_categories, back_populates="categories"
    )

    def __repr__(self):
        return f"<CategoryModel(id={self.category_id}, name='{self.category_name}')>"
