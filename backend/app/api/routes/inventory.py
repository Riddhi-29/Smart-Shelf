from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.crud import inventory as crud
from app.schemas import (
    InventoryItemCreate,
    InventoryItemUpdate,
    InventoryItemResponse,
    InventoryItemList,
)

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.post("", response_model=InventoryItemResponse, status_code=201)
async def create_item(
    item: InventoryItemCreate,
    db: AsyncSession = Depends(get_db),
):
    return await crud.create_item(db, item)


@router.get("", response_model=InventoryItemList)
async def list_items(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    search: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    skip = (page - 1) * page_size
    items, total = await crud.get_items(db, skip=skip, limit=page_size, search=search)
    pages = (total + page_size - 1) // page_size

    return InventoryItemList(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.get("/{item_id}", response_model=InventoryItemResponse)
async def get_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
):
    item = await crud.get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.put("/{item_id}", response_model=InventoryItemResponse)
async def update_item(
    item_id: int,
    item: InventoryItemUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated = await crud.update_item(db, item_id, item)
    if not updated:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated


@router.delete("/{item_id}", status_code=204)
async def delete_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
):
    deleted = await crud.delete_item(db, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found")
