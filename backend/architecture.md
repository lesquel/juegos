project/
│
├── app/                           # 🧠 Capa de dominio (entidades y lógica central)
│   ├── __init__.py
│   ├── entities/
│   │   ├── __init__.py
│   │   └── game.py                # class Game (entidad del dominio)
│   └── use_cases/
│       ├── __init__.py
│       └── create_game.py        # lógica del caso de uso
│
├── infrastructure/               # 🧰 Adaptadores externos y frameworks
│   ├── __init__.py
│   ├── db/
│   │   ├── __init__.py
│   │   └── game_repository.py    # implementación concreta del repositorio (ej. MongoDB)
│   └── auth/
│       └── jwt_handler.py        # librerías externas de JWT
│
├── interfaces/                   # 🎯 Adaptadores de entrada (API, CLI, etc.)
│   ├── __init__.py
│   └── api/
│       ├── __init__.py
│       ├── routes/
│       │   ├── __init__.py
│       │   └── game_routes.py    # FastAPI routers
│       └── request_models/
│           └── game_input.py     # Pydantic models para entradas
│
├── data/                         # 📦 Repositorios genéricos y DTOs
│   ├── __init__.py
│   ├── repositories/
│   │   ├── __init__.py
│   │   └── game_repository.py    # interfaz abstracta del repositorio
│   └── dtos/
│       └── game_dto.py           # objeto de transferencia de datos
│
├── main.py                       # 🚀 Punto de entrada de la aplicación
├── requirements.txt              # 📦 Dependencias
└── README.md
