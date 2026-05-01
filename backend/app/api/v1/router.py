"""Aggregated v1 API router."""

from fastapi import APIRouter

from app.api.v1.routes import auth, health, items, projects, users

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
