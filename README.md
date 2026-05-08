# MOVA

App full stack con frontend en React/Vite y backend en Express conectado a MongoDB.

## Requisitos

- Node.js
- npm
- MongoDB Atlas o una instancia compatible

## Configuracion

1. Instalar dependencias:

```bash
npm --prefix client install
npm --prefix server install
```

2. Crear `server/.env` a partir de `server/.env.example` y completar `MONGODB_URI`.

3. Correr front y back juntos:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:4000`
