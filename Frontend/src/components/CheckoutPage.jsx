import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import axios from "axios";

const STEPS = ["Cart Review", "Delivery", "Payment", "Confirm"];

const paymentOptions = [
  { id: "upi", label: "UPI", icon: "📱", sub: "Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: "💳", sub: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: "🏦", sub: "All major banks supported" },
  { id: "cod", label: "Cash on Delivery", icon: "💵", sub: "Pay when you receive" },
];

const getDateAfterDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
};

const DELIVERY_SLOTS = [
  { id: "standard", label: "Standard Delivery", icon: "📦", days: 5, daysMax: 7, extra: 0,    badge: "FREE",   badgeColor: "#22c55e", desc: "Arrives in 5–7 business days" },
  { id: "express",  label: "Express Delivery",  icon: "🚀", days: 2, daysMax: 2, extra: 4.99, badge: "+$4.99", badgeColor: "#f59e0b", desc: "Arrives in 2 business days" },
  { id: "sameday",  label: "Same Day Delivery", icon: "⚡", days: 0, daysMax: 0, extra: 9.99, badge: "+$9.99", badgeColor: "#ef4444", desc: "Order before 12 PM to get it today" },
  { id: "scheduled",label: "Scheduled Delivery",icon: "📅", days: -1, daysMax: -1, extra: 2.99, badge: "Custom", badgeColor: "#6366f1", desc: "Choose your preferred date" },
];

