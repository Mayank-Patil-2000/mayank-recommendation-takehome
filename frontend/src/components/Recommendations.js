const Recommendations = ({ recommendations, isLoading }) => {
  
  /**
   * Display confidence match score in a 5-star format
   * Converts a score from 1–10 into 0–5 filled stars
  */

  const renderConfidenceStars = (score) => {
    const maxStars = 5
    const filledStars = Math.round((score / 10) * maxStars)

    return Array(maxStars)
      .fill()
      .map((_, index) => (
        <span key={index} className={index < filledStars ? "star filled" : "star"}>
          ★
        </span>
      ))
  }

  return (
    <div className="recommendations-container">
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing your preferences and browsing history...</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="recommendations-grid">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="recommendation-card">
              <div className="recommendation-header">
                <h3 className="recommendation-name">{recommendation.product.name}</h3>
                <div className="recommendation-confidence">
                  Match: {renderConfidenceStars(recommendation.confidence_score)}
                </div>
              </div>

              <div className="recommendation-details">
                <div className="recommendation-meta">
                  <span className="recommendation-brand">{recommendation.product.brand}</span>
                  <span className="recommendation-category">{recommendation.product.category}</span>
                  <span className="recommendation-price">${recommendation.product.price.toFixed(2)}</span>
                </div>

                <div className="recommendation-features">
                  <h4>Features:</h4>
                  <ul>
                    {recommendation.product.features.slice(0, 3).map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="recommendation-explanation">
                  <h4>Why we recommend this:</h4>
                  <p>{recommendation.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-recommendations">
          <p>No recommendations yet. Set your preferences and browse some products!</p>
          <p className="no-recommendations-hint">
            Tip: The more products you browse and preferences you set, the better our AI can recommend products for you.
          </p>
        </div>
      )}
    </div>
  )
}

export default Recommendations
