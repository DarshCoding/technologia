"""Item service layer."""

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.item import Item
from app.repositories.item_repository import ItemRepository
from app.schemas.item import ItemCreate, ItemUpdate


class ItemService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = ItemRepository(db)

    async def list(
        self,
        *,
        offset: int,
        limit: int,
        q: str | None = None,
        category: str | None = None,
    ) -> tuple[list[Item], int]:
        return await self.repo.search(offset=offset, limit=limit, q=q, category=category)

    async def get_or_404(self, item_id: str) -> Item:
        item = await self.repo.get(item_id)
        if item is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
        return item

    async def create(self, data: ItemCreate) -> Item:
        if await self.repo.get_by_sku(data.sku):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Item SKU '{data.sku}' is already in use",
            )
        item = await self.repo.create(**data.model_dump())
        await self.db.commit()
        return item

    async def update(self, item_id: str, data: ItemUpdate) -> Item:
        item = await self.get_or_404(item_id)
        updated = await self.repo.update(item, **data.model_dump(exclude_unset=True))
        await self.db.commit()
        return updated

    async def delete(self, item_id: str) -> None:
        item = await self.get_or_404(item_id)
        await self.repo.delete(item)
        await self.db.commit()
