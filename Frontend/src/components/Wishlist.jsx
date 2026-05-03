import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";

const PRODUCT_IMAGES = {
  "MacBook Pro M3 14\"": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  "Dell XPS 15": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop",
  "Sony WH-1000XM5": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
  "iPhone 15 Pro Max": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
  "Samsung Galaxy S24 Ultra": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
  "LG C3 65-Inch 4K OLED TV": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "Bose QuietComfort Earbuds II": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop",
  "PlayStation 5 Console": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop",
  "Logitech MX Master 3S": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "iPad Pro 12.9-inch (M2)": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
};

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart, user } = useContext(AppContext);
  const [addedMap, setAddedMap] = useState({});
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!user) {
      showToast("Please login to add items to your cart!", "warning");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    addToCart(product);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    showToast(`"${product.name}" added to cart!`, "success");
    setTimeout(() => setAddedMap((prev) => ({ ...prev, [product.id]: false })), 1800);
  };

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`home-toast home-toast--${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          {toast.message}
        </div>
      )}

      <div style={{ paddingTop: "120px", minHeight: "80vh", paddingBottom: "60px" }}>
        <div className="container">
          <h2 style={{ fontWeight: 800, marginBottom: "8px", color: "var(--para-clr)" }}>
            My Wishlist <span style={{ color: "#ef4444" }}>❤️</span>
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: "32px" }}>
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later
          </p>

          {wishlist.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#888", background: "var(--card-bg-clr)", borderRadius: "16px", border: "1px solid rgba(128,128,128,0.1)" }}>
              <div style={{ fontSize: "4rem", marginBottom: 16 }}>🤍</div>
              <h4 style={{ color: "var(--para-clr)" }}>Your wishlist is empty</h4>
              <p style={{ marginBottom: "24px" }}>Save items you love to view them later.</p>
              <button className="co-btn co-btn--primary" onClick={() => navigate("/")}>Browse Products</button>
            </div>
          ) : (
            <div className="home-product-grid" style={{ paddingTop: 0 }}>
              {wishlist.map((product, idx) => {
                const { id, brand, name, price, productAvailable, stockQuantity } = product;
                const isAdded = addedMap[id];
                const mrp = (price * 1.22).toFixed(2);
                const discount = Math.round(((mrp - price) / mrp) * 100);

                return (
                  <div className="home-card" key={id} style={{ animationDelay: `${idx * 0.04}s` }}>
                    <button
                      className="wishlist-btn wishlist-btn--active"
                      onClick={(e) => handleToggleWishlist(e, product)}
                      title="Remove from wishlist"
                    >
                      ❤️
                    </button>

                    <Link to={`/product/${id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}>
                      <div className="home-card__img-wrap">
                        <img
                          src={PRODUCT_IMAGES[name] || `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}`}/product/${id}/image`}
                          alt={name}
                          className="home-card__img"
                          onError={(e) => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${id}/600/400`; }}
                        />
                      </div>

                      <div className="home-card__body d-flex flex-column">
                        <p className="home-card__brand text-muted mb-1">{brand}</p>
                        <h5 className="home-card__name mb-1">{name}</h5>

                        <div className="home-card__rating mb-1" style={{ fontSize: "0.82rem" }}>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-half text-warning"></i>
                          <span className="ms-1 text-muted">(1.2k)</span>
                        </div>

                        <div className="home-card__footer mt-auto pt-2 border-top border-opacity-10">
                          <div>
                            <span className="home-card__price fw-bolder">${price}</span>
                            <span className="home-card__mrp">${mrp}</span>
                            <span className="home-card__discount">{discount}% off</span>
                          </div>
                          <button
                            className={`home-card__btn ${isAdded ? "home-card__btn--added shadow-none" : "shadow-sm"} ${!productAvailable ? "home-card__btn--disabled" : ""}`}
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!productAvailable}
                          >
                            {isAdded ? "✓ Added" : <><i className="bi bi-cart-plus me-1"></i>Add</>}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
