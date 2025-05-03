const API_BASE_URL = "http://localhost:5000/api"

// Fetch all the products from the API
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`)
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

// Get product recommendations based on  user preferences and browsing history
export const getRecommendations = async (preferences, browsingHistory, userEmail) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        preferences: preferences,
        browsing_history: browsingHistory,
        userEmail: userEmail
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting recommendations:", error)
    throw error
  }
}
