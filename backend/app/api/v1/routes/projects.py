"""Projects endpoints."""

from fastapi import APIRouter, Query, status

from app.core.deps import CurrentUser, DBSession
from app.db.models.project import ProjectStatus
from app.schemas.common import Page
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.services.project_service import ProjectService

router = APIRouter()


@router.get("", response_model=Page[ProjectRead], summary="List projects")
async def list_projects(
    db: DBSession,
    _: CurrentUser,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=200),
    q: str | None = Query(None, description="Free-text search on code/name/customer"),
    status_filter: ProjectStatus | None = Query(None, alias="status"),
) -> Page[ProjectRead]:
    offset = (page - 1) * page_size
    items, total = await ProjectService(db).list(
        offset=offset, limit=page_size, q=q, status=status_filter
    )
    return Page[ProjectRead](
        items=[ProjectRead.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post(
    "",
    response_model=ProjectRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a project",
)
async def create_project(
    payload: ProjectCreate,
    db: DBSession,
    user: CurrentUser,
) -> ProjectRead:
    project = await ProjectService(db).create(payload, created_by=user.id)
    return ProjectRead.model_validate(project)


@router.get("/{project_id}", response_model=ProjectRead, summary="Get project by id")
async def get_project(project_id: str, db: DBSession, _: CurrentUser) -> ProjectRead:
    project = await ProjectService(db).get_or_404(project_id)
    return ProjectRead.model_validate(project)


@router.patch("/{project_id}", response_model=ProjectRead, summary="Update a project")
async def update_project(
    project_id: str,
    payload: ProjectUpdate,
    db: DBSession,
    _: CurrentUser,
) -> ProjectRead:
    project = await ProjectService(db).update(project_id, payload)
    return ProjectRead.model_validate(project)


@router.delete(
    "/{project_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a project"
)
async def delete_project(project_id: str, db: DBSession, _: CurrentUser) -> None:
    await ProjectService(db).delete(project_id)
