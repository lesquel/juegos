from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


from .config import get_postgres_url

DATABASE_URL = get_postgres_url()

engine = create_engine(
    DATABASE_URL
)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)




def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
