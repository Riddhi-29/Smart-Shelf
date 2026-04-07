from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional


class InventoryItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    quantity: int = Field(..., ge=0)
    unit: Optional[str] = Field(None, max_length=50)
    expiry_date: date
    category: Optional[str] = Field(None, max_length=100)
    purchase_price: Optional[float] = Field(None, ge=0)
    selling_price: Optional[float] = Field(None, ge=0)


class InventoryItemCreate(InventoryItemBase):
    pass


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    quantity: Optional[int] = Field(None, ge=0)
    unit: Optional[str] = Field(None, max_length=50)
    expiry_date: Optional[date] = None
    category: Optional[str] = Field(None, max_length=100)
    purchase_price: Optional[float] = Field(None, ge=0)
    selling_price: Optional[float] = Field(None, ge=0)


class InventoryItemResponse(InventoryItemBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InventoryItemList(BaseModel):
    items: list[InventoryItemResponse]
    total: int
    page: int
    page_size: int
    pages: int
