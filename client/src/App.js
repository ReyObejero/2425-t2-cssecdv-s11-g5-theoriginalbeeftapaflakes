import './App.css';
import Navbar from './Components/Navbar/Navbar.jsx';
import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Components/Views/Home/Home.jsx';
import Products from './Components/Views/ProductList_Views/ProductList_Views.jsx';
import ProductList from './Components/ProductList/ProductList.jsx';
import About from './Components/Views/About/About.jsx';
import ProductPage from './Components/Views/Products/ProductPage_Views.jsx';
import Login from './Components/Views/Login/Login_Views.jsx';
import Register from './Components/Views/Register/Register_Views.jsx';
import CreateAdmin from './Components/Views/CreateAdmin/CreateAdmin_Views.jsx';
import ForgotPassword from './Components/Views/ForgotPassword_Views/ForgotPassword_Views.jsx';
import Cart from './Components/Views/Cart/Cart.jsx';
import AdminDashboard from './Components/Views/Admin/Admin.jsx';
import OrderManagement from './Components/Views/OrderManagement/OrderManagement_Views.jsx';
import CheckoutandStatus from './Components/Views/CheckoutandStatus/CS.jsx';
import { AuthProvider } from './providers';
import { Orders } from './Components/Orders/orders.jsx';
import Error_Views from './Components/Views/Error/Error_Views.jsx';
import { Protect } from './Components/Protect.jsx';

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products/:productId" element={<ProductPage />} />
                        <Route path="/products" element={<Products category="list" />} />
                        <Route path="/about/*" element={<About />} />
                        <Route
                            path="/product-management"
                            element={<Protect element={<AdminDashboard />} requiredRole="PRODUCT_MANAGER" />}
                        />
                        <Route
                            path="/order-management"
                            element={<Protect element={<OrderManagement />} requiredRole="PRODUCT_MANAGER" />}
                        />
                        <Route path="/cart" element={<Protect element={<Cart />} requiredRole="CUSTOMER" />} />
                        <Route path="/productlist" element={<ProductList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/createadmin"
                            element={<Protect element={<CreateAdmin />} requiredRole="ADMNI" />}
                        />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/COS" element={<CheckoutandStatus />} />
                        <Route path="*" element={<Error_Views/>} />
                        <Route path="/orders" element={<Protect element={<Orders />} requiredRole="CUSTOMER" />} />
                        <Route
                            path="/COS"
                            element={<Protect element={<CheckoutandStatus />} requiredRole="CUSTOMER" />}
                        />
                    </Routes>
                </BrowserRouter>
            </div>
        </AuthProvider>
    );
}

export default App;
