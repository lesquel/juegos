import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TimeStampBase(BaseModel):
    created_at: Optional[datetime.datetime] = Field(
        None, description="Fecha de creación"
    )
    updated_at: Optional[datetime.datetime] = Field(
        None, description="Fecha de última actualización"
    )
