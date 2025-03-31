import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../API/axiosInstance';
import { ORDERS_URL } from '../../API/constants';
import './orders.css';
import { AuthContext } from '../../contexts';

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(AuthContext);

    const getOrders = async () => {
        try {
            const accessEndpoint = user.role === 'ADMIN' ? '' : 'me';
            const orders = (await axiosInstance.get(`${ORDERS_URL}/${accessEndpoint}`)).data.data;
            setOrders(orders.items);
            console.log('Orders', orders.items);
        } catch (error) {
            console.log('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    const handleStatusChange = async (orderId, updatedStatus) => {
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
            <table>
                <thead>
                    <tr>
                        {user.role === 'ADMIN' && <th>Order #</th>}
                        {user.role === 'ADMIN' && <th>User</th>}
                        <th>Product</th>
                        <th>Package</th>
                        <th>Status</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Ordered At</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            {user.role === 'ADMIN' && <td>{order.id}</td>}
                            {user.role === 'ADMIN' && <td>{order.user.username}</td>}
                            <td>{order.product.name}</td>
                            <td>{order.package.name}</td>
                            <td>
                                {user.role === 'ADMIN' ? (
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        <option value="PACKED">Packed</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                ) : (
                                    <>
                                        {order.status}
                                        {order.status !== 'DELIVERED' && (
                                            <button onClick={() => handleStatusChange(order.id, 'DELIVERED')}>
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};
