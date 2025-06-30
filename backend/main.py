import uvicorn

from app_factory import create_app

# Crear la aplicación usando el factory
app = create_app()


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
