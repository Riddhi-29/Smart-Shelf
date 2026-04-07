import json
import base64
from typing import Optional

from app.core.groq_client import get_groq_client
from app.schemas.invoice import ParsedInvoice, ParsedItem


SYSTEM_PROMPT = """You are an invoice parser for a kirana/grocery store in India.
Extract item names, quantities, units, and prices from the invoice text.
Handle messy, unformatted text. Handle Hindi/regional language items.

Return JSON in this exact format:
{
  "items": [
    {"name": "Item Name", "quantity": 1, "unit": "kg", "price": 100.0, "confidence": 0.95}
  ],
  "vendor_name": "Vendor Name or null",
  "invoice_date": "2024-01-15 or null",
  "total_amount": 500.0 or null
}

Rules:
- quantity must be a positive integer
- unit is optional (kg, g, pcs, litre, ml, dozen, etc.)
- price is per unit, can be null if not clear
- confidence is 0.0 to 1.0, how sure you are about the extraction
- Normalize item names to proper case (e.g., "RICE" -> "Rice", "aata" -> "Atta")
"""


async def parse_invoice_text(text: str) -> ParsedInvoice:
    client = get_groq_client()

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Parse this invoice:\n\n{text}"},
        ],
        response_format={"type": "json_object"},
        temperature=0.1,
    )

    content = response.choices[0].message.content
    data = json.loads(content)

    items = [ParsedItem(**item) for item in data.get("items", [])]

    return ParsedInvoice(
        items=items,
        vendor_name=data.get("vendor_name"),
        invoice_date=data.get("invoice_date"),
        total_amount=data.get("total_amount"),
        raw_text=text,
    )


async def parse_invoice_image(image_base64: str) -> ParsedInvoice:
    client = get_groq_client()

    if not image_base64.startswith("data:"):
        image_base64 = f"data:image/jpeg;base64,{image_base64}"

    response = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"{SYSTEM_PROMPT}\n\nExtract all items from this invoice image and return as JSON.",
                    },
                    {"type": "image_url", "image_url": {"url": image_base64}},
                ],
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.1,
    )

    content = response.choices[0].message.content
    data = json.loads(content)

    items = [ParsedItem(**item) for item in data.get("items", [])]

    return ParsedInvoice(
        items=items,
        vendor_name=data.get("vendor_name"),
        invoice_date=data.get("invoice_date"),
        total_amount=data.get("total_amount"),
        raw_text=None,
    )
