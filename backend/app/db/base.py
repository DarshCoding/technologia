"""SQLAlchemy declarative base and shared mixins."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Common declarative base for all ORM models."""


def _uuid() -> str:
    return str(uuid.uuid4())


class UUIDPKMixin:
    """Adds a UUID primary key stored as CHAR(36) (portable across MySQL/SQLite)."""

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=_uuid,
    )


class TimestampMixin:
    """Adds created_at / updated_at timestamps."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


def import_models() -> None:
    """Import all model modules so that Base.metadata is fully populated.

    Used by Alembic and by initial DB creation in tests.
    """
    from app.db.models import item, project, user  # noqa: F401
