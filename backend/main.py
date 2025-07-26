import uvicorn
from app_setup import AppConfigurator

configurator = AppConfigurator()
app = configurator.create_app()


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