/* ── Animated success screen ── */
const OrderSuccess = ({ orderId, onDone, placedSlot }) => (
  <div className="co-success">
    <div className="co-success__burst">
      <svg viewBox="0 0 120 120" className="co-success__circle-svg">
        <circle cx="60" cy="60" r="54" className="co-success__ring" />
        <polyline points="36,62 52,78 84,44" className="co-success__tick" />
      </svg>
    </div>
    <h2 className="co-success__title">Order Placed! 🎉</h2>
    <p className="co-success__sub">
      Your order <strong>#{orderId}</strong> has been confirmed.
    </p>
    <div className="co-delivery-eta">
      <span>{placedSlot?.icon || "📦"}</span>
      <div>
        <div className="co-delivery-eta__label">{placedSlot?.label || "Estimated Delivery"}</div>
        <div className="co-delivery-eta__date">
          {placedSlot?.customDate 
            ? new Date(placedSlot.customDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
            : (placedSlot ? getDateAfterDays(placedSlot.days) : getDateAfterDays(5))}
        </div>
      </div>
    </div>
    <div className="co-success__steps">
      {["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"].map((s, i) => (
        <div key={s} className="co-success__step">
          <div className={`co-success__dot ${i === 0 ? "co-success__dot--active" : ""}`} />
          <span>{s}</span>
        </div>
      ))}
    </div>
    <button className="co-btn co-btn--primary" style={{ marginTop: 32 }} onClick={onDone}>
      View My Orders →
    </button>
  </div>
);

/* ── Step indicator ── */
const StepBar = ({ current }) => (
  <div className="co-stepbar">
    {STEPS.map((s, i) => (
      <React.Fragment key={s}>
        {i > 0 && <div className={`co-stepbar__line ${i <= current ? "co-stepbar__line--done" : ""}`} />}
        <div className="co-stepbar__item">
          <div className={`co-stepbar__dot ${i < current ? "co-stepbar__dot--done" : i === current ? "co-stepbar__dot--active" : ""}`}>
            {i < current ? "✓" : i + 1}
          </div>
          <span className={`co-stepbar__label ${i === current ? "co-stepbar__label--active" : ""}`}>{s}</span>
        </div>
      </React.Fragment>
    ))}
  </div>
);

/* ══════════════════════════════════════════ */
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart, user } = useContext(AppContext);

  const [step, setStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({ name: "", phone: "", line1: "", city: "", state: "", pin: "" });
  const [deliverySlot, setDeliverySlot] = useState(DELIVERY_SLOTS[0]); // default: Standard
  const [customDate, setCustomDate] = useState("");
  const [payment, setPayment] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placedId, setPlacedId] = useState(null);
  const [placedSlot, setPlacedSlot] = useState(null);
  const [errors, setErrors] = useState({});

  /* load cart items */
  useEffect(() => {
    if (!cart.length) return;
    setCartItems(
      cart.map(item => ({
        ...item,
        imageUrl: `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}`}/product/${item.id}/image`,
      }))
    );
  }, [cart]);

  /* pre-fill address */
  useEffect(() => {
    if (user) {
      setAddress(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        line1: user.address || "",
      }));
    }
  }, [user]);

  /* derived totals */
  const subtotal   = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const mrp        = cartItems.reduce((s, i) => s + i.price * 1.2 * i.quantity, 0);
  const discount   = mrp - subtotal;
  const baseDelivery = subtotal >= 499 ? 0 : 49;
  const slotExtra  = deliverySlot.extra;
  const delivery   = baseDelivery + slotExtra;
  const total      = subtotal + delivery;
  const itemCount  = cartItems.reduce((s, i) => s + i.quantity, 0);

  /* ── Validation ── */
  const validateAddress = () => {
    const e = {};
    if (!address.name.trim()) e.name = "Full name is required";
    if (!/^\d{10}$/.test(address.phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!address.line1.trim()) e.line1 = "Address is required";
    if (!address.city.trim()) e.city = "City is required";
    if (!address.state.trim()) e.state = "State is required";
    if (!/^\d{6}$/.test(address.pin)) e.pin = "Enter a valid 6-digit PIN";
    if (deliverySlot.id === "scheduled" && !customDate) e.customDate = "Please select a delivery date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (payment === "upi" && !/^[\w.\-]+@[\w]+$/.test(upiId)) e.upi = "Enter a valid UPI ID (e.g. name@upi)";
    if (payment === "card") {
      if (!/^\d{16}$/.test(cardNum.replace(/\s/g, ""))) e.cardNum = "Enter a valid 16-digit card number";
      if (!cardName.trim()) e.cardName = "Name on card is required";
      if (!/^\d{2}\/\d{2}$/.test(cardExp)) e.cardExp = "Format: MM/YY";
      if (!/^\d{3}$/.test(cardCvv)) e.cardCvv = "CVV must be 3 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateAddress()) return;
    if (step === 2 && !validatePayment()) return;
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep(s => s - 1);
    setErrors({});
  };

  /* ── Place Order ── */
  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const formattedCustomDate = customDate ? new Date(customDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) : "";
      const displayDate = deliverySlot.id === "scheduled" ? formattedCustomDate : getDateAfterDays(deliverySlot.days);
      const slotInfo = `[${deliverySlot.label} — by ${displayDate}]`;
      const fullAddress = `${address.name}, ${address.phone}, ${address.line1}, ${address.city}, ${address.state} - ${address.pin} ${slotInfo}`;
      const payMethod = paymentOptions.find(p => p.id === payment)?.label || payment;

      const payload = {
        userEmail: user?.email || "guest@example.com",
        totalAmount: total.toFixed(2),
        address: fullAddress,
        paymentMethod: payMethod,
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          productBrand: item.brand,
          priceAtPurchase: item.price,
          quantity: item.quantity,
          productImageUrl: item.imageUrl,
        })),
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}/orders`, payload);
      clearCart();
      setPlacedSlot({ ...deliverySlot, customDate });
      setPlacedId(res.data?.id || "—");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  /* ── Empty cart guard ── */
  if (!cart.length && !placedId) {
    return (
      <div className="co-empty">
        <div style={{ fontSize: 72 }}>🛒</div>
        <h3>Your cart is empty</h3>
        <button className="co-btn co-btn--primary" onClick={() => navigate("/")}>Browse Products</button>
      </div>
    );
  }

  /* ── Order placed success ── */
  if (placedId) return <OrderSuccess orderId={placedId} onDone={() => navigate("/orders")} placedSlot={placedSlot} />;

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <div className="co-page">
      <div className="co-container">

        {/* Step bar */}
        <StepBar current={step} />

        <div className="co-body">

          {/* ─── LEFT PANEL ─── */}
          <div className="co-main">

            {/* STEP 0 — Cart Review */}
            {step === 0 && (
              <div className="co-card co-anim">
                <div className="co-card__head">🛒 Review Your Cart</div>
                {cartItems.map(item => (
                  <div key={item.id} className="co-item">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="co-item__img"
                      onError={e => { e.target.src = `https://picsum.photos/seed/${item.id}/80/80`; }}
                    />
                    <div className="co-item__info">
                      <div className="co-item__name">{item.name}</div>
                      <div className="co-item__brand">{item.brand}</div>
                      <div className="co-item__qty">Qty: {item.quantity}</div>
                    </div>
                    <div className="co-item__price">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 1 — Delivery Address */}
            {step === 1 && (
              <div className="co-card co-anim">
                <div className="co-card__head">📍 Delivery Address</div>
                <div className="co-form-grid">
                  <div className="co-field co-field--full">
                    <label>Full Name *</label>
                    <input value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} placeholder="John Doe" className={errors.name ? "co-input co-input--err" : "co-input"} />
                    {errors.name && <span className="co-err">{errors.name}</span>}
                  </div>
                  <div className="co-field">
                    <label>Phone Number *</label>
                    <input value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} placeholder="10-digit number" maxLength={10} className={errors.phone ? "co-input co-input--err" : "co-input"} />
                    {errors.phone && <span className="co-err">{errors.phone}</span>}
                  </div>
                  <div className="co-field">
                    <label>PIN Code *</label>
                    <input value={address.pin} onChange={e => setAddress({ ...address, pin: e.target.value })} placeholder="6-digit PIN" maxLength={6} className={errors.pin ? "co-input co-input--err" : "co-input"} />
                    {errors.pin && <span className="co-err">{errors.pin}</span>}
                  </div>
                  <div className="co-field co-field--full">
                    <label>Address / Street *</label>
                    <input value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} placeholder="Flat no, Building, Street" className={errors.line1 ? "co-input co-input--err" : "co-input"} />
                    {errors.line1 && <span className="co-err">{errors.line1}</span>}
                  </div>
                  <div className="co-field">
                    <label>City *</label>
                    <input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} placeholder="Mumbai" className={errors.city ? "co-input co-input--err" : "co-input"} />
                    {errors.city && <span className="co-err">{errors.city}</span>}
                  </div>
                  <div className="co-field">
                    <label>State *</label>
                    <input value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} placeholder="Maharashtra" className={errors.state ? "co-input co-input--err" : "co-input"} />
                    {errors.state && <span className="co-err">{errors.state}</span>}
                  </div>
                </div>
                {/* ── Delivery Slot Picker ── */}
                <div style={{ marginTop: 24 }}>
                  <div className="co-field-label-sm">🚚 Choose Delivery Speed</div>
                  <div className="co-slot-grid">
                    {DELIVERY_SLOTS.map(slot => (
                      <label
                        key={slot.id}
                        className={`co-slot-card ${deliverySlot.id === slot.id ? "co-slot-card--active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="deliverySlot"
                          hidden
                          checked={deliverySlot.id === slot.id}
                          onChange={() => setDeliverySlot(slot)}
                        />
                        <div className="co-slot-card__icon">{slot.icon}</div>
                        <div className="co-slot-card__info">
                          <div className="co-slot-card__label">{slot.label}</div>
                          <div className="co-slot-card__date">
                            {slot.id === "scheduled" ? "Pick a date below" : (slot.days === 0 ? "Today" : getDateAfterDays(slot.days))}
                          </div>
                          <div className="co-slot-card__desc">{slot.desc}</div>
                        </div>
                        <div className="co-slot-card__badge" style={{ background: slot.badgeColor }}>
                          {slot.badge}
                        </div>
                        {deliverySlot.id === slot.id && (
                          <div className="co-slot-card__check">✓</div>
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Custom Date Input for Scheduled Delivery */}
                  {deliverySlot.id === "scheduled" && (
                    <div className="co-anim" style={{ marginTop: 16, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: 16 }}>
                      <div className="co-field">
                        <label style={{ color: "#818cf8" }}>Select Delivery Date *</label>
                        <input
                          type="date"
                          className={errors.customDate ? "co-input co-input--err" : "co-input"}
                          value={customDate}
                          min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Tomorrow
                          onChange={e => { setCustomDate(e.target.value); setErrors(prev => ({ ...prev, customDate: null })); }}
                          style={{ maxWidth: 220, background: "rgba(255,255,255,0.08)", borderColor: "#6366f1" }}
                        />
                        {errors.customDate && <span className="co-err">{errors.customDate}</span>}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <div className="co-card co-anim">
                <div className="co-card__head">💳 Payment Method</div>
                <div className="co-payment-options">
                  {paymentOptions.map(opt => (
                    <label key={opt.id} className={`co-pay-opt ${payment === opt.id ? "co-pay-opt--selected" : ""}`}>
                      <input type="radio" name="payment" value={opt.id} checked={payment === opt.id} onChange={() => { setPayment(opt.id); setErrors({}); }} hidden />
                      <span className="co-pay-opt__icon">{opt.icon}</span>
                      <div>
                        <div className="co-pay-opt__label">{opt.label}</div>
                        <div className="co-pay-opt__sub">{opt.sub}</div>
                      </div>
                      <div className="co-pay-opt__check">{payment === opt.id ? "✓" : ""}</div>
                    </label>
                  ))}
                </div>

                {/* UPI input */}
                {payment === "upi" && (
                  <div className="co-pay-detail co-anim">
                    <label>UPI ID *</label>
                    <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" className={errors.upi ? "co-input co-input--err" : "co-input"} />
                    {errors.upi && <span className="co-err">{errors.upi}</span>}
                    <p className="co-pay-note">🔒 Simulated — no real transaction will occur</p>
                  </div>
                )}

                {/* Card input */}
                {payment === "card" && (
                  <div className="co-pay-detail co-anim">
                    <div className="co-card-preview">
                      <div className="co-card-preview__chip">▪▪▪</div>
                      <div className="co-card-preview__num">{cardNum.replace(/(.{4})/g, "$1 ").trim() || "•••• •••• •••• ••••"}</div>
                      <div className="co-card-preview__row">
                        <span>{cardName || "CARD HOLDER"}</span>
                        <span>{cardExp || "MM/YY"}</span>
                      </div>
                    </div>
                    <div className="co-form-grid" style={{ marginTop: 16 }}>
                      <div className="co-field co-field--full">
                        <label>Card Number *</label>
                        <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16))} placeholder="16-digit card number" className={errors.cardNum ? "co-input co-input--err" : "co-input"} />
                        {errors.cardNum && <span className="co-err">{errors.cardNum}</span>}
                      </div>
                      <div className="co-field co-field--full">
                        <label>Name on Card *</label>
                        <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="As printed on card" className={errors.cardName ? "co-input co-input--err" : "co-input"} />
                        {errors.cardName && <span className="co-err">{errors.cardName}</span>}
                      </div>
                      <div className="co-field">
                        <label>Expiry *</label>
                        <input value={cardExp} onChange={e => setCardExp(e.target.value)} placeholder="MM/YY" maxLength={5} className={errors.cardExp ? "co-input co-input--err" : "co-input"} />
                        {errors.cardExp && <span className="co-err">{errors.cardExp}</span>}
                      </div>
                      <div className="co-field">
                        <label>CVV *</label>
                        <input value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="3 digits" type="password" maxLength={3} className={errors.cardCvv ? "co-input co-input--err" : "co-input"} />
                        {errors.cardCvv && <span className="co-err">{errors.cardCvv}</span>}
                      </div>
                    </div>
                    <p className="co-pay-note">🔒 Simulated — no real transaction will occur</p>
                  </div>
                )}

                {payment === "netbanking" && (
                  <div className="co-pay-detail co-anim">
                    <div className="co-bank-grid">
                      {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"].map(b => (
                        <div key={b} className="co-bank-tile">{b}</div>
                      ))}
                    </div>
                    <p className="co-pay-note">🔒 Simulated — no real transaction will occur</p>
                  </div>
                )}

                {payment === "cod" && (
                  <div className="co-pay-detail co-anim">
                    <div className="co-cod-box">
                      <span>💵</span>
                      <p>Pay <strong>${total.toFixed(2)}</strong> in cash when your order is delivered.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 — Confirm */}
            {step === 3 && (
              <div className="co-card co-anim">
                <div className="co-card__head">✅ Order Confirmation</div>

                <div className="co-confirm-section">
                  <div className="co-confirm-label">📍 Delivering To</div>
                  <div className="co-confirm-val">{address.name} · {address.phone}</div>
                  <div className="co-confirm-val" style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
                    {address.line1}, {address.city}, {address.state} — {address.pin}
                  </div>
                </div>

                <div className="co-confirm-section">
                  <div className="co-confirm-label">💳 Payment</div>
                  <div className="co-confirm-val">{paymentOptions.find(p => p.id === payment)?.label}</div>
                </div>

                <div className="co-confirm-section">
                  <div className="co-confirm-label">🚚 Delivery</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                    <span style={{ fontSize: "1.4rem" }}>{deliverySlot.icon}</span>
                    <div>
                      <div className="co-confirm-val">{deliverySlot.label}</div>
                      <div style={{ fontSize: "0.82rem", color: "#86efac", marginTop: 2 }}>
                        Expected by <strong>
                          {deliverySlot.id === "scheduled" 
                            ? new Date(customDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) 
                            : (deliverySlot.days === 0 ? "Today" : getDateAfterDays(deliverySlot.days))}
                        </strong>
                      </div>
                    </div>
                    <span
                      style={{ marginLeft: "auto", fontSize: "0.78rem", fontWeight: 700,
                               padding: "3px 10px", borderRadius: 20,
                               background: deliverySlot.badgeColor + "22",
                               color: deliverySlot.badgeColor, border: `1px solid ${deliverySlot.badgeColor}44` }}
                    >
                      {deliverySlot.badge}
                    </span>
                  </div>
                </div>

                <div className="co-confirm-section">
                  <div className="co-confirm-label">📦 Items ({itemCount})</div>
                  {cartItems.map(item => (
                    <div key={item.id} className="co-confirm-item">
                      <img src={item.imageUrl} alt={item.name} className="co-confirm-item__img" onError={e => { e.target.src = `https://picsum.photos/seed/${item.id}/50/50`; }} />
                      <span>{item.name} × {item.quantity}</span>
                      <span style={{ marginLeft: "auto", fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="co-delivery-info">
                  <span>🚚</span>
                  <span>Expected by <strong>{getEstimatedDelivery()}</strong></span>
                </div>

                <button
                  id="place-order-btn"
                  className="co-btn co-btn--place"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? (
                    <span className="co-spinner" />
                  ) : (
                    <>🛒 Place Order · ${total.toFixed(2)}</>
                  )}
                </button>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="co-nav-btns">
              {step > 0 && (
                <button className="co-btn co-btn--back" onClick={handleBack}>← Back</button>
              )}
              {step < 3 && (
                <button className="co-btn co-btn--primary" onClick={handleNext}>
                  {step === 0 ? "Deliver Here →" : step === 1 ? "Proceed to Payment →" : "Review Order →"}
                </button>
              )}
            </div>
          </div>

          {/* ─── RIGHT PANEL — Price Summary ─── */}
          <div className="co-sidebar">
            <div className="co-card">
              <div className="co-card__head">Price Details</div>
              <div className="co-price-row">
                <span>Price ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                <span>${mrp.toFixed(2)}</span>
              </div>
              <div className="co-price-row co-price-row--green">
                <span>Discount</span>
                <span>− ${discount.toFixed(2)}</span>
              </div>
              <div className="co-price-row">
                <span>Base Delivery</span>
                <span style={{ color: baseDelivery === 0 ? "#22c55e" : "inherit" }}>
                  {baseDelivery === 0 ? "FREE" : `$${baseDelivery}`}
                </span>
              </div>
              {slotExtra > 0 && (
                <div className="co-price-row">
                  <span>{deliverySlot.label}</span>
                  <span style={{ color: "#f59e0b" }}>+${slotExtra.toFixed(2)}</span>
                </div>
              )}
              <div className="co-price-total">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="co-savings-badge">
                  🎉 You save ${discount.toFixed(2)} on this order!
                </div>
              )}
            </div>

            <div className="co-card co-trust-badges">
              <div className="co-trust">🔒 100% Secure Payments</div>
              <div className="co-trust">✅ Easy 7-day Returns</div>
              <div className="co-trust">📦 100% Authentic Products</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
