"use client"

import { useState, useEffect } from "react"

const UserPreferences = ({ preferences, products, onPreferencesChange }) => {
  // Extract unique categories and brands from products
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  // Predefined price range options in the dropdown.
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-50", label: "Under $50" },
    { value: "50-100", label: "$ 50 - $100" },
    { value: "100-200", label: "$ 100 - $200" },
    { value: "200+", label: "$ 200+" },
  ]

  // Extract unique categories and brands when products change
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map((product) => product.category))]
      const uniqueBrands = [...new Set(products.map((product) => product.brand))]

      setCategories(uniqueCategories.sort())
      setBrands(uniqueBrands.sort())
    }
  }, [products])

  // Option to select price range of the products
  const handlePriceRangeChange = (e) => {
    onPreferencesChange({ priceRange: e.target.value })
  }

  // Options to select the category of the products
  const handleCategoryChange = (category) => {
    const updatedCategories = preferences.categories.includes(category)
      ? preferences.categories.filter((c) => c !== category)
      : [...preferences.categories, category]

    onPreferencesChange({ categories: updatedCategories })
  }

  // Option to select the brand of the products
  const handleBrandChange = (brand) => {
    const updatedBrands = preferences.brands.includes(brand)
      ? preferences.brands.filter((b) => b !== brand)
      : [...preferences.brands, brand]

    onPreferencesChange({ brands: updatedBrands })
  }

  // Clear all preferences on a single click at once
  const handleClearPreferences = () => {
    onPreferencesChange({
      priceRange: "all",
      categories: [],
      brands: [],
    })
  }

  return (
    <div className="preferences-container">
      <div className="preferences-header">
        <h3>Your Preferences</h3>
        <button className="clear-preferences-btn" onClick={handleClearPreferences}>
          Clear All
        </button>
      </div>

      <div className="preference-section">
        <h4>Price Range</h4>
        <select value={preferences.priceRange} onChange={handlePriceRangeChange} className="price-range-select">
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="preference-section">
        <h4>Categories</h4>
        <div className="categories-list">
          {categories.map((category) => (
            <label key={category} className="category-checkbox">
              <input
                type="checkbox"
                checked={preferences.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div className="preference-section">
        <h4>Brands</h4>
        <div className="brands-list">
          {brands.map((brand) => (
            <label key={brand} className="brand-checkbox">
              <input
                type="checkbox"
                checked={preferences.brands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div className="selected-preferences">
        <h4>Selected Preferences:</h4>
        <ul>
          <li>
            <strong>Price:</strong>{" "}
            {priceRanges.find((range) => range.value === preferences.priceRange)?.label || "All Prices"}
          </li>
          <li>
            <strong>Categories:</strong>{" "}
            {preferences.categories.length > 0 ? preferences.categories.join(", ") : "All Categories"}
          </li>
          <li>
            <strong>Brands:</strong> {preferences.brands.length > 0 ? preferences.brands.join(", ") : "All Brands"}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UserPreferences
