"use client"

import { useState } from "react"

// TODO: Implement a product catalog display
// This component should display a grid of products from the catalog
// Each product should be clickable to add to browsing history

/**
 * Catalog Components
 * 
 * Displays a grid of products with:
 * By name, brand, or category
 * Sorting options (price, rating, name)
 * "Show More" toggle - to show all the items in the catalog
 * Browsing history highlighted and appears as Viewed
 * 
 */

const Catalog = ({ userEmail, products, onProductClick, browsingHistory }) => {
  // To track the current search term
  const [searchTerm, setSearchTerm] = useState("")
  // To track the selected sort option
  const [sortBy, setSortBy] = useState("name")
  // Toggle's between limited and full product_catalog view
  const [showAll, setShowAll] = useState(false)
  // Track selected category and brand filters
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")

  // Extract unique categories and brands
  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))]
  const brands = ["all", ...Array.from(new Set(products.map(p => p.brand)))]

  /**
   * Filter products based on user input
   * Match against name, brand, and category
   */
  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "all" || product.category === selectedCategory) &&
      (selectedBrand === "all" || product.brand === selectedBrand)
  )

  /**
   * Sort the products in the filtered product list
   * Sorting Options : price low → high, high → low, highest rated, or name (where name is default sorting type)
   */
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price
    } else if (sortBy === "price-high") {
      return b.price - a.price
    } else if (sortBy === "rating") {
      return b.rating - a.rating
    } else {
      // Default (sort by name)
      return a.name.localeCompare(b.name)
    }
  })

  /**
   * Restrict the number of displayed products until the "Show More" option is clicked
   * Default : only show the first 9 products in the catalog
   */
  const displayProducts = showAll ? sortedProducts : sortedProducts.slice(0, 9)

  return (
    <div className="catalog-container">
      <div className="catalog-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="catalog-search"
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="catalog-sort">
          <option value="name">Sort by Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="catalog-filter">
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="catalog-filter">
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand === "all" ? "All Brands" : brand}
            </option>
          ))}
        </select>
      </div>

      {sortedProducts.length > 0 ? (
        <>
          <div className="product-grid">
            {displayProducts.map((product) => {
              const isViewed = browsingHistory.includes(product.id)

              return (
                <div
                  key={product.id}
                  className={`product-card ${isViewed ? "product-viewed" : ""}`}
                  onClick={() => onProductClick(product.id)}
                >
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-meta">
                      <span className="product-brand">{product.brand}</span>
                      <span className="product-category">{product.category}</span>
                    </div>
                    <div className="product-price">${product.price.toFixed(2)}</div>
                    <div className="product-rating">Rating: {product.rating} ★</div>
                    <p className="product-description">{product.description.substring(0, 100)}...</p>
                    {isViewed && <div className="viewed-badge">Viewed</div>}
                  </div>
                </div>
              )
            })}
          </div>

          {sortedProducts.length > 9 && (
            <div className="show-more-container">
              <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="no-products">No products found matching your search.</p>
      )}
    </div>
  )
}

export default Catalog
