# Here Photos

[![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)](https://nx.dev/)
[![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)](https://sequelize.org/)
[![CLIP](https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/index/clip/)

---

A modern, high-performance photos app powered by AI.

![](https://cos.codec.wang/here-photos-github-cover.webp)

## Features

- Magage photos, medias and albums
- Responsive design and mobile friendly
- Face detection and object recognition
- Photo semantic understanding
- Search with natural language, tags, locations...
- [TODO] Support Live Photos
- [TODO] Generating memories

## Dev

### Architecture

This project is a mono-repo built by [Nx](https://nx.dev/getting-started/installation#installing-nx-globally).

![](https://cos.codec.wang/here-photos-nx-architecture.webp)

### Local development env

It's recommended to install [Nx](https://nx.dev/getting-started/installation#installing-nx-globally)(a monorepo tool) and [pnpm](https://pnpm.io/installation)(package manager) globally.

#### IDE

- If you are using [VSCode](https://code.visualstudio.com/), [here]() is a recommended profile you can directly use.

- If you are using [Webstorm](https://www.jetbrains.com/webstorm/), [Nx Console plugin](https://plugins.jetbrains.com/plugin/21060-nx-console) is recommended.

The overall process is: Setup mysql env -> Start backend -> Start frontend.

#### Init project

```bash
# Install npm dependencies
pnpm install

# Start backend service
nx serve api

# Start frontend UI/UX
nx dev web

# Graph dependencies within workspace
nx graph
```

## License

![License](https://img.shields.io/npm/l/nx.svg?style=flat-square)
