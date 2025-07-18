# Sistema de Juegos Backend 🎮

API Backend para un sistema de juegos con autenticación JWT, gestión de usuarios, juegos, partidas y pagos.

## 🚀 Características

- **Arquitectura Limpia**: Separación clara entre Domain, Application e Infrastructure
- **API RESTful**: Endpoints bien documentados con FastAPI
- **Autenticación JWT**: Sistema de autenticación seguro
- **Base de Datos**: PostgreSQL con SQLAlchemy y migraciones Alembic
- **Panel de Administración**: Interface web para gestión
- **Validación Robusta**: Validación de datos con Pydantic
- **Logging**: Sistema de logging estructurado
- **Dockerizado**: Contenedores para desarrollo y producción
- **Testing**: Suite de tests con pytest
- **Calidad de Código**: Pre-commit hooks, linting, formateo

## 🛠️ Tecnologías

- **Framework**: FastAPI
- **Base de Datos**: PostgreSQL + SQLAlchemy
- **Autenticación**: JWT con passlib
- **Validación**: Pydantic
- **Admin**: SQLAdmin
- **Testing**: pytest + pytest-asyncio
- **Formateo**: Black + isort
- **Linting**: flake8 + mypy
- **Containerización**: Docker + Docker Compose

## 📁 Estructura del Proyecto

```
backend/
├── app_setup/              # Configuración de la aplicación
├── application/            # Lógica de aplicación
│   ├── converters/         # Conversores DTO ↔ Entidades
│   ├── enums/             # Enumeraciones
│   ├── interfaces/        # Interfaces de aplicación
│   ├── mixins/            # Mixins reutilizables
│   ├── services/          # Servicios de aplicación
│   └── use_cases/         # Casos de uso
├── domain/                # Dominio de negocio
│   ├── entities/          # Entidades de dominio
│   ├── exceptions/        # Excepciones específicas
│   ├── interfaces/        # Interfaces de dominio
│   ├── repositories/      # Interfaces de repositorios
│   └── services/          # Servicios de dominio
├── infrastructure/        # Infraestructura
│   ├── auth/             # Autenticación
│   ├── core/             # Configuración central
│   ├── db/               # Base de datos
│   ├── dependencies/     # Inyección de dependencias
│   ├── logging/          # Sistema de logging
│   └── middleware/       # Middlewares
├── interfaces/           # Interfaces externas
│   └── api/              # API REST
├── dtos/                 # Data Transfer Objects
│   ├── request/          # DTOs de entrada
│   └── response/         # DTOs de salida
├── migrations/           # Migraciones de DB
├── logs/                 # Archivos de log
├── uploads/              # Archivos subidos
└── tests/                # Tests
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Python 3.11+
- PostgreSQL 15+
- Docker (opcional)

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd juegos/backend
```

2. **Crear entorno virtual**
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Para desarrollo
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

5. **Ejecutar migraciones**
```bash
alembic upgrade head
```

6. **Ejecutar la aplicación**
```bash
python main.py
```

## 📊 API Endpoints

### Documentación

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Principales Endpoints

```
Health & Monitoring:
GET  /health              # Health check
GET  /health/stats         # Estadísticas del sistema

Authentication:
POST /auth/login          # Login
POST /auth/register       # Registro

Users:
GET  /users               # Listar usuarios
GET  /users/{id}          # Obtener usuario
PUT  /users/{id}          # Actualizar usuario

Games:
GET  /games               # Listar juegos
POST /games               # Crear juego
GET  /games/{id}          # Obtener juego
PUT  /games/{id}          # Actualizar juego

Matches:
GET  /matches             # Listar partidas
POST /matches             # Crear partida
GET  /matches/{id}        # Obtener partida
POST /matches/{id}/join   # Unirse a partida

Transfers:
GET  /transfers           # Listar transferencias
POST /transfers           # Crear transferencia
```

## 🛡️ Seguridad

- **JWT Tokens**: Autenticación mediante tokens seguros
- **Validación de Entrada**: Validación estricta con Pydantic
- **CORS**: Configuración CORS restrictiva
- **Rate Limiting**: Limitación de requests (configurable)
- **Sanitización**: Sanitización de datos de entrada
- **Secrets Management**: Gestión segura de secretos

## 📈 Monitoreo

### Health Checks

```bash
# Health check básico
curl http://localhost:8000/health

# Estadísticas detalladas
curl http://localhost:8000/health/stats
```

### Métricas

- **Tiempo de respuesta**: Medición automática
- **Contadores de requests**: Tracking de peticiones
- **Errores**: Logging y tracking de errores
- **Uso de recursos**: Monitoreo de CPU y memoria


## 🚀 Deployment

### Producción

1. **Configurar variables de entorno de producción**
2. **Ejecutar migraciones**: `alembic upgrade head`
3. **Construir imagen**: `docker build -t juegos-backend .`
4. **Ejecutar contenedor**: `docker run -p 8000:8000 juegos-backend`


## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Guías de Contribución

- Seguir el estilo de código existente
- Escribir tests para nuevas funcionalidades
- Actualizar documentación si es necesario
- Ejecutar `make quality` antes de crear PR

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentación**: [Wiki](https://github.com/your-repo/wiki)
- **Email**: support@example.com

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- Lanzamiento inicial
- API completa de juegos
- Sistema de autenticación JWT
- Panel de administración
- Documentación completa

---

**Desarrollado con ❤️ por [Tu Nombre]**
