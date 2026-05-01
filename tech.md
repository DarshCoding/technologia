Context

quoteplan/ is a CodeIgniter 3 PHP ERP/quoting/MRP suite (~80 controllers, ~40 models) covering Projects, BOM, PO, GRN, Items, Sales Orders, Invoices, plus integrations (QuickBooks, Sage, Salesforce, Zoho, Deltek). DB is MySQL with a multi-tenant instance_name pattern (see quoteplan/application/models/Login_model.php and quoteplan/application/config/database.php). The new technologia/ will not port any business code yet — it sets up a clean, modern foundation that mirrors the domain shape so future modules can drop in cleanly.

Tech stack (trending, professional, 2026-current)





Backend: Python 3.12, FastAPI, SQLAlchemy 2.x (async), Alembic, Pydantic v2, Uvicorn, MySQL (PyMySQL/aiomysql), passlib[bcrypt], python-jose (JWT), pytest, ruff + black, mypy.



Frontend: Vite + React 18 + TypeScript, TanStack Query v5, TanStack Router, Tailwind v4, shadcn/ui, Zustand, React Hook Form + Zod, Axios, ESLint + Prettier, Vitest.



DevOps: Docker + docker-compose (api, web, mysql, adminer), .env + pydantic-settings, GitHub Actions CI stub, pre-commit.

Target folder layout

technologia/
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── backend/
│   ├── pyproject.toml
│   ├── alembic.ini
│   ├── Dockerfile
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/0001_init.py
│   └── app/
│       ├── main.py                # FastAPI app + CORS + routers
│       ├── core/
│       │   ├── config.py          # pydantic-settings
│       │   ├── security.py        # bcrypt + JWT (mirrors password_hash from Login_model)
│       │   ├── deps.py            # get_db, get_current_user
│       │   └── logging.py
│       ├── db/
│       │   ├── base.py            # DeclarativeBase
│       │   ├── session.py         # async engine + SessionLocal
│       │   └── models/            # User, Project, Item
│       ├── api/
│       │   └── v1/
│       │       ├── router.py
│       │       └── routes/        # auth.py, users.py, projects.py, items.py, health.py
│       ├── schemas/               # Pydantic v2 DTOs
│       ├── services/              # business logic per module
│       ├── repositories/          # DB access per module
│       └── tests/
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── app/
│       │   ├── router.tsx         # TanStack Router
│       │   ├── providers.tsx      # QueryClientProvider, Theme
│       │   └── layout/AppShell.tsx
│       ├── features/
│       │   ├── auth/              # login page, useAuth, store
│       │   ├── projects/          # list + detail + create
│       │   └── items/             # list + create
│       ├── components/ui/         # shadcn/ui generated primitives
│       ├── lib/
│       │   ├── api.ts             # axios instance + JWT interceptor
│       │   └── queryClient.ts
│       ├── stores/auth.store.ts   # Zustand
│       └── styles/globals.css
└── docs/
    └── ARCHITECTURE.md

Sample modules included

Chosen because they are the smallest, most-referenced entities in quoteplan and unblock porting later:





User + Auth — JWT login, bcrypt password (mirrors the password_hash($pw, PASSWORD_BCRYPT) already used in quoteplan/application/models/Login_model.php). Endpoints: POST /api/v1/auth/login, POST /api/v1/auth/refresh, GET /api/v1/users/me.



Project — fields: id, code, name, customer, status, start_date, end_date, created_by, created_at. CRUD + list with pagination/filter.



Item — fields: id, sku, name, description, unit, unit_price, category, created_at. CRUD + list.

Each module ships full vertical slice: SQLAlchemy model → Pydantic schema → repository → service → FastAPI route → React page (list + form) wired via TanStack Query.

Architecture flow

flowchart LR
    Browser[React Vite SPA] -- "Axios + JWT" --> API[FastAPI app]
    API --> Services[Service layer]
    Services --> Repos[Repository layer]
    Repos --> DB[(MySQL)]
    API -- OpenAPI --> Browser
    Compose[docker-compose] --> API
    Compose --> DB
    Compose --> Web[Vite dev server]
    Compose --> Adminer

Key conventions





Backend: layered (route → service → repository → model). Async SQLAlchemy. UUID PKs. created_at/updated_at mixin. Settings via env. JWT with access + refresh tokens. CORS restricted via env. Errors via FastAPI exception handlers returning RFC7807-style JSON.



Frontend: feature-folder structure (not type-folder). All server state via TanStack Query (no Redux for server state). Zustand only for UI/auth state. Forms via React Hook Form + Zod. UI primitives via shadcn/ui (radix-based, accessible). Tailwind v4 with CSS-variable themes (light/dark).



Code quality: ruff + black + mypy (backend), eslint + prettier + tsc (frontend), pre-commit config, GitHub Actions CI workflow that runs lint + tests for both apps.



Multi-tenant note: quoteplan uses an instance_name per-customer DB convention. The scaffold leaves a tenant_id column + X-Tenant-ID header hook stubbed in core/deps.py so it can be activated when porting later, but defaults to single-tenant.

What this plan does NOT do





No port of the 80 controllers / 40 models from quoteplan (per your "scaffold only" choice). The scaffold is structured so each quoteplan controller maps to one folder under backend/app/api/v1/routes/ + a service + a repo, and each model maps to one file under backend/app/db/models/.



No QuickBooks/Sage/Salesforce/Zoho/Deltek integrations — directory backend/app/integrations/ is created empty with a README placeholder.



No SpreadJS / SOAP / Chatbot — folders left out; can be added later.

How to run after I build it

cd technologia
cp .env.example .env
docker compose up --build
# API:      http://localhost:8000/docs
# Web:      http://localhost:5173
# Adminer:  http://localhost:8080

