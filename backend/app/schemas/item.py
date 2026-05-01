"""Item Pydantic schemas."""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ItemBase(BaseModel):
    sku: str = Field(min_length=1, max_length=64)
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    unit: str = Field(default="EA", max_length=16)
    unit_price: Decimal = Field(default=Decimal("0"), ge=0, max_digits=14, decimal_places=4)
    category: str | None = Field(default=None, max_length=64)


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    unit: str | None = Field(default=None, max_length=16)
    unit_price: Decimal | None = Field(default=None, ge=0, max_digits=14, decimal_places=4)
    category: str | None = Field(default=None, max_length=64)


class ItemRead(ItemBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
