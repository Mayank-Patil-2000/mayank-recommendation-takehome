from services.product_service import ProductService

def test_get_all_products_returns_list():
    service = ProductService()
    products = service.get_all_products()
    assert isinstance(products, list), "get_all_products should return a list"

def test_get_all_products_not_empty():
    service = ProductService()
    products = service.get_all_products()
    assert len(products) > 0, "Product list should not be empty"

def test_product_has_required_fields():
    service = ProductService()
    products = service.get_all_products()
    for product in products:
        assert "id" in product
        assert "name" in product
        assert "brand" in product
        assert "category" in product
        assert "price" in product
        assert "rating" in product
        assert "description" in product

def test_product_field_types():
    service = ProductService()
    products = service.get_all_products()
    for product in products:
        assert isinstance(product["id"], str)
        assert isinstance(product["name"], str)
        assert isinstance(product["brand"], str)
        assert isinstance(product["category"], str)
        assert isinstance(product["price"], (int, float))
        assert isinstance(product["rating"], (int, float))
        assert isinstance(product["description"], str)
