from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class NearExpiryItemWithDiscount(BaseModel):
    id: int
    name: str
    quantity: int
    unit: Optional[str] = None
    expiry_date: date
    category: Optional[str] = None
    selling_price: Optional[float] = None
    days_to_expiry: int
    discount_percent: int
    discounted_price: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AlertSummary(BaseModel):
    low_stock_count: int
    near_expiry_count: int
    low_stock_items: list["InventoryItemResponse"]
    near_expiry_items: list[NearExpiryItemWithDiscount]


from .inventory import InventoryItemResponse

AlertSummary.model_rebuild()
