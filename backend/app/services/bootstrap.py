"""One-shot startup tasks (e.g. seeding the first admin user)."""

from loguru import logger

from app.core.config import settings
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.repositories.user_repository import UserRepository


async def seed_initial_admin() -> None:
    """Create the bootstrap admin if no users exist yet."""
    async with SessionLocal() as db:
        users = UserRepository(db)
        existing = await users.get_by_email(settings.FIRST_ADMIN_EMAIL)
        if existing:
            return
        if (await users.count()) > 0:
            return
        await users.create(
            email=settings.FIRST_ADMIN_EMAIL,
            full_name=settings.FIRST_ADMIN_NAME,
            hashed_password=hash_password(settings.FIRST_ADMIN_PASSWORD),
            is_active=True,
            is_superuser=True,
        )
        await db.commit()
        logger.info(f"Seeded initial admin user: {settings.FIRST_ADMIN_EMAIL}")
