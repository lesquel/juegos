project/
│
├── app/                           # 🧠 Capa de dominio (entidades y lógica central)
│   ├── entities/
│   │   ├── __init__.py
│   │   └── user.py                # class User (entidad del dominio)
│   └── use_cases/                 # casos de uso
│       └── create_user.py         # lógica del caso de uso
│
├── infrastructure/               # 🧰 Adaptadores externos y frameworks
│   ├── core/
│   │   ├── __init__.py
│   │   ├── __init__.py
│   │   ├── settings_config.py     # configuración de la aplicación
│   │   ├── envs/                  # variables de entorno
│   │   └── specific_settings/     # configuraciones específicas
│   └── db/
│       ├── config.py              # configuración de base de datos
│       ├── connection.py          # conexión a la base de datos
│       └── postgres/
│           └── user_repository.py # implementación PostgreSQL del repositorio
│
├── interfaces/                    # 🎯 Adaptadores de entrada (API, CLI, etc.)
│   └── api/
│       ├── routes/
│       │   ├── __init__.py
│       │   ├── auth_routes.py     # rutas de autenticación
│       │   └── user_routes.py     # rutas de usuarios
│       ├── request_models/
│       │   └── user_input.py      # Pydantic models para entradas
│       └── response_models/
│           └── user_output.py     # Pydantic models para respuestas
│
├── data/                          # 📦 Repositorios genéricos y DTOs
│   ├── __init__.py
│   ├── repositories/
│   │   ├── __init__.py
│   │   └── user_repository.py     # interfaz abstracta del repositorio
│   └── dtos/
│       └── user_dto.py            # objeto de transferencia de datos
│
├── migrations/                    # 📊 Migraciones de base de datos (Alembic)
│   ├── env.py
│   ├── README
│   ├── script.py.mako
│   └── versions/                  # archivos de migración
│
├── main.py                        # 🚀 Punto de entrada de la aplicación
├── requirements.txt               # 📦 Dependencias de Python
├── alembic.ini                    # ⚙️ Configuración de Alembic
├── alembic.md                     # 📝 Documentación de Alembic
├── .gitignore                     # 🚫 Archivos ignorados por Git
├── .venv/                         # 🐍 Entorno virtual de Python
