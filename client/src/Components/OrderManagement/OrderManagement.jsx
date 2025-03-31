import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import './OrderManagement.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../API/axiosInstance';
import { ORDERS_URL, USERS_URL } from '../../API/constants';

const OrderManagement = () => {
    const [filter, setFilter] = useState('All Orders');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [orders, setOrders] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get(`${ORDERS_URL}`, { withCredentials: true });
                setOrders(response.data.data.items);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const fetchUser = async (userId) => {
        try {
            const response = await axiosInstance.get(`${USERS_URL}/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const StatusMessage = ({ message, type }) => (
        <div className={`status-message ${type}`}>{message}</div>
    );

    const openOrderDetailsModal = async (orderId) => {
        const orderDetails = orders.find(order => order.id === orderId);
        if (orderDetails) {
            if (orderDetails.userId) {
                try {
                    const user = await fetchUser(orderDetails.userId);
                    const orderDetailsWithUsername = { ...orderDetails, username: user.username };
                    setSelectedOrderDetails(orderDetailsWithUsername);
                    setShowDetailsModal(true);
                    console.log('Order Details:', orderDetailsWithUsername);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const today = new Date().toISOString();
        try {
            await axiosInstance.patch(`${ORDERS_URL}/${orderId}`, {
                status: newStatus,
                dateCompleted: newStatus === 'DELIVERED' ? today : null
            });

            const updatedOrders = orders.map(order => {
                if (order.id === orderId) {
                    return { ...order, status: newStatus, dateCompleted: newStatus === 'DELIVERED' ? today : null };
                }
                return order;
            });

            setOrders(updatedOrders);
            setSuccessMessage('Order status updated successfully.');
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to update order status');
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const formatDate = (isoDateString) => {
        if (!isoDateString) return '';
        const date = new Date(isoDateString);
        const formattedDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div className="order-grid-container">
            {successMessage && <StatusMessage message={successMessage} type="success" />}
            {errorMessage && <StatusMessage message={errorMessage} type="error" />}
            <div className="order-elements-container">
                <h1 className="order-dashboard-title">
                    Order Management
                    <div>
                        <span className="order-filter-search">
                            Search:
                            <input
                                type="text"
                                placeholder="Order ID"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </span>
                        <span className="order-filter-dropdown">
                            Filter:
                            <select
                                onChange={handleFilterChange}
                                value={filter}
                            >
                                <option value="All Orders">All Orders</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PACKED">Packed</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </span>
                    </div>
                </h1>
                <div className="order-grid-product">
                    <div className="order-cart-container">
                        <div className="order-flex-container">
                            <div className="order-product-container">
                                {orders
                                    .filter(order => filter === "All Orders" || order.status === filter)
                                    .filter(order => searchQuery === '' || order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map((order, index) => (
                                        <div key={index} className="item">
                                            <div className="order-product-details">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <p>Order ID: {order.id}</p>
                                                </div>
                                                <div className="order-price-quantity-container">
                                                    <div className="order-price-container">
                                                        <div className="order-price-quantity">
                                                            <span>Status: </span>
                                                            <select
                                                                className="order-status-dropdown"
                                                                value={order.status}
                                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                            >
                                                                <option value="PROCESSING">Processing</option>
                                                                <option value="CONFIRMED">Confirmed</option>
                                                                <option value="PACKED">Packed</option>
                                                                <option value="SHIPPED">Shipped</option>
                                                                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                                                <option value="DELIVERED">Delivered</option>
                                                                <option value="CANCELLED">Cancelled</option>
                                                            </select>
                                                            <span style={{ marginLeft: '20px' }}>Order Details: </span>
                                                            <button
                                                                className="order-open-product-btn"
                                                                onClick={() => openOrderDetailsModal(order.id)}
                                                            >
                                                                OPEN
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
                <Modal.Header>
                    <Modal.Title className="order-modal-title-center">
                        <h2>Order Details</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="order-modal-body-center">
                    {selectedOrderDetails ? (
                        <table className="order-modal-table">
                            <tbody>
                                <tr>
                                    <td>Customer Username: </td>
                                    <td>{selectedOrderDetails.username}</td>
                                </tr>
                                <tr>
                                    <td>Product Ordered: </td>
                                    <td>{selectedOrderDetails.product.name}</td>
                                </tr>
                                <tr>
                                    <td>Quantity: </td>
                                    <td>{selectedOrderDetails.quantity}</td>
                                </tr>
                                <tr>
                                    <td>Address: </td>
                                    <td>{selectedOrderDetails.user.address}</td>
                                </tr>
                                <tr>
                                    <td>Current Status: </td>
                                    <td>{selectedOrderDetails.status}</td>
                                </tr>
                                <tr>
                                    <td>Proof of Payment: </td>
                                    <td>
                                        {selectedOrderDetails.proofOfPayment ? (
                                            <img
                                                src={selectedOrderDetails.proofOfPayment}
                                                alt="Proof of Payment"
                                                style={{ width: '100px', height: '100px' }}
                                            />
                                        ) : 'No proof of payment uploaded'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Order Date Placed: </td>
                                    <td>{formatDate(selectedOrderDetails.createdAt)}</td>
                                </tr>
                                <tr>
                                    <td>Order Date Completed: </td>
                                    <td>{formatDate(selectedOrderDetails.dateCompleted)}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>No order details</p>
                    )}
                </Modal.Body>
                <Modal.Footer className="order-modal-footer-center">
                    <button className="order-modal-cancel-inventory-btn" onClick={() => setShowDetailsModal(false)}>Close</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderManagement;
