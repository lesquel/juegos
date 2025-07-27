import os

import sqladmin
import uvicorn
from app_setup import AppConfigurator
from fastapi.staticfiles import StaticFiles

configurator = AppConfigurator()
app = configurator.create_app()


sqladmin_static = os.path.join(os.path.dirname(sqladmin.__file__), "static")
app.mount(
    "/static/sqladmin", StaticFiles(directory=sqladmin_static), name="sqladmin-static"
)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)
