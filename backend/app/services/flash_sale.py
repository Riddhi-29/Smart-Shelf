from datetime import date, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.crud.inventory import get_near_expiry_items
from app.schemas.invoice import FlashSaleItem
from app.core.config import settings


def calculate_discount(days_to_expiry: int, category: Optional[str] = None) -> int:
    """
    Calculate suggested discount percentage based on days to expiry.
    Perishables (dairy, vegetables, fruits) get higher discounts.
    """
    perishable_categories = {"dairy", "vegetables", "fruits", "bakery", "meat"}
    is_perishable = category and category.lower() in perishable_categories

    if days_to_expiry <= 0:
        base_discount = 70
    elif days_to_expiry == 1:
        base_discount = 50
    elif days_to_expiry <= 3:
        base_discount = 35
    elif days_to_expiry <= 5:
        base_discount = 25
    elif days_to_expiry <= 7:
        base_discount = 15
    else:
        base_discount = 0

    if is_perishable and base_discount > 0:
        base_discount = min(base_discount + 10, 80)

    return base_discount


def generate_reason(
    item_name: str, days_to_expiry: int, quantity: int, discount: int
) -> str:
    """Generate a human-readable reason for the discount suggestion."""
    if days_to_expiry <= 0:
        urgency = "expires today"
    elif days_to_expiry == 1:
        urgency = "expires tomorrow"
    else:
        urgency = f"expires in {days_to_expiry} days"

    if quantity > 20:
        stock_note = f"High stock ({quantity} units)"
    elif quantity > 10:
        stock_note = f"Moderate stock ({quantity} units)"
    else:
        stock_note = f"{quantity} units remaining"

    return f"{item_name} {urgency}. {stock_note} - suggest {discount}% off to clear inventory."


async def get_flash_sale_suggestions(db: AsyncSession) -> list[FlashSaleItem]:
    """Get flash sale suggestions for near-expiry items."""
    near_expiry_items = await get_near_expiry_items(db, settings.NEAR_EXPIRY_DAYS)

    suggestions = []
    today = date.today()

    for item in near_expiry_items:
        days_to_expiry = (item.expiry_date - today).days
        discount = calculate_discount(days_to_expiry, item.category)

        if discount > 0:
            reason = generate_reason(
                item.name,
                days_to_expiry,
                item.quantity,
                discount,
            )

            suggestions.append(
                FlashSaleItem(
                    item_id=item.id,
                    item_name=item.name,
                    days_to_expiry=days_to_expiry,
                    current_quantity=item.quantity,
                    suggested_discount=discount,
                    reason=reason,
                )
            )

    suggestions.sort(key=lambda x: x.days_to_expiry)

    return suggestions
