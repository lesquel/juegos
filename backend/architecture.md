backend/
│
├── alembic.ini
├── alembic.md
├── main.py
├── jic.py
├── script_crear.py
├── requirements.txt
│
├── app_setup/
│   ├── __init__.py
│   ├── admin_setup.py
│   ├── app_configurator.py
│   ├── exception_handlers.py
│   ├── lifespan.py
│   ├── middlewares.py
│   ├── routers.py
│   └── admin/
│       ├── __init__.py
│       ├── admin_config.py
│       ├── authentication_backend.py
│       └── admin_views/
│
├── api/
│   ├── http/
│   │   ├── common/
│   │   ├── mixins/
│   │   └── routes/
│   └── websockets/
│
├── application/
│   ├── common/
│   ├── converters/
│   ├── mixins/
│   ├── services/
│   └── use_cases/
│
├── domain/
│   ├── constants/
│   ├── entities/
│   ├── enums/
│   ├── exceptions/
│   ├── interfaces/
│   ├── repositories/
│   └── services/
│
├── dtos/
│   ├── common/
│   ├── request/
│   └── response/
│
├── infrastructure/
│   ├── auth/
│   ├── core/
│   ├── db/
│   ├── dependencies/
│   ├── logging/
│   ├── middleware/
│   └── websockets/
│
├── uploads/
│   ├── categories/
│   ├── games/
│   └── transfers/
│
├── logs/
│   ├── dev_errors.log
│   └── dev.log
│
└── migrations/
    ├── env.py
    ├── README
    ├── script.py.mako
    └── versions/
