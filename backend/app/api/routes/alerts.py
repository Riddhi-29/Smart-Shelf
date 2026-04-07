from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date

from app.core.database import get_db
from app.core.config import settings
from app.crud import inventory as crud
from app.schemas import AlertSummary, InventoryItemResponse, NearExpiryItemWithDiscount
from app.services.flash_sale import calculate_discount

router = APIRouter(prefix="/alerts", tags=["alerts"])


def build_near_expiry_with_discount(
    item, days_to_expiry: int
) -> NearExpiryItemWithDiscount:
    discount_percent = calculate_discount(days_to_expiry, item.category)
    discounted_price = None
    if item.selling_price and discount_percent > 0:
        discounted_price = round(item.selling_price * (1 - discount_percent / 100), 2)

    return NearExpiryItemWithDiscount(
        id=item.id,
        name=item.name,
        quantity=item.quantity,
        unit=item.unit,
        expiry_date=item.expiry_date,
        category=item.category,
        selling_price=item.selling_price,
        days_to_expiry=days_to_expiry,
        discount_percent=discount_percent,
        discounted_price=discounted_price,
        created_at=item.created_at,
        updated_at=item.updated_at,
    )


@router.get("/summary", response_model=AlertSummary)
async def get_alert_summary(db: AsyncSession = Depends(get_db)):
    low_stock = await crud.get_low_stock_items(db, settings.LOW_STOCK_THRESHOLD)
    near_expiry = await crud.get_near_expiry_items(db, settings.NEAR_EXPIRY_DAYS)

    today = date.today()
    near_expiry_with_discount = [
        build_near_expiry_with_discount(item, (item.expiry_date - today).days)
        for item in near_expiry
    ]

    return AlertSummary(
        low_stock_count=len(low_stock),
        near_expiry_count=len(near_expiry),
        low_stock_items=low_stock,
        near_expiry_items=near_expiry_with_discount,
    )


@router.get("/low-stock", response_model=list[InventoryItemResponse])
async def get_low_stock(db: AsyncSession = Depends(get_db)):
    return await crud.get_low_stock_items(db, settings.LOW_STOCK_THRESHOLD)


@router.get("/near-expiry", response_model=list[NearExpiryItemWithDiscount])
async def get_near_expiry(db: AsyncSession = Depends(get_db)):
    near_expiry = await crud.get_near_expiry_items(db, settings.NEAR_EXPIRY_DAYS)
    today = date.today()
    return [
        build_near_expiry_with_discount(item, (item.expiry_date - today).days)
        for item in near_expiry
    ]
