"""Items endpoints."""

from fastapi import APIRouter, Query, status

from app.core.deps import CurrentUser, DBSession
from app.schemas.common import Page
from app.schemas.item import ItemCreate, ItemRead, ItemUpdate
from app.services.item_service import ItemService

router = APIRouter()


@router.get("", response_model=Page[ItemRead], summary="List items")
async def list_items(
    db: DBSession,
    _: CurrentUser,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=200),
    q: str | None = Query(None, description="Free-text search on sku/name"),
    category: str | None = Query(None),
) -> Page[ItemRead]:
    offset = (page - 1) * page_size
    items, total = await ItemService(db).list(
        offset=offset, limit=page_size, q=q, category=category
    )
    return Page[ItemRead](
        items=[ItemRead.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post(
    "", response_model=ItemRead, status_code=status.HTTP_201_CREATED, summary="Create an item"
)
async def create_item(payload: ItemCreate, db: DBSession, _: CurrentUser) -> ItemRead:
    item = await ItemService(db).create(payload)
    return ItemRead.model_validate(item)


@router.get("/{item_id}", response_model=ItemRead, summary="Get item by id")
async def get_item(item_id: str, db: DBSession, _: CurrentUser) -> ItemRead:
    item = await ItemService(db).get_or_404(item_id)
    return ItemRead.model_validate(item)


@router.patch("/{item_id}", response_model=ItemRead, summary="Update an item")
async def update_item(
    item_id: str, payload: ItemUpdate, db: DBSession, _: CurrentUser
) -> ItemRead:
    item = await ItemService(db).update(item_id, payload)
    return ItemRead.model_validate(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete an item")
async def delete_item(item_id: str, db: DBSession, _: CurrentUser) -> None:
    await ItemService(db).delete(item_id)
