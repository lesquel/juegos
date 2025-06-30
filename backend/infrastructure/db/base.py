from sqlalchemy.orm import declarative_base

# Create the declarative base
Base = declarative_base()

from .models import *
