from sqlalchemy.orm import declarative_base

# Create the declarative base
Base = declarative_base()

# Import all models so they're registered with Base
# This is crucial for Alembic to detect them
from .models import *  # noqa: F401, F403
