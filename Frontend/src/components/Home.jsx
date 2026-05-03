import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

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

/* Helper: pick the best image URL for a product */
const getProductImage = (product) => {
  // If product has an uploaded image on the backend, use that
  if (product.imageType) return `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}`}/product/${product.id}/image`;
  // Otherwise use our curated image map
  return PRODUCT_IMAGES[product.name] || `https://placehold.co/600x400/1a1a2e/eee?text=${encodeURIComponent(product.name)}`;
};

const CATEGORIES = [
  { label: "All", icon: "🏠" },
  { label: "Laptop", icon: "💻" },
  { label: "Audio", icon: "🎧" },
  { label: "Mobile", icon: "📱" },
  { label: "Electronics", icon: "⚡" },
  { label: "Gaming", icon: "🎮" },
  { label: "Accessories", icon: "🖱️" },
  { label: "Tablet", icon: "📟" },
];

const SORT_OPTIONS = [
  { value: "default", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
];

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-img" />
    <div className="skeleton skeleton-line skeleton-line--lg" />
    <div className="skeleton skeleton-line skeleton-line--sm" />
    <div className="skeleton skeleton-line" />
    <div className="skeleton skeleton-btn" />
  </div>
);

const Home = ({ selectedCategory: propCategory }) => {
  const { data, isError, addToCart, refreshData, user, wishlist, toggleWishlist } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addedMap, setAddedMap] = useState({});
  const [toast, setToast] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isDataFetched) {
      setLoading(true);
      refreshData().finally?.(() => setLoading(false));
      setIsDataFetched(true);
      setTimeout(() => setLoading(false), 1200); // fallback
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      setProducts(data);
      setLoading(false);
    }
  }, [data]);

  // Sync with navbar category if passed down
  useEffect(() => {
    if (propCategory !== undefined) setActiveCategory(propCategory);
  }, [propCategory]);

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

  // Filter
  const filtered = activeCategory && activeCategory !== "All"
    ? products.filter(p => p.category === activeCategory)
    : products;

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    return 0;
  });

  if (isError) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "13rem 0" }}>
        <img src={unplugged} alt="Error" style={{ width: 100, height: 100, marginBottom: 16 }} />
        <h4 style={{ color: "#888" }}>Couldn't connect to server</h4>
      </div>
    );
  }

  return (
    <>
      {/* ── Toast ── */}
      {toast && (
        <div className={`home-toast home-toast--${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          {toast.message}
        </div>
      )}

      {/* ── Hero Carousel ── */}
      <section className="hero-carousel-section mb-0" style={{ marginTop: "0px" }}>
        <div id="homeCarousel" className="carousel slide shadow-sm" data-bs-ride="carousel" data-bs-pause="hover" data-bs-interval="4000">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&h=500&fit=crop" className="d-block w-100" alt="Tech Sale" style={{ height: "380px", objectFit: "cover", filter: "brightness(0.45)" }} />
              <div className="carousel-caption d-flex flex-column h-100 align-items-center justify-content-center pb-0">
                <p className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "2px", color: "#e0e0e0" }}>🛍 Welcome to HiTeckKart</p>
                <h1 className="fw-bolder display-4 mb-3 text-white">Mega Tech <span className="text-warning">Sale</span></h1>
                <p className="lead fw-normal mb-4 text-light">Up to 40% off on premium laptops and smartphones.</p>
                <div>
                  <span className="badge bg-light text-dark px-3 py-2 me-2 mb-2 rounded-pill"><i className="bi bi-truck me-1"></i> Free Shipping</span>
                  <span className="badge bg-light text-dark px-3 py-2 me-2 mb-2 rounded-pill"><i className="bi bi-shield-lock me-1"></i> Secure Payments</span>
                  <span className="badge bg-light text-dark px-3 py-2 mb-2 rounded-pill"><i className="bi bi-arrow-return-left me-1"></i> Easy Returns</span>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1600&h=500&fit=crop" className="d-block w-100" alt="Audio Gear" style={{ height: "380px", objectFit: "cover", filter: "brightness(0.5)" }} />
              <div className="carousel-caption d-flex flex-column h-100 align-items-center justify-content-center pb-0">
                <h1 className="fw-bolder display-4 mb-3 text-white">Next-Gen <span className="text-info">Audio</span></h1>
                <p className="lead fw-normal mb-4 text-light">Experience studio-quality sound with our latest headphones.</p>
                <button className="btn btn-info text-white btn-lg fw-bold px-4 rounded-pill shadow-sm" onClick={() => setActiveCategory("Audio")}>Explore Audio →</button>
              </div>
            </div>
            <div className="carousel-item">
              <img src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1600&h=500&fit=crop" className="d-block w-100" alt="Gaming" style={{ height: "380px", objectFit: "cover", filter: "brightness(0.5)" }} />
              <div className="carousel-caption d-flex flex-column h-100 align-items-center justify-content-center pb-0">
                <h1 className="fw-bolder display-4 mb-3 text-white">Level Up Your <span className="text-danger">Game</span></h1>
                <p className="lead fw-normal mb-4 text-light">The most powerful consoles and accessories are here.</p>
                <button className="btn btn-danger btn-lg fw-bold px-4 rounded-pill shadow-sm" onClick={() => setActiveCategory("Gaming")}>View Gaming →</button>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* ── Category Pill Bar ── */}
      <div className="cat-pill-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            className={`cat-pill ${(activeCategory === cat.label || (cat.label === "All" && !activeCategory)) ? "cat-pill--active" : ""}`}
            onClick={() => setActiveCategory(cat.label === "All" ? "" : cat.label)}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* ── Sort Bar ── */}
      <div className="sort-bar">
        <span className="sort-bar__count">
          {loading ? "Loading products…" : `${sorted.length} product${sorted.length !== 1 ? "s" : ""}${activeCategory ? ` in "${activeCategory}"` : ""}`}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: "0.82rem", color: "#6c757d", fontWeight: 500 }}>Sort by:</label>
          <select className="sort-bar__select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="home-product-grid">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : sorted.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "#888" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🔍</div>
            <h4>No products in this category</h4>
            <button className="cat-pill" style={{ margin: "12px auto" }} onClick={() => setActiveCategory("")}>Clear Filter</button>
          </div>
        ) : (
          sorted.map((product, idx) => {
            const { id, brand, name, price, productAvailable, stockQuantity } = product;
            const isAdded = addedMap[id];
            const isWishlisted = wishlist.some(w => w.id === id);
            const mrp = (price * 1.22).toFixed(2);
            const discount = Math.round(((mrp - price) / mrp) * 100);
            const isNew = idx < 3;
            const isLowStock = stockQuantity > 0 && stockQuantity <= 5;

            return (
              <div className="home-card" key={id} style={{ animationDelay: `${idx * 0.04}s` }}>
                {/* Wishlist */}
                <button
                  className={`wishlist-btn ${isWishlisted ? "wishlist-btn--active" : ""}`}
                  onClick={(e) => handleToggleWishlist(e, product)}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isWishlisted ? "❤️" : "🤍"}
                </button>

                {/* Badge */}
                {!productAvailable ? (
                  <div className="home-card__oos-badge">Out of Stock</div>
                ) : isLowStock ? (
                  <span className="home-card__badge home-card__badge--low">Only {stockQuantity} left</span>
                ) : isNew ? (
                  <span className="home-card__badge home-card__badge--new">New</span>
                ) : null}

                <Link to={`/product/${id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}>
                  <div className="home-card__img-wrap">
                    <img
                      src={getProductImage(product)}
                      alt={name}
                      className="home-card__img"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/1a1a2e/eee?text=${encodeURIComponent(name)}`; }}
                    />
                  </div>

                  <div className="home-card__body d-flex flex-column">
                    <p className="home-card__brand text-muted mb-1">{brand}</p>
                    <h5 className="home-card__name mb-1">{name}</h5>

                    {/* Stars */}
                    <div className="home-card__rating mb-1" style={{ fontSize: "0.82rem" }}>
                      <i className="bi bi-star-fill text-warning"></i>
                      <i className="bi bi-star-fill text-warning"></i>
                      <i className="bi bi-star-fill text-warning"></i>
                      <i className="bi bi-star-fill text-warning"></i>
                      <i className="bi bi-star-half text-warning"></i>
                      <span className="ms-1 text-muted">(1.2k)</span>
                    </div>

                    {/* Offers */}
                    <ul className="list-unstyled mb-2" style={{ fontSize: "0.75rem", lineHeight: "1.6" }}>
                      <li className="d-flex align-items-start gap-1">
                        <i className="bi bi-tag-fill text-success mt-1" style={{ fontSize: "0.65rem", flexShrink: 0 }}></i>
                        <span><b>Bank Offer:</b> 5% cashback on Axis Bank Card</span>
                      </li>
                      <li className="d-flex align-items-start gap-1">
                        <i className="bi bi-tag-fill text-success mt-1" style={{ fontSize: "0.65rem", flexShrink: 0 }}></i>
                        <span><b>Free Shipping</b> on orders above $499</span>
                      </li>
                    </ul>

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
          })
        )}
      </div>
    </>
  );
};

export default Home;
