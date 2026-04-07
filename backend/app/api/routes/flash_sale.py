from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas import FlashSaleItem
from app.services import get_flash_sale_suggestions

router = APIRouter(prefix="/flash-sale", tags=["flash-sale"])


@router.get("/suggestions", response_model=list[FlashSaleItem])
async def get_suggestions(db: AsyncSession = Depends(get_db)):
    return await get_flash_sale_suggestions(db)
