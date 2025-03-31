import React, { useState, useEffect, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CartItems.css';
import addIcon from '../../Assets/add.png';
import minusIcon from '../../Assets/minus.png';
import deleteIcon from '../../Assets/delete.png';
import { Link } from 'react-router-dom';
import { CARTS_URL, PRODUCT_URL, ORDERS_URL, USERS_URL } from '../../API/constants';
import axiosInstance from '../../API/axiosInstance.js';
import { AuthContext } from '../../contexts/auth.context.js';

const CartItems = () => {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        securityCode: '',
        deliveryAddress: '',
    });
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        try {
            const response = await axiosInstance.get(`${CARTS_URL}/me`);
            console.log('My Cart', response.data.data);
            setCart(response.data.data || { items: [] });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!cart.items.length) return;

            const productIds = cart.items.map((item) => item.product.id);
            try {
                const responses = await Promise.all(
                    productIds.map((productId) => axiosInstance.get(`${PRODUCT_URL}/${productId}`)),
                );
                const productsData = responses.map((response) => response.data.data);
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails();
    }, [cart]);

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`${CARTS_URL}/items/${id}`);
            fetchCartItems();
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleQuantityChange = async (id, change) => {
        try {
            const cartItem = cart.items.find((item) => item.id === id);
            if (!cartItem) return;

            const newQuantity = cartItem.quantity + change;

            if (newQuantity <= 0) {
                await handleDelete(id);
                return;
            }

            const response = await axiosInstance.put(`${CARTS_URL}/items/${id}`, {
                quantity: newQuantity,
            });

            if (response.status === 200) {
                fetchCartItems();
            } else {
                throw new Error('Failed to update quantity');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleCheckout = async () => {
        document.body.classList.add('modal-open');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        document.body.classList.remove('modal-open');
        setShowModal(false);
    };

    const handleConfirmCheckout = async () => {
        if (!selectedItem) {
            console.error('No item selected');
            return;
        }

        const { cardNumber, expiryDate, securityCode, deliveryAddress } = paymentDetails;
        if (!cardNumber || !expiryDate || !securityCode || !deliveryAddress) {
            console.error('Payment details are incomplete');
            alert('Please complete all payment details');
            return;
        }

        const [expiryMonth, expiryYear] = expiryDate.trim().split('/');
        const cardExpirationYear = expiryYear;
        const cardExpirationMonth = expiryMonth;

        const paymentInfo = {
            productId: selectedItem.product.id,
            packageId: selectedItem.package.id,
            quantity: selectedItem.quantity,
            price: selectedItem.price,
            cardNumber,
            cardExpirationYear,
            cardExpirationMonth,
            cardSecurityCode: securityCode,
        };

        console.log('Payment Info', paymentInfo);

        try {
            const updateUserAddressResponse = await axiosInstance.put(`${USERS_URL}/${user.username}`, {
                address: deliveryAddress,
            });
            const orderResponse = await axiosInstance.post(`${ORDERS_URL}`, paymentInfo);
            const deleteCartItemResponse = await axiosInstance.delete(`${CARTS_URL}/items/${selectedItem.id}`);

            document.body.classList.remove('modal-open');
            setShowModal(false);
        } catch (error) {
            console.log('Error during checkout:', error);
            alert('An error occurred during checkout. Please try again.');
        }
    };

    useEffect(() => {
        const total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(total);
    }, [cart.items]);

    const toggleSelectItem = (item) => {
        setSelectedItemId((prevSelectedItemId) => (prevSelectedItemId === item.id ? null : item.id));
        setSelectedItem((prevSelectedItem) => (prevSelectedItem === item ? null : item));
    };

    const isItemSelected = (itemId) => selectedItemId === itemId;

    console.log('Cart items', cart.items);
    console.log('Products', products);

    return (
        <div className="grid-container">
            <div className="elements-container">
                <div className="grid-item">
                    <div className="cart-container">
                        <div className="flex-container">
                            <div className="items-container">
                                {cart.items.length > 0 ? (
                                    cart.items.map((item, index) => {
                                        const product = products.find((product) => product.id === item.product.id);
                                        return (
                                            <div
                                                key={index}
                                                className={`item ${isItemSelected(item.id) ? 'selected' : ''}`}
                                                onClick={() => toggleSelectItem(item)}
                                            >
                                                {product && (
                                                    <>
                                                        <img src={product.imageUrl} alt={item.product.name} />
                                                        <div className="item-details">
                                                            <p>
                                                                {item.product.name} [{item.package.name}]
                                                            </p>
                                                            <div className="price-quantity-container">
                                                                <div className="price-container">
                                                                    <p>
                                                                        ₱
                                                                        {parseFloat(item.price * item.quantity).toFixed(
                                                                            2,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div className="quantity-container">
                                                                    <button
                                                                        className="quantity-btn"
                                                                        onClick={() =>
                                                                            handleQuantityChange(item.id, -1)
                                                                        }
                                                                    >
                                                                        <img src={minusIcon} alt="minus" />
                                                                    </button>
                                                                    <div className="quantity-value">
                                                                        {item.quantity}
                                                                    </div>
                                                                    <button
                                                                        className="quantity-btn"
                                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                                    >
                                                                        <img src={addIcon} alt="add" />
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    className="delete-btn"
                                                                    onClick={() => handleDelete(item.id)}
                                                                >
                                                                    <img src={deleteIcon} alt="delete" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>Your cart is empty</p>
                                )}
                                <Link to={'/products'}>
                                    <button className="btn add-btn">Add Item</button>
                                </Link>
                            </div>
                            <div className="checkout-container">
                                <h2>Order Summary</h2>
                                <h3>In cart:</h3>
                                <div className="cart-items">
                                    {cart.items.map((item) => (
                                        <p key={item.id}>
                                            {item.product.name} [{item.package.name}], ₱
                                            {parseFloat(item.price).toFixed(2)} x {item.quantity} = ₱
                                            {parseFloat(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    ))}
                                </div>
                                <div className="totals">
                                    <p>
                                        <strong>Total:</strong> ₱{parseFloat(total).toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    className="btn checkout-btn"
                                    onClick={handleCheckout}
                                    disabled={selectedItemId === null}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title className="cart-modal-title-center">
                        <h2>Checkout</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="cart-modal-body-center">
                    <p>Please provide your payment credentials.</p>
                    {selectedItem && (
                        <p>
                            To pay:{' '}
                            <strong>₱{parseFloat(selectedItem.price * selectedItem.quantity).toFixed(2)}</strong>
                        </p>
                    )}
                    <form>
                        <div className="form-group">
                            <label htmlFor="cardNumber">Card Number</label>
                            <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                value={paymentDetails.cardNumber}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="expiryDate">Expiry Date</label>
                            <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={paymentDetails.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM/YYYY"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="securityCode">Security Code</label>
                            <input
                                type="text"
                                id="securityCode"
                                name="securityCode"
                                value={paymentDetails.securityCode}
                                onChange={handleInputChange}
                                placeholder="123"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="deliveryAddress">Delivery Address</label>
                            <input
                                type="text"
                                id="ddeliveryAddress"
                                name="deliveryAddress"
                                value={paymentDetails.deliveryAddress}
                                onChange={handleInputChange}
                                placeholder="Metro Manila, Philippines"
                                required
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleCloseModal}>
                        Close
                    </button>
                    <button className="btn btn-primary" onClick={handleConfirmCheckout}>
                        Confirm Checkout
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CartItems;
