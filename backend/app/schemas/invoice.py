from pydantic import BaseModel, Field
from typing import Optional


class ParsedItem(BaseModel):
    name: str
    quantity: int = 1
    unit: Optional[str] = None
    price: Optional[float] = None
    confidence: float = Field(default=1.0, ge=0, le=1)


class ParsedInvoice(BaseModel):
    items: list[ParsedItem]
    vendor_name: Optional[str] = None
    invoice_date: Optional[str] = None
    total_amount: Optional[float] = None
    raw_text: Optional[str] = None


class InvoiceParseRequest(BaseModel):
    text: Optional[str] = None
    image_base64: Optional[str] = None


class FlashSaleItem(BaseModel):
    item_id: int
    item_name: str
    days_to_expiry: int
    current_quantity: int
    suggested_discount: int = Field(..., ge=0, le=100)
    reason: str
