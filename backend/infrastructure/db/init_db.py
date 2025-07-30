from sqlalchemy import create_engine

from .base import Base
from .config import get_postgres_url


def create_tables():
    """Create all tables in the database."""
    engine = create_engine(get_postgres_url())

    Base.metadata.create_all(bind=engine)


def drop_tables():
    """Drop all tables in the database."""
    engine = create_engine(get_postgres_url())

    Base.metadata.drop_all(bind=engine)


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "drop":
        drop_tables()
    else:
        create_tables()
