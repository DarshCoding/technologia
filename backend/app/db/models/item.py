"""Item ORM model.

Mirrors a small slice of the quoteplan `Item` controller / `Item_model`.
"""

from decimal import Decimal

from sqlalchemy import Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPKMixin


class Item(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "items"

    sku: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    unit: Mapped[str] = mapped_column(String(16), default="EA", nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(14, 4), default=0, nullable=False)
    category: Mapped[str | None] = mapped_column(String(64), index=True, nullable=True)
    tenant_id: Mapped[str | None] = mapped_column(String(64), index=True, nullable=True)

    def __repr__(self) -> str:
        return f"<Item {self.sku} {self.name}>"
