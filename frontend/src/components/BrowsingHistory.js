"use client"
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const BrowsingHistory = ({ userEmail, history, setHistory, products, onClearHistory }) => {
  const [activeTooltip, setActiveTooltip] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef(null)

  // Fetch history on userEmail change
  useEffect(() => {
    if (!userEmail) return;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/${userEmail}`)
        setHistory(res.data.browsing_history || [])
      } catch (err) {
        console.error("Failed to fetch browsing history", err)
      }
    }
    fetchHistory()
  }, [userEmail, setHistory])

  const historyProducts = history
    .map((productId) => products.find((product) => product.id === productId))
    .filter(Boolean)

  const handleMouseEnter = (e, productId) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const left = rect.right + 20
    const top = rect.top
    setTooltipPosition({ top, left })
    setActiveTooltip(productId)
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>Your Browsing History</h3>
        {historyProducts.length > 0 && (
          <button className="clear-history-btn" onClick={onClearHistory}>
            Clear History
          </button>
        )}
      </div>

      {historyProducts.length > 0 ? (
        <>
          <div className="history-items">
            {historyProducts.map((product) => (
              <div
                key={product.id}
                className="history-item-wrapper"
                onMouseEnter={(e) => handleMouseEnter(e, product.id)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div className="history-item">
                  <div className="history-item-name">{product.name}</div>
                  <div className="history-item-details">
                    <span className="history-item-category">{product.category}</span>
                    <span className="history-item-price">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            ref={tooltipRef}
            className={`history-hover-details ${activeTooltip ? 'visible' : ''}`}
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`
            }}
          >
            {activeTooltip && (() => {
              const product = historyProducts.find(p => p.id === activeTooltip)
              return product ? (
                <>
                  <p><strong>Brand:</strong> {product.brand}</p>
                  <p><strong>Description:</strong> {product.description}</p>
                  <p><strong>Rating:</strong> {product.rating} ★</p>
                </>
              ) : null
            })()}
          </div>
        </>
      ) : (
        <p className="history-empty">No browsing history yet. Click on products to add them here.</p>
      )}
    </div>
  )
}

export default BrowsingHistory
