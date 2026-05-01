"""Project repository."""

from sqlalchemy import func, or_, select

from app.db.models.project import Project, ProjectStatus
from app.repositories.base import BaseRepository


class ProjectRepository(BaseRepository[Project]):
    model = Project

    async def get_by_code(self, code: str) -> Project | None:
        stmt = select(Project).where(Project.code == code)
        return (await self.db.execute(stmt)).scalar_one_or_none()

    async def search(
        self,
        *,
        offset: int,
        limit: int,
        q: str | None = None,
        status: ProjectStatus | None = None,
    ) -> tuple[list[Project], int]:
        stmt = select(Project)
        count_stmt = select(func.count()).select_from(Project)

        if q:
            like = f"%{q}%"
            cond = or_(Project.code.ilike(like), Project.name.ilike(like), Project.customer.ilike(like))
            stmt = stmt.where(cond)
            count_stmt = count_stmt.where(cond)
        if status is not None:
            stmt = stmt.where(Project.status == status)
            count_stmt = count_stmt.where(Project.status == status)

        stmt = stmt.order_by(Project.created_at.desc()).offset(offset).limit(limit)
        rows = list((await self.db.execute(stmt)).scalars().all())
        total = int((await self.db.execute(count_stmt)).scalar_one())
        return rows, total
