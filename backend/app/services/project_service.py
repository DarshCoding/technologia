"""Project service layer."""

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.project import Project, ProjectStatus
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = ProjectRepository(db)

    async def list(
        self,
        *,
        offset: int,
        limit: int,
        q: str | None = None,
        status: ProjectStatus | None = None,
    ) -> tuple[list[Project], int]:
        return await self.repo.search(offset=offset, limit=limit, q=q, status=status)

    async def get_or_404(self, project_id: str) -> Project:
        project = await self.repo.get(project_id)
        if project is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        return project

    async def create(self, data: ProjectCreate, *, created_by: str | None) -> Project:
        if await self.repo.get_by_code(data.code):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Project code '{data.code}' is already in use",
            )
        project = await self.repo.create(**data.model_dump(), created_by=created_by)
        await self.db.commit()
        return project

    async def update(self, project_id: str, data: ProjectUpdate) -> Project:
        project = await self.get_or_404(project_id)
        updated = await self.repo.update(project, **data.model_dump(exclude_unset=True))
        await self.db.commit()
        return updated

    async def delete(self, project_id: str) -> None:
        project = await self.get_or_404(project_id)
        await self.repo.delete(project)
        await self.db.commit()
