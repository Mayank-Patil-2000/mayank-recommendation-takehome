from services.llm_service import LLMService

def test_matches_preferences_exact_match():
    product = {"price": 99, "category": "Electronics", "brand": "Acme"}
    prefs = {"priceRange": "50-100", "categories": ["Electronics"], "brands": ["Acme"]}
    assert LLMService.matches_preferences(product, prefs) is True

def test_matches_preferences_category_mismatch():
    product = {"price": 99, "category": "Clothing", "brand": "Acme"}
    prefs = {"priceRange": "50-100", "categories": ["Electronics"], "brands": ["Acme"]}
    assert LLMService.matches_preferences(product, prefs) is False

def test_matches_preferences_brand_mismatch():
    product = {"price": 99, "category": "Electronics", "brand": "OtherBrand"}
    prefs = {"priceRange": "50-100", "categories": ["Electronics"], "brands": ["Acme"]}
    assert LLMService.matches_preferences(product, prefs) is False

def test_matches_preferences_price_too_low():
    product = {"price": 30, "category": "Electronics", "brand": "Acme"}
    prefs = {"priceRange": "50-100", "categories": ["Electronics"], "brands": ["Acme"]}
    assert LLMService.matches_preferences(product, prefs) is False

def test_matches_preferences_price_too_high():
    product = {"price": 150, "category": "Electronics", "brand": "Acme"}
    prefs = {"priceRange": "50-100", "categories": ["Electronics"], "brands": ["Acme"]}
    assert LLMService.matches_preferences(product, prefs) is False

def test_matches_preferences_price_range_all():
    product = {"price": 1000, "category": "Electronics", "brand": "Acme"}
    prefs = {"priceRange": "all", "categories": ["Electronics"], "brands": ["Acme"]}
    assert LLMService.matches_preferences(product, prefs) is True

def test_matches_preferences_missing_categories_and_brands():
    product = {"price": 75, "category": "Electronics", "brand": "Acme"}
    prefs = {"priceRange": "50-100", "categories": [], "brands": []}
    assert LLMService.matches_preferences(product, prefs) is True

def test_matches_preferences_case_insensitive():
    product = {"price": 75, "category": "eLeCtRoNiCs", "brand": "aCmE"}
    prefs = {"priceRange": "50-100", "categories": ["electronics"], "brands": ["acme"]}
    assert LLMService.matches_preferences(product, prefs) is True
