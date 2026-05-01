"""Item repository."""

from sqlalchemy import func, or_, select

from app.db.models.item import Item
from app.repositories.base import BaseRepository


class ItemRepository(BaseRepository[Item]):
    model = Item

    async def get_by_sku(self, sku: str) -> Item | None:
        stmt = select(Item).where(Item.sku == sku)
        return (await self.db.execute(stmt)).scalar_one_or_none()

    async def search(
        self,
        *,
        offset: int,
        limit: int,
        q: str | None = None,
        category: str | None = None,
    ) -> tuple[list[Item], int]:
        stmt = select(Item)
        count_stmt = select(func.count()).select_from(Item)

        if q:
            like = f"%{q}%"
            cond = or_(Item.sku.ilike(like), Item.name.ilike(like))
            stmt = stmt.where(cond)
            count_stmt = count_stmt.where(cond)
        if category:
            stmt = stmt.where(Item.category == category)
            count_stmt = count_stmt.where(Item.category == category)

        stmt = stmt.order_by(Item.created_at.desc()).offset(offset).limit(limit)
        rows = list((await self.db.execute(stmt)).scalars().all())
        total = int((await self.db.execute(count_stmt)).scalar_one())
        return rows, total
