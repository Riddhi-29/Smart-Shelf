from rapidfuzz import fuzz, process
from typing import Optional


def normalize_product_name(
    name: str, existing_products: list[str], threshold: int = 85
) -> str:
    """
    Match product name against existing products using fuzzy matching.
    Returns the existing product name if similarity > threshold, otherwise the original.
    """
    if not existing_products:
        return name.strip().title()

    match = process.extractOne(
        name,
        existing_products,
        scorer=fuzz.WRatio,
        score_cutoff=threshold,
    )

    if match:
        return match[0]

    return name.strip().title()


def find_similar_products(
    query: str,
    products: list[str],
    limit: int = 5,
    threshold: int = 50,
) -> list[tuple[str, float]]:
    """
    Find similar products based on fuzzy matching.
    Returns list of (product_name, similarity_score) tuples.
    """
    if not products:
        return []

    results = process.extract(
        query,
        products,
        scorer=fuzz.WRatio,
        limit=limit,
        score_cutoff=threshold,
    )

    return [(name, score / 100.0) for name, score, _ in results]


COMMON_CORRECTIONS = {
    "aata": "Atta (Wheat Flour)",
    "atta": "Atta (Wheat Flour)",
    "chawal": "Rice",
    "daal": "Dal (Lentils)",
    "dal": "Dal (Lentils)",
    "chini": "Sugar",
    "namak": "Salt",
    "tel": "Oil",
    "doodh": "Milk",
    "ghee": "Ghee",
    "besan": "Besan (Gram Flour)",
    "maida": "Maida (Refined Flour)",
    "sooji": "Sooji (Semolina)",
    "rava": "Rava (Semolina)",
    "poha": "Poha (Flattened Rice)",
}


def apply_common_corrections(name: str) -> str:
    """Apply common spelling/transliteration corrections for grocery items."""
    name_lower = name.lower().strip()
    return COMMON_CORRECTIONS.get(name_lower, name.strip().title())
