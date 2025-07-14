from sqlalchemy import Column, DateTime, func


class TimeStampModelMixin:
    """Mixin para agregar timestamps automáticos a los modelos"""

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
