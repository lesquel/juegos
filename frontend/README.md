# 🚀 Astro Modular Project con React + Bun

Este proyecto usa **Astro** como framework principal, **React** para componentes interactivos y **Bun** como gestor de paquetes y entorno de ejecución.

---

## 📁 Estructura del Proyecto

```bash
src/
├── all-games/              # Lógica relacionada a todos los juegos
├── auth/                   # Módulo de autenticación
│   ├── components/
│   ├── config/
│   ├── models/
│   ├── services/
│   └── games/
├── marketplace/            # Juegos dentro del marketplace
│   ├── do-not-make/
│   ├── drive/
│   ├── golfrog/
│   ├── lost-city/
│   ├── puzle/
│   └── srmcgann/
├── assets/                 # Recursos como imágenes, íconos, etc.
├── components/             # Componentes globales (React o Astro)
├── config/                 # Configuraciones generales del sitio
├── layouts/                # Layouts compartidos para las páginas
├── modules/                # Otros módulos reutilizables
├── pages/                  # Rutas principales del sitio (file-based routing)
│   └── play/marketplace/
│       ├── doNotMake.astro
│       ├── drive.astro
│       ├── golfrog.astro
│       ├── lostCity.astro
│       ├── puzle.astro
│       ├── srmcgann.astro
│       └── index.astro
├── providers/              # Providers globales como QueryProvider
│   └── QueryProvider.tsx
├── styles/                 # Estilos globales
│   └── global.css
└── utils/                  # Funciones utilitarias

## 🧞 Commands

Todos los comandos se ejecutan desde la raíz del proyecto, desde un terminal en frontend:

| Comando               | Descripción                                         |
| --------------------- | --------------------------------------------------- |
| `bun install`         | Instala las dependencias                            |
| `bun dev`             | Inicia el servidor de desarrollo (`localhost:4321`) |
| `bun build`           | Genera el sitio para producción en `./dist/`        |
| `bun preview`         | Previsualiza el sitio en producción localmente      |
| `bun astro ...`       | Ejecuta comandos de la CLI de Astro                 |
| `bun astro -- --help` | Muestra ayuda para la CLI de Astro                  |
