from .inventory import router as inventory_router
from .alerts import router as alerts_router
from .invoice_parser import router as invoice_router
from .flash_sale import router as flash_sale_router

__all__ = ["inventory_router", "alerts_router", "invoice_router", "flash_sale_router"]
