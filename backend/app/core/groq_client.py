from groq import Groq
from functools import lru_cache

from .config import settings


@lru_cache
def get_groq_client() -> Groq:
    return Groq(api_key=settings.GROQ_API_KEY)
