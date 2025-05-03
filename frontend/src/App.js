"use client"

import { useState, useEffect } from "react"
import "./styles/App.css"
import Catalog from "./components/Catalog"
import UserPreferences from "./components/UserPreferences"
import Recommendations from "./components/Recommendations"
import BrowsingHistory from "./components/BrowsingHistory"
import { fetchProducts, getRecommendations } from "./services/api"
import Login from "./components/Login";
import Register from "./components/Register";

import axios from "axios";

function App() {
  // State for products catalog
  const [products, setProducts] = useState([])
 
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail"));
  const [isRegistering, setIsRegistering] = useState(false);
  // State for user preferences
  const [userPreferences, setUserPreferences] = useState({
    priceRange: "all",
    categories: [],
    brands: [],
  })

  // function to logout the user
  const logout = () => {
    localStorage.removeItem("userEmail");
    setUserEmail(null);
  };
  

  // State for browsing history
  const [browsingHistory, setBrowsingHistory] = useState([])

  // State for recommendations
  const [recommendations, setRecommendations] = useState([])

  // State for loading status
  const [isLoading, setIsLoading] = useState(false)

  // Fetch products on component mount
  useEffect(() => {
    
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    loadProducts()
  }, [])

  // Handle product click to add to browsing history
  const handleProductClick = (productId) => {
    // Avoid duplicates in browsing history
    if (!browsingHistory.includes(productId)) {
      setBrowsingHistory([...browsingHistory, productId])
    }
    if (userEmail) {
      axios.post(`http://localhost:5000/api/profile/${userEmail}/add-viewed`, null, {
        params: { product_id: productId },
        headers: { 'Content-Type': 'application/json' }
      });
    }    
  }

  // Update user preferences
  const handlePreferencesChange = (newPreferences) => {
    setUserPreferences((prevPreferences) => ({
      ...prevPreferences,
      ...newPreferences,
    }))
  }

  // Get recommendations based on preferences and browsing history
  const handleGetRecommendations = async () => {
    setIsLoading(true)
    try {
      const data = await getRecommendations(userPreferences, browsingHistory, userEmail)
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error("Error getting recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Clear browsing history
  const handleClearHistory = () => {
    setBrowsingHistory([])
  }

  // login/register screen if the user is not logged in
  if (!userEmail) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>{isRegistering ? "Register" : "Welcome Back"}</h2>
  
          {isRegistering ? (
            <>
              <Register onRegisterSuccess={setUserEmail} />
              <p className="auth-toggle-text">
                Already have an account?{" "}
                <span className="auth-toggle-link" onClick={() => setIsRegistering(false)}>
                  Login here
                </span>
              </p>
            </>
          ) : (
            <>
              <Login onLoginSuccess={setUserEmail} />
              <p className="auth-toggle-text">
                Don’t have an account?{" "}
                <span className="auth-toggle-link" onClick={() => setIsRegistering(true)}>
                  Register here
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }
  
  
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>AI-Powered Product Recommendation Engine</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      <main className="app-content">
        <div className="user-section">
          <UserPreferences
            preferences={userPreferences}
            products={products}
            onPreferencesChange={handlePreferencesChange}
          />

          <BrowsingHistory  userEmail={userEmail}
                            history={browsingHistory}
                            setHistory={setBrowsingHistory}
                            products={products}
                            onClearHistory={handleClearHistory} />

          <button className="get-recommendations-btn" onClick={handleGetRecommendations} disabled={isLoading}>
            {isLoading ? "Getting Recommendations..." : "Get Personalized Recommendations"}
          </button>
        </div>

        <div className="catalog-section">
          <h2>Product Catalog</h2>
          <Catalog userEmail={userEmail} products={products} onProductClick={handleProductClick} browsingHistory={browsingHistory} />
        </div>

        <div className="recommendations-section">
          <h2>Your Recommendations</h2>
          <Recommendations recommendations={recommendations} isLoading={isLoading} />
        </div>
      </main>
    </div>
  )
}

export default App
