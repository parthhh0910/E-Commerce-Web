import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import AppContext from '../Context/Context';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  const { user } = useContext(AppContext);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  // Pre-fill address when modal opens or user changes
  useEffect(() => {
    if (user && user.address) {
      setAddress(user.address);
    }
  }, [user, show]);

  const onConfirm = () => {
    if (!address.trim()) {
      alert("Please enter a valid delivery address.");
      return;
    }
    // Pass the checkout details back to the parent
    handleCheckout({ address, paymentMethod });
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Complete Purchase</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="checkout-items mb-4">
          <h6 className="mb-3 border-bottom pb-2">Order Summary</h6>
          {cartItems.map((item) => (
            <div key={item.id} className="d-flex align-items-center mb-2">
              <img src={item.imageUrl} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }} />
              <div className="flex-grow-1">
                <span className="fw-semibold d-block" style={{ fontSize: '0.9rem' }}>{item.name}</span>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Qty: {item.quantity} × ${item.price}</span>
              </div>
              <div className="fw-bold text-end">
                ${item.price * item.quantity}
              </div>
            </div>
          ))}
          <div className="mt-3 pt-3 border-top">
            <h5 className="d-flex justify-content-between fw-bold text-primary m-0">
              <span>Total Amount:</span>
              <span>${totalPrice}</span>
            </h5>
          </div>
        </div>

        <h6 className="mb-3 border-bottom pb-2">Delivery Details</h6>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Shipping Address</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2} 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Enter your full delivery address"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="Cash on Delivery">Cash on Delivery (COD)</option>
            </Form.Select>
          </Form.Group>

          {/* Mock Payment Details Box */}
          {paymentMethod !== "Cash on Delivery" && (
            <div className="p-3 bg-light rounded text-center border mt-3" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-lock-fill text-success me-1"></i>
              Secure Mock Payment Gateway
              <p className="text-muted m-0 mt-1">Payment will be simulated and successfully processed instantly upon clicking confirm.</p>
            </div>
          )}
        </Form>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={onConfirm} className="px-4 fw-bold">
          Pay ${totalPrice} & Confirm Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutPopup;
