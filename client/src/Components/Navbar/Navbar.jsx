import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../contexts';
import './Navbar.css';
import logoMain from '../../Assets/logo_main.png';
import cartIcon from '../../Assets/cart_icon.png';
import userIcon from '../../Assets/user.png';
import userAdmin from '../../Assets/userAdmin.png';
import menuIcon from '../../Assets/menu.png';
import { AUTH_URL, CARTS_URL } from '../../API/constants';
import axiosInstance from '../../API/axiosInstance';

const Navbar = () => {
    const { user, setUser, isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [openDropdown, setOpenDropdown] = useState(null);
    const navbarRef = useRef(null);

    const handleDropdownToggle = (dropdownId) => {
        setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axiosInstance.get(`${CARTS_URL}/me`, { withCredentials: true });
                const data = response.data.data;
                setCart(data.items || []);
                setCartItemCount(data.items ? data.items.length : 0);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        if (isLoggedIn) {
            fetchCartItems();
        }
    }, [isLoggedIn]);

    const redirectTo = (route) => {
        window.location.href = route;
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.delete(`${AUTH_URL}/logout`, { withCredentials: true });
            setUser(null);
            setIsLoggedIn(false);
            redirectTo('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="navbar" ref={navbarRef}>
            <div className="nav-logo" onClick={() => redirectTo('/')}>
                <img src={logoMain} alt="" className="logo-img" />
            </div>
            <div className="nav-right">
                <ul className="nav-menu">
                    <li className="nav-item" onClick={() => redirectTo('/')}>Home</li>
                    <li className="nav-item" onClick={() => redirectTo('/products')}>Products</li>

                    <DropdownButton
                        id="about"
                        title="About"
                        openDropdown={openDropdown}
                        onToggle={handleDropdownToggle}
                    >
                        <DropdownMenu>
                            <button onClick={() => redirectTo('/about')}>Contact Us</button>
                            <button onClick={() => redirectTo('/about')}>Frequently Asked</button>
                            <button onClick={() => redirectTo('/about')}>Terms of Service</button>
                            <button onClick={() => redirectTo('/about')}>Refund Policy</button>
                        </DropdownMenu>
                    </DropdownButton>

                    {user?.role === 'ADMIN' && (
                        <DropdownButton
                            id="navbar-admin"
                            title="Admin Dashboard"
                            openDropdown={openDropdown}
                            onToggle={handleDropdownToggle}
                        >
                            <DropdownMenu>
                                <button onClick={() => redirectTo('/product-management')}>Product Management</button>
                                <button onClick={() => redirectTo('/order-management')}>Order Management</button>
                            </DropdownMenu>
                        </DropdownButton>
                    )}
                </ul>

                <div className="nav-login-cart">
                    <img src={cartIcon} alt="Cart" className="cart-img" onClick={() => redirectTo('/cart')} />
                    <div className="nav-cart-count">{cartItemCount}</div>
                    <DropdownButton
                        id="user"
                        title={<img src={user?.role === 'ADMIN' ? userAdmin : userIcon} alt="User" className="user-img" />}
                        openDropdown={openDropdown}
                        onToggle={handleDropdownToggle}
                    >
                        <DropdownMenuIcon>
                            {isLoggedIn ? (
                                <>
                                    <div className="username-display">
                                        Logged in as{' '}
                                        <span style={{ color: '#FF0000', fontWeight: 'bold' }}>{user?.username}</span>
                                    </div>
                                    {user?.role === 'ADMIN' && (
                                        <button onClick={() => redirectTo('/createadmin')}>Create New Admin</button>
                                    )}
                                    <button onClick={handleLogout}>Logout</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => redirectTo('/login')}>Login</button>
                                    <button onClick={() => redirectTo('/register')}>Register</button>
                                </>
                            )}
                        </DropdownMenuIcon>
                    </DropdownButton>
                    <img src={menuIcon} alt="Menu" className="menu-img" onClick={() => redirectTo('/orders')} />
                </div>
            </div>
        </div>
    );
};

const DropdownButton = ({ id, title, children, openDropdown, onToggle }) => {
    const isOpen = openDropdown === id;

    return (
        <li className="dropdown-button" onClick={() => onToggle(id)}>
            {typeof title === 'string' ? <span>{title}</span> : title}
            {isOpen && children}
        </li>
    );
};

const DropdownMenu = ({ children }) => <div className="dropdown-menu">{children}</div>;

const DropdownMenuIcon = ({ children }) => <div className="dropdown-menu-icon">{children}</div>;

export default Navbar;
