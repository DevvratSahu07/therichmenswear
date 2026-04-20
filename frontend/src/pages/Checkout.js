import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createRazorpayOrder, verifyPayment, getAddresses, addAddress } from '../api/api';
import { clearCart } from '../redux/store';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const cart = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '',
  });

  const subtotal = cart.reduce((sum, i) => sum + (i.finalPrice || i.price) * i.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 49;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    getAddresses().then((res) => {
      setAddresses(res.data.addresses);
      const def = res.data.addresses.find((a) => a.isDefault);
      if (def) setSelectedAddress(def.id);
    });
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addAddress(newAddress);
      setAddresses([...addresses, res.data.address]);
      setSelectedAddress(res.data.address.id);
      setShowAddressForm(false);
      toast.success('Address added!');
    } catch (err) {
      toast.error('Error adding address');
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setLoading(true);
    try {
      const addr = addresses.find((a) => a.id === selectedAddress);
      const { data: order } = await createRazorpayOrder(Math.round(total));

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.order.amount,
        currency: 'INR',
        name: "The Rich Mens's wear",
        description: `Order for ${cart.length} items`,
        image: '/logo.png',
        order_id: order.order.id,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || '',
        },
        theme: { color: '#ff3f6c' },
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: cart,
              totalAmount: total,
              shippingAddress: addr,
            });

            if (verifyRes.data.success) {
              dispatch(clearCart());
              navigate('/order-success', { state: { order: verifyRes.data.order } });
            }
          } catch {
            toast.error('Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error('Error initiating payment');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        <h2>DELIVERY ADDRESS</h2>

        {addresses.map((addr) => (
          <div key={addr.id} className={`address-card ${selectedAddress === addr.id ? 'selected' : ''}`} onClick={() => setSelectedAddress(addr.id)}>
            <input type="radio" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} />
            <div className="address-details">
              <h4>{addr.fullName} <span className="address-tag">HOME</span></h4>
              <p>{addr.addressLine1}, {addr.addressLine2}</p>
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
              <p>📞 {addr.phone}</p>
            </div>
          </div>
        ))}

        <button className="add-address-btn" onClick={() => setShowAddressForm(!showAddressForm)}>
          + ADD NEW ADDRESS
        </button>

        {showAddressForm && (
          <form onSubmit={handleAddAddress} className="address-form">
            <h3>Add New Address</h3>
            <div className="form-row">
              <input required placeholder="Full Name" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
              <input required placeholder="Phone Number" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
            </div>
            <input required placeholder="Address Line 1" value={newAddress.addressLine1} onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
            <input placeholder="Address Line 2 (Optional)" value={newAddress.addressLine2} onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })} />
            <div className="form-row">
              <input required placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
              <input required placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
              <input required placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
            </div>
            <button type="submit" className="save-address-btn">SAVE ADDRESS</button>
          </form>
        )}
      </div>

      <div className="checkout-right">
        <h2>ORDER SUMMARY</h2>
        {cart.map((item) => (
          <div key={`${item.id}-${item.selectedSize}`} className="checkout-item">
            <img src={item.image} alt={item.name} />
            <div>
              <h4>{item.brand}</h4>
              <p>{item.name}</p>
              {item.selectedSize && <p>Size: {item.selectedSize}</p>}
              <p>Qty: {item.quantity}</p>
              <strong>₹{Math.round((item.finalPrice || item.price) * item.quantity)}</strong>
            </div>
          </div>
        ))}
        <hr />
        <div className="checkout-total">
          <div className="total-row"><span>Subtotal</span><span>₹{Math.round(subtotal)}</span></div>
          <div className="total-row"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
          <div className="total-row grand"><span>Total</span><span>₹{Math.round(total)}</span></div>
        </div>
        <button
          className="pay-now-btn"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : `PAY ₹${Math.round(total)}`}
        </button>
        <p className="secure-text">🔒 Secured by Razorpay</p>
      </div>
    </div>
  );
};

export default Checkout;
