from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, timedelta
from typing import Optional

from app.models.inventory import InventoryItem
from app.schemas.inventory import InventoryItemCreate, InventoryItemUpdate


async def create_item(db: AsyncSession, item: InventoryItemCreate) -> InventoryItem:
    db_item = InventoryItem(**item.model_dump())
    db.add(db_item)
    await db.flush()
    await db.refresh(db_item)
    return db_item


async def get_item(db: AsyncSession, item_id: int) -> Optional[InventoryItem]:
    result = await db.execute(select(InventoryItem).where(InventoryItem.id == item_id))
    return result.scalar_one_or_none()


async def get_items(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
) -> tuple[list[InventoryItem], int]:
    query = select(InventoryItem)
    count_query = select(func.count(InventoryItem.id))

    if search:
        search_filter = InventoryItem.name.ilike(f"%{search}%")
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    query = query.order_by(InventoryItem.updated_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    items = list(result.scalars().all())

    count_result = await db.execute(count_query)
    total = count_result.scalar() or 0

    return items, total


async def update_item(
    db: AsyncSession, item_id: int, item: InventoryItemUpdate
) -> Optional[InventoryItem]:
    db_item = await get_item(db, item_id)
    if not db_item:
        return None

    update_data = item.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)

    await db.flush()
    await db.refresh(db_item)
    return db_item


async def delete_item(db: AsyncSession, item_id: int) -> bool:
    result = await db.execute(delete(InventoryItem).where(InventoryItem.id == item_id))
    return result.rowcount > 0


async def get_low_stock_items(db: AsyncSession, threshold: int) -> list[InventoryItem]:
    result = await db.execute(
        select(InventoryItem)
        .where(InventoryItem.quantity <= threshold)
        .order_by(InventoryItem.quantity.asc())
    )
    return list(result.scalars().all())


async def get_near_expiry_items(db: AsyncSession, days: int) -> list[InventoryItem]:
    expiry_threshold = date.today() + timedelta(days=days)
    result = await db.execute(
        select(InventoryItem)
        .where(InventoryItem.expiry_date <= expiry_threshold)
        .where(InventoryItem.expiry_date >= date.today())
        .order_by(InventoryItem.expiry_date.asc())
    )
    return list(result.scalars().all())


async def bulk_create_items(
    db: AsyncSession, items: list[InventoryItemCreate]
) -> list[InventoryItem]:
    db_items = [InventoryItem(**item.model_dump()) for item in items]
    db.add_all(db_items)
    await db.flush()
    for item in db_items:
        await db.refresh(item)
    return db_items
