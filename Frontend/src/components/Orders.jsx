import React, { useState, useEffect, useContext } from "react";
import API from "../axios.jsx";
import AppContext from "../Context/Context";

const STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"];

// Give each order a pseudo-random but deterministic status based on its id
const getOrderStatus = (orderId) => {
  const n = parseInt(String(orderId).slice(-1), 10) || 0;
  return Math.min(n % 4, 3);
};

const OrderStepper = ({ statusIndex }) => (
  <div className="order-stepper">
    {STEPS.map((step, i) => {
      const done = i < statusIndex;
      const active = i === statusIndex;
      return (
        <React.Fragment key={step}>
          {i > 0 && <div className={`order-step__line ${done || active ? "order-step__line--done" : ""}`} />}
          <div className="order-step">
            <div className={`order-step__circle ${done ? "order-step__circle--done" : active ? "order-step__circle--active" : ""}`}>
              {done ? "✓" : i + 1}
            </div>
            <div className={`order-step__label ${done ? "order-step__label--done" : active ? "order-step__label--active" : ""}`}>
              {step}
            </div>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

const Orders = () => {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    API.get(`/orders/user/${user.email}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="container text-center" style={{ paddingTop: "120px", minHeight: "80vh" }}>
        <i className="bi bi-person-lock" style={{ fontSize: "4rem", color: "#94a3b8" }}></i>
        <h3 className="mt-3">Please log in to view your orders</h3>
        <a href="/login" className="auth-btn-primary d-inline-flex mt-3" style={{ maxWidth: 200, margin: "12px auto" }}>Go to Login</a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container text-center" style={{ paddingTop: "120px", minHeight: "80vh" }}>
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}></div>
        <p className="mt-3 text-muted">Loading your orders…</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "100px", minHeight: "80vh", maxWidth: 860 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">My Orders</h2>
        <a href="/" className="btn btn-outline-primary btn-sm rounded-pill">Continue Shopping</a>
      </div>

      {orders.length === 0 ? (
        <div className="fk-cart-panel">
          <div className="fk-empty-cart">
            <div className="fk-empty-cart__icon">📦</div>
            <div className="fk-empty-cart__title">No orders yet</div>
            <p className="fk-empty-cart__sub">When you place an order, it will appear here.</p>
            <button className="fk-shop-btn" onClick={() => window.location.href = "/"}>Start Shopping</button>
          </div>
        </div>
      ) : (
        <div>
          {orders.map((order, oi) => {
            const statusIndex = getOrderStatus(order.id);
            return (
              <div key={order.id} className="fk-cart-panel mb-3 order-card-anim" style={{ animationDelay: `${oi * 0.08}s` }}>
                {/* Header */}
                <div className="fk-cart-title d-flex justify-content-between align-items-center" style={{ padding: "14px 20px" }}>
                  <div>
                    <span className="text-muted" style={{ fontSize: "0.78rem" }}>Order ID #{order.id}</span>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, marginTop: 2 }}>
                      {new Date(order.orderDate).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="text-muted" style={{ fontSize: "0.78rem" }}>Total</span>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#388e3c" }}>${order.totalAmount}</div>
                  </div>
                </div>

                {/* Stepper */}
                <div style={{ padding: "8px 20px 0" }}>
                  <OrderStepper statusIndex={statusIndex} />
                </div>

                {/* Items */}
                <div style={{ padding: "12px 20px" }}>
                  <div className="row mb-2 pb-2" style={{ borderBottom: "1px solid rgba(128,128,128,0.1)" }}>
                    <div className="col-md-6">
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>DELIVERY ADDRESS</div>
                      <div style={{ fontSize: "0.88rem" }}>{order.address}</div>
                    </div>
                    <div className="col-md-6 text-md-end mt-2 mt-md-0">
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>PAYMENT</div>
                      <div style={{ fontSize: "0.88rem" }}>
                        <i className={`bi ${order.paymentMethod === "Cash on Delivery" ? "bi-cash-coin" : "bi-credit-card"} me-1`}></i>
                        {order.paymentMethod}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>
                    ITEMS ({order.items?.length || 0})
                  </div>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: idx < order.items.length - 1 ? "1px solid rgba(128,128,128,0.08)" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {item.productImageUrl ? (
                          <img src={item.productImageUrl} alt={item.productName} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4 }} />
                        ) : (
                          <div style={{ width: 48, height: 48, background: "#e9ecef", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="bi bi-image text-muted"></i>
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{item.productName}</div>
                          <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{item.productBrand} · Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>${(item.priceAtPurchase * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
