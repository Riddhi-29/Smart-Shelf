from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5433/kirana"
    GROQ_API_KEY: str = ""
    LOW_STOCK_THRESHOLD: int = 10
    NEAR_EXPIRY_DAYS: int = 7

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
