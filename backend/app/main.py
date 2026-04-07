from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import create_tables
from app.api import inventory_router, alerts_router, invoice_router, flash_sale_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield


app = FastAPI(
    title="Kirana Store Inventory API",
    description="Smart-Shelf Inventory Management System for Kirana Stores",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(inventory_router)
app.include_router(alerts_router)
app.include_router(invoice_router)
app.include_router(flash_sale_router)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
