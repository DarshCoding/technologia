# Technologia

Modern starter for an ERP/quoting platform

- **Backend:** Python 3.12, FastAPI, SQLAlchemy 2 (async), Alembic, Pydantic v2, JWT auth, MySQL.
- **Frontend:** Vite + React 18 + TypeScript, TanStack Query/Router, Tailwind v4, shadcn/ui, Zustand, React Hook Form + Zod.
- **DevOps:** Docker Compose (api, web, mysql, adminer), pre-commit, GitHub Actions CI.

## Quick start (Docker)

```bash
cp .env.example .env
docker compose up --build
```

| Service | URL                              |
| ------- | -------------------------------- |
| API     | http://localhost:8000/docs       |
| Web     | http://localhost:5173            |
| Adminer | http://localhost:8080            |
| MySQL   | localhost:3307 (user `app`)      |

A default admin user is seeded on first boot:

- email: `admin@technologia.dev`
- password: `admin123`

## Local dev (without Docker)

### Backend

```bash
cd backend
python -m venv .venv && . .venv/Scripts/activate   # Windows
pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project layout

```
technologia/
├── backend/          FastAPI service (layered: route -> service -> repository -> model)
├── frontend/         Vite + React app (feature-folder structure)
├── docs/             Architecture notes
└── docker-compose.yml
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the design rationale, and the
[plan file](../.cursor/plans/) for the porting roadmap from `quoteplan/`.

## Sample modules

- **Auth** — JWT login + refresh, bcrypt password hashing.
- **Projects** — CRUD with filtering / pagination.
- **Items** — CRUD with SKU search.

Each module is a vertical slice (model, schema, repository, service, route, React page),
ready to copy when porting more modules from `quoteplan`.
