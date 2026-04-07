from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, timedelta

from app.core.database import get_db
from app.schemas import (
    InvoiceParseRequest,
    ParsedInvoice,
    InventoryItemResponse,
    InventoryItemCreate,
)
from app.services import parse_invoice_text, parse_invoice_image, normalize_product_name
from app.crud import inventory as crud

router = APIRouter(prefix="/invoice", tags=["invoice"])


@router.post("/parse", response_model=ParsedInvoice)
async def parse_invoice(request: InvoiceParseRequest):
    if request.image_base64:
        return await parse_invoice_image(request.image_base64)
    elif request.text:
        return await parse_invoice_text(request.text)
    raise HTTPException(status_code=400, detail="Provide either text or image_base64")


@router.post("/parse-and-add", response_model=list[InventoryItemResponse])
async def parse_and_add_to_inventory(
    request: InvoiceParseRequest,
    db: AsyncSession = Depends(get_db),
):
    if request.image_base64:
        parsed = await parse_invoice_image(request.image_base64)
    elif request.text:
        parsed = await parse_invoice_text(request.text)
    else:
        raise HTTPException(
            status_code=400, detail="Provide either text or image_base64"
        )

    items, _ = await crud.get_items(db, skip=0, limit=1000)
    existing_names = [item.name for item in items]

    default_expiry = date.today() + timedelta(days=30)

    created_items = []
    for parsed_item in parsed.items:
        normalized_name = normalize_product_name(parsed_item.name, existing_names)

        item_create = InventoryItemCreate(
            name=normalized_name,
            quantity=parsed_item.quantity,
            unit=parsed_item.unit,
            expiry_date=default_expiry,
            purchase_price=parsed_item.price,
        )

        created = await crud.create_item(db, item_create)
        created_items.append(created)
        existing_names.append(normalized_name)

    return created_items
