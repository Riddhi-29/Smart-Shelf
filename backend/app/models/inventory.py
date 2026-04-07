from sqlalchemy import String, Integer, Float, Date, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import date, datetime
from typing import Optional

from app.core.database import Base


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    unit: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    expiry_date: Mapped[date] = mapped_column(Date, nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    purchase_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    selling_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<InventoryItem(id={self.id}, name='{self.name}', qty={self.quantity})>"
