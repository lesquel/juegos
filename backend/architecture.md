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
│       └── response_models/
│           └── user_output.py     # Pydantic models para respuestas (legacy)
│
├── dtos/                          # 📦 Objetos de transferencia de datos centralizados
│   ├── __init__.py
│   ├── request/                   # DTOs para requests/peticiones
│   │   ├── __init__.py
│   │   ├── auth_request_dto.py    # DTOs para autenticación
│   │   ├── user_request_dto.py    # DTOs para usuarios
│   │   └── validators.py          # Validadores para DTOs
│   ├── response/                  # DTOs para responses/respuestas
│   │   ├── __init__.py
│   │   ├── auth_response_dto.py   # DTOs de respuesta de auth
│   │   └── user_response_dto.py   # DTOs de respuesta de usuarios
│   └── common/                    # DTOs comunes
│       ├── __init__.py
│       ├── paginated_response_dto.py # DTOs para paginación
│       └── user_dto.py            # DTO común de usuario
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
