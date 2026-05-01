"""Authentication endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.core.deps import DBSession
from app.schemas.auth import LoginRequest, RefreshRequest, TokenPair
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/login", response_model=TokenPair, summary="Login with email + password")
async def login(
    db: DBSession,
    form: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> TokenPair:
    """OAuth2 password flow. The `username` field carries the user's email."""
    service = AuthService(db)
    user = await service.authenticate(form.username, form.password)
    return service.issue_tokens(user)


@router.post("/login/json", response_model=TokenPair, summary="Login (JSON body variant)")
async def login_json(payload: LoginRequest, db: DBSession) -> TokenPair:
    service = AuthService(db)
    user = await service.authenticate(payload.email, payload.password)
    return service.issue_tokens(user)


@router.post("/refresh", response_model=TokenPair, summary="Exchange a refresh token")
async def refresh(payload: RefreshRequest, db: DBSession) -> TokenPair:
    return await AuthService(db).refresh(payload.refresh_token)
