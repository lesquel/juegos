# Astro Starter Kit: Basics

```sh
bun create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
my-app/
├── public/
│   └── assets/             # Imágenes globales
├── src/
│   ├── modules/
│   │   ├── home/
│   │   │   ├── components/     # Componentes React específicos de home
│   │   │   ├── pages/          # Rutas específicas del módulo
│   │   │   │   └── index.astro
│   │   │   ├── sections/       # Secciones Astro (hero, banner, etc.)
│   │   │   └── styles/
│   │   │       └── home.css
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── login.astro
│   │   │   │   └── register.astro
│   │   │   └── services/       # Lógica para autenticación
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   └── index.astro
│   │   │   └── hooks/
│   │   │       └── useStats.jsx
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── shared/             # Componentes o utilidades comunes
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   └── Navbar.astro
│   │   ├── hooks/
│   │   │   └── useTheme.jsx
│   │   ├── styles/
│   │   │   └── global.css
│   │   └── utils/
│   │       └── api.js
│   └── config/
│       └── site.config.js
├── astro.config.mjs
├── package.json
└── tailwind.config.js

```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
