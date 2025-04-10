import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../API/axiosInstance';
import { ORDERS_URL } from '../../API/constants';
import './orders.css';
import { AuthContext } from '../../contexts';

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const getOrders = async () => {
        if (!user) {
            console.log('User is not logged in.');
            return;
        }

        try {
            let accessEndpoint = '';
            if (user.role === 'PRODUCT_MANAGER') {
                accessEndpoint = '';
            } else {
                accessEndpoint = 'me';
            }

            console.log(`Fetching orders from endpoint: ${ORDERS_URL}/${accessEndpoint}`);
            const response = await axiosInstance.get(`${ORDERS_URL}/${accessEndpoint}`);
            const ordersData = response.data.data;

            console.log('Fetched orders:', ordersData);

            setOrders(ordersData.items || []);
        } catch (error) {
            console.log('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrders();
    }, [user]);

    const handleStatusChange = async (orderId, updatedStatus, orderOwnerId) => {
        if (user.id !== orderOwnerId && updatedStatus === 'DELIVERED') {
            console.log('Cannot mark this order as delivered as you do not own it.');
            return;
        }

        try {
            await axiosInstance.put(`${ORDERS_URL}/${orderId}`, { updatedStatus });
            getOrders();
        } catch (error) {
            console.log('Error updating order status:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="order-list">
            <h1>Orders</h1>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            {user.role === 'PRODUCT_MANAGER' && <th>Order #</th>}
                            {user.role === 'PRODUCT_MANAGER' && <th>User</th>}
                            <th>Product</th>
                            <th>Package</th>
                            <th>Status</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Ordered At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="8">No orders found.</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    {user.role === 'PRODUCT_MANAGER' && <td>{order.id}</td>}
                                    {user.role === 'PRODUCT_MANAGER' && <td>{order.user.username}</td>}
                                    <td>{order.product.name}</td>
                                    <td>{order.package.name}</td>
                                    <td>
                                        {user.role === 'PRODUCT_MANAGER' ? (
                                            <select
                                                value={order.status}
                                                onChange={(e) =>
                                                    handleStatusChange(order.id, e.target.value, order.user.id)
                                                }
                                            >
                                                <option value="PACKED">Packed</option>
                                                <option value="SHIPPED">Shipped</option>
                                                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        ) : (
                                            <>
                                                {order.status}
                                                {user.id === order.user.id && order.status === 'OUT_FOR_DELIVERY' && (
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(order.id, 'DELIVERED', order.user.id)
                                                        }
                                                    >
                                                        Mark as Delivered
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                    <td>{order.quantity}</td>
                                    <td>{order.price}</td>
                                    <td>
                                        {`${new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })} ${new Date(order.createdAt).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}`}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};
