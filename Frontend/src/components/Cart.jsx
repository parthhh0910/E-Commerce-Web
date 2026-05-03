import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!cart.length) { setCartItems([]); return; }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}/products`);
        const ids = res.data.map(p => p.id);
        const items = cart
          .filter(item => ids.includes(item.id))
          .map(item => ({
            ...item,
            imageUrl: item.imageType
              ? `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}`}/product/${item.id}/image`
              : (PRODUCT_IMAGES[item.name] || `https://placehold.co/200x200/1a1a2e/eee?text=${encodeURIComponent(item.name)}`)
          }));
        setCartItems(items);
      } catch {
        setCartItems(cart.map(item => ({ ...item, imageUrl: "" })));
      }
    };
    fetchCart();
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncrease = (itemId) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        if (item.quantity < (item.stockQuantity || 99)) return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    }));
  };

  const handleDecrease = (itemId) => {
    setCartItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    ));
  };

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCheckoutClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { alert("Please login to proceed to checkout"); navigate("/login"); return; }
    navigate("/checkout");
  };



  // Price summary values
  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const mrpTotal = cartItems.reduce((s, i) => s + parseFloat((i.price * 1.2).toFixed(2)) * i.quantity, 0);
  const discount = parseFloat((mrpTotal - totalPrice).toFixed(2));
  const deliveryCharge = totalPrice >= 499 ? 0 : 49;
  const finalTotal = (totalPrice + deliveryCharge).toFixed(2);

  if (cartItems.length === 0 && cart.length === 0) {
    return (
      <div className="fk-cart-page">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
          <div className="fk-cart-panel">
            <div className="fk-empty-cart">
              <div className="fk-empty-cart__icon">🛒</div>
              <div className="fk-empty-cart__title">Your cart is empty!</div>
              <p className="fk-empty-cart__sub">Add items to it now.</p>
              <button className="fk-shop-btn" onClick={() => navigate("/")}>Shop Now</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fk-cart-page">
      <div className="fk-cart-wrap">
        {/* Left — Items */}
        <div>
          <div className="fk-cart-panel">
            <div className="fk-cart-title">
              My Cart ({itemCount} item{itemCount !== 1 ? "s" : ""})
            </div>

            {cartItems.map(item => {
              const itemMrp = (item.price * 1.2).toFixed(2);
              const itemDiscount = Math.round(((itemMrp - item.price) / itemMrp) * 100);
              return (
                <div key={item.id} className="fk-cart-item">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="fk-cart-item__img"
                    onError={e => { e.target.onerror = null; e.target.src = PRODUCT_IMAGES[item.name] || `https://placehold.co/200x200/1a1a2e/eee?text=${encodeURIComponent(item.name)}`; }}
                  />
                  <div className="fk-cart-item__info">
                    <div className="fk-cart-item__name">{item.name}</div>
                    <div className="fk-cart-item__brand">{item.brand}</div>
                    <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
                      <span className="fk-cart-item__price">${(item.price * item.quantity).toFixed(2)}</span>
                      <span className="fk-cart-item__orig">${(itemMrp * item.quantity).toFixed(2)}</span>
                      <span className="fk-cart-item__discount">{itemDiscount}% off</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                      <div className="fk-qty-row">
                        <button className="fk-qty-btn" onClick={() => handleDecrease(item.id)}>−</button>
                        <span className="fk-qty-val">{item.quantity}</span>
                        <button className="fk-qty-btn" onClick={() => handleIncrease(item.id)}>+</button>
                      </div>
                      <span style={{ color: "rgba(128,128,128,0.3)" }}>|</span>
                      <button className="fk-cart-remove" onClick={() => handleRemove(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Savings notice */}
            {discount > 0 && (
              <div style={{ padding: "12px 24px", background: "#e8f5e9", borderTop: "1px solid rgba(56,142,60,0.15)", fontSize: "0.88rem", color: "#388e3c", fontWeight: 600 }}>
                🎉 You will save ${discount.toFixed(2)} on this order
              </div>
            )}
          </div>
        </div>

        {/* Right — Price Details */}
        <div>
          <div className="fk-cart-panel">
            <div className="fk-price-panel">
              <h6>Price Details</h6>
              <div className="fk-price-row">
                <span>Price ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                <span>${mrpTotal.toFixed(2)}</span>
              </div>
              <div className="fk-price-row fk-price-row--savings">
                <span>Discount</span>
                <span>− ${discount.toFixed(2)}</span>
              </div>
              <div className="fk-price-row">
                <span>Delivery Charges</span>
                <span style={{ color: deliveryCharge === 0 ? "#388e3c" : "inherit" }}>
                  {deliveryCharge === 0 ? "FREE" : `$${deliveryCharge}`}
                </span>
              </div>
              <div className="fk-price-total">
                <span>Total Amount</span>
                <span>${finalTotal}</span>
              </div>
              {discount > 0 && (
                <p style={{ fontSize: "0.82rem", color: "#388e3c", fontWeight: 600, marginTop: 10 }}>
                  You will save ${discount.toFixed(2)} on this order
                </p>
              )}
              <button className="fk-checkout-btn" onClick={handleCheckoutClick}>
                PLACE ORDER
              </button>

              <div style={{ marginTop: 16, padding: "12px 0", borderTop: "1px solid rgba(128,128,128,0.12)" }}>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <i className="bi bi-shield-fill-check text-success"></i>
                  Safe and Secure Payments. Easy returns. 100% Authentic products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Cart;
