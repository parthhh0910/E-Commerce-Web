import { useNavigate, useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

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

const Product = () => {
  const { id } = useParams();
  const { data, addToCart } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [toast, setToast] = useState(null);
  const [related, setRelated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}`}/product/${id}`);
        const prod = response.data;
        setProduct(prod);

        // Use curated image if no uploaded image exists
        if (prod.imageType) {
          try {
            const imgRes = await axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}`}/product/${id}/image`, { responseType: "blob" });
            if (imgRes.data && imgRes.data.size > 0) {
              setImageUrl(URL.createObjectURL(imgRes.data));
              return;
            }
          } catch { /* fall through */ }
        }
        setImageUrl(PRODUCT_IMAGES[prod.name] || `https://loremflickr.com/600/400/${prod.category ? encodeURIComponent(prod.category.toLowerCase()) : 'gadget'}?lock=${prod.id}`);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Build related products (same category, different id)
  useEffect(() => {
    if (product && data && data.length > 0) {
      const rel = data.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);
      setRelated(rel);
    }
  }, [product, data]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    showToast(`"${product.name}" × ${quantity} added to cart!`, "success");
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    navigate("/cart");
  };

  const handlePincodeCheck = () => {
    if (!pincode || pincode.length < 5) { setPincodeMsg(""); return; }
    const days = Math.floor(Math.random() * 3) + 2;
    const options = { weekday: "short", month: "short", day: "numeric" };
    const delivery = new Date(Date.now() + days * 86400000).toLocaleDateString("en-US", options);
    setPincodeMsg(`✓ Delivery by ${delivery} — Free`);
  };

  if (!product) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", paddingTop: "80px" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status"></div>
          <p className="mt-3 text-muted">Loading product…</p>
        </div>
      </div>
    );
  }

  const mrp = (product.price * 1.2).toFixed(2);
  const discount = Math.round(((mrp - product.price) / mrp) * 100);
  const highlights = product.description
    ? product.description.split(/(?:\. |, |; )/).filter(h => h.trim().length > 3)
    : [];

  return (
    <div className="container" style={{ marginTop: "100px", marginBottom: "60px" }}>
      {/* Toast */}
      {toast && (
        <div className={`home-toast home-toast--${toast.type}`} style={{ top: 80 }}>
          <span>{toast.type === "success" ? "✓" : "⚠"}</span> {toast.msg}
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "24px" }}>
        <div className="row">
          {/* Left — Image + CTAs */}
          <div className="col-12 col-md-5 d-flex flex-column align-items-center mb-4 mb-md-0">
            <div className="prod-img-zoom w-100">
              <img src={imageUrl} alt={product.name} onError={e => { e.target.onerror = null; e.target.src = PRODUCT_IMAGES[product.name] || `https://loremflickr.com/600/400/${product.category ? encodeURIComponent(product.category.toLowerCase()) : 'gadget'}?lock=${product.id}`; }} />
            </div>

            {/* Qty selector */}
            <div className="prod-qty-row w-100 mt-3">
              <span className="prod-qty-label">Qty:</span>
              <div className="prod-qty-ctrl">
                <button className="prod-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span className="prod-qty-num">{quantity}</span>
                <button className="prod-qty-btn" onClick={() => setQuantity(q => Math.min(product.stockQuantity || 10, q + 1))}>+</button>
              </div>
            </div>

            <div className="d-flex w-100 mt-2 gap-2">
              <button
                className={`btn flex-grow-1 fw-bold text-white py-3 ${!product.productAvailable ? "disabled" : ""}`}
                onClick={handleAddToCart}
                disabled={!product.productAvailable}
                style={{ backgroundColor: "#ff9f00", fontSize: "1.05rem", border: "none", transition: "background 0.2s" }}
              >
                <i className="bi bi-cart-fill me-2"></i>
                {product.productAvailable ? "ADD TO CART" : "OUT OF STOCK"}
              </button>
              <button
                className={`btn flex-grow-1 fw-bold text-white py-3 ${!product.productAvailable ? "disabled" : ""}`}
                onClick={handleBuyNow}
                disabled={!product.productAvailable}
                style={{ backgroundColor: "#fb641b", fontSize: "1.05rem", border: "none" }}
              >
                <i className="bi bi-lightning-fill me-2"></i> BUY NOW
              </button>
            </div>
          </div>

          {/* Right — Details */}
          <div className="col-12 col-md-7 ps-md-4">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-2" style={{ fontSize: "0.85rem", color: "#878787" }}>
                <li className="breadcrumb-item"><a href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</a></li>
                <li className="breadcrumb-item"><a href="/" style={{ color: "inherit", textDecoration: "none" }}>{product.category}</a></li>
                <li className="breadcrumb-item active">{product.name}</li>
              </ol>
            </nav>

            <h4 className="mb-1" style={{ fontSize: "1.3rem", fontWeight: "400" }}>{product.name}</h4>
            <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>By <span className="text-primary fw-medium">{product.brand}</span></p>

            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge bg-success px-2 py-1 d-flex align-items-center" style={{ fontSize: "0.85rem" }}>
                4.6 <i className="bi bi-star-fill text-white ms-1" style={{ fontSize: "0.7rem" }}></i>
              </span>
              <span className="text-muted" style={{ fontSize: "0.9rem", fontWeight: "500" }}>14,245 Ratings &amp; 1,482 Reviews</span>
            </div>

            <div className="d-flex align-items-end gap-3 mb-2">
              <h1 className="mb-0 fw-bold" style={{ fontSize: "2rem", letterSpacing: "-1px" }}>${product.price}</h1>
              <span className="text-muted text-decoration-line-through mb-1" style={{ fontSize: "1.1rem" }}>${mrp}</span>
              <span className="mb-1 fw-bold" style={{ color: "#388e3c", fontSize: "1rem" }}>{discount}% off</span>
            </div>

            <p style={{ fontSize: "0.9rem", fontWeight: "500" }}>
              Status: <span style={{ color: product.stockQuantity > 0 ? "#388e3c" : "#dc3545" }}>
                {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} left)` : "Out of Stock"}
              </span>
            </p>

            {/* Delivery checker */}
            <div className="mt-2 mb-3">
              <p className="mb-1" style={{ fontSize: "0.88rem", fontWeight: "600" }}><i className="bi bi-geo-alt me-1 text-primary"></i>Check Delivery</p>
              <div className="pincode-row">
                <input
                  className="pincode-input"
                  type="text"
                  placeholder="Enter Pincode"
                  maxLength={6}
                  value={pincode}
                  onChange={e => { setPincode(e.target.value); setPincodeMsg(""); }}
                />
                <button className="pincode-check-btn" onClick={handlePincodeCheck}>Check</button>
              </div>
              {pincodeMsg && <p className="pincode-result">{pincodeMsg}</p>}
            </div>

            {/* Offers */}
            <div className="mt-3">
              <h6 className="fw-bold mb-2" style={{ fontSize: "1rem" }}>Available Offers</h6>
              <ul className="list-unstyled mb-3" style={{ fontSize: "0.88rem" }}>
                {[
                  ["Bank Offer", "5% Cashback on HiTeckKart Axis Bank Card"],
                  ["Special Price", "Get extra $50 off (price inclusive of cashback/coupon)"],
                  ["Partner Offer", "Sign up for Pay Later and get free Times Prime Benefits"],
                ].map(([title, desc]) => (
                  <li key={title} className="mb-2" style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <i className="bi bi-tag-fill text-success" style={{ fontSize: "0.78rem", marginTop: "3px", flexShrink: 0 }}></i>
                    <p className="mb-0"><strong>{title}:</strong> {desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Highlights */}
            <div className="border border-opacity-10 rounded p-4 bg-light mb-4">
              <h6 className="fw-bold mb-3 text-secondary" style={{ letterSpacing: "1px" }}>HIGHLIGHTS</h6>
              <ul className="mb-0 ps-3" style={{ fontSize: "0.95rem", lineHeight: "1.8" }}>
                {highlights.length > 0
                  ? highlights.map((h, i) => <li key={i} className="mb-1">{h}</li>)
                  : <li>Premium quality materials</li>}
              </ul>
            </div>

            <div className="d-flex align-items-center p-3 border rounded shadow-sm">
              <i className="bi bi-shield-check text-primary fs-3 me-3"></i>
              <div>
                <p className="mb-0 fw-bold" style={{ fontSize: "0.95rem" }}>1 Year Manufacturer Warranty</p>
                <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>Know More</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="related-section">
            <h5>Similar Products</h5>
            <div className="related-grid">
              {related.map(rp => (
                <Link key={rp.id} to={`/product/${rp.id}`} className="related-card">
                  <img
                    src={PRODUCT_IMAGES[rp.name] || `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}`}/product/${rp.id}/image`}
                    alt={rp.name}
                    onError={e => { e.target.onerror = null; e.target.src = `https://loremflickr.com/300/200/${rp.category ? encodeURIComponent(rp.category.toLowerCase()) : 'gadget'}?lock=${rp.id}`; }}
                  />
                  <div className="related-card__name">{rp.name}</div>
                  <div className="related-card__price">${rp.price}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;