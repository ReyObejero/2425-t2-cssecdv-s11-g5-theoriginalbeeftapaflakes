import React, { useState, useEffect } from 'react';
import './ProductPage.css';
import { Link } from 'react-router-dom';
import { PRODUCT_URL, CARTS_URL } from '../../API/constants';
import axiosInstance from '../../API/axiosInstance.js';

const Product = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [product, setProduct] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [warningMessage, setWarningMessage] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [addedToCartMessage, setAddedToCartMessage] = useState('');

    useEffect(() => {
        const handleFetchProduct = async () => {
            try {
                const productId = window.location.pathname.split('/').pop();
                const response = await axiosInstance.get(`${PRODUCT_URL}/${productId}`);
                setProduct(response.data.data);
                console.log('Product', response.data.data);
            } catch (error) {
                console.error('Error fetching product:', error.message);
            }
        };

        handleFetchProduct();
    }, []);

    const handlePackageSelection = (productPackageName) => {
        setSelectedPackage((prevPackage) => (prevPackage === productPackageName ? '' : productPackageName));
        setShowWarning(false);
    };

    const getPrice = (price) => {
        const numericPrice = parseFloat(price);
        return numericPrice.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
    };

    const getTotalBottles = (pkgIndex) => {
        if (pkgIndex === -1 || !product || !product.packages[pkgIndex]) return null;
        let total = 0;
        product.packages[pkgIndex].items.forEach((item) => {
            total += item.quantity;
        });
        return `${total} Bottles/Box `;
    };

    const getProductSize = (pkgIndex) => {
        if (pkgIndex === -1 || !product || !product.packages[pkgIndex] || !product.packages[pkgIndex].items[0])
            return null;
        const size = product.packages[pkgIndex].items[0].flavorVariant.size;
        return `(${size})`;
    };

    const handleAddToCart = async () => {
        const productId = parseInt(window.location.pathname.split('/').pop());
        const packageData = product.packages.find((pkg) => pkg.name === selectedPackage);
        if (!selectedPackage) {
            setWarningMessage('Please select a package');
            setShowWarning(true);
        } else {
            setShowWarning(false); // Reset warning message
            try {
                const cartItem = {
                    productId: productId,
                    packageId: packageData.id,
                    quantity: quantity,
                };
                console.log('cartItem', cartItem);
                const response = await axiosInstance.post(`${CARTS_URL}/items`, cartItem, {
                    withCredentials: true,
                });
                setAddedToCartMessage(response.data.message);
                setTimeout(() => {
                    setAddedToCartMessage('Added to cart.');
                }, 3000);
            } catch (error) {
                console.log('Add to cart error', error);
            }
        }
    };

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className="product-container">
            {product && (
                <div className="p-details-container">
                    <div className="p-image-gallery">
                        <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <div className="product-details">
                        <h1>{product.name}</h1>
                        <p className="p-amount">
                            {getTotalBottles(
                                product.packages
                                    ? product.packages.findIndex((pkg) => pkg.name === selectedPackage)
                                    : -1,
                            )}
                            {getProductSize(
                                product.packages
                                    ? product.packages.findIndex((pkg) => pkg.name === selectedPackage)
                                    : -1,
                            )}
                        </p>
                        <p className="p-price">
                            {selectedPackage
                                ? getPrice(product.packages.find((pkg) => pkg.name === selectedPackage).price)
                                : 'Select a package'}
                        </p>
                        <div>
                            {product.packages &&
                                product.packages.map((productPackage, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePackageSelection(productPackage.name)}
                                        className={
                                            selectedPackage === productPackage.name
                                                ? 'p-package-button selected'
                                                : 'p-package-button'
                                        }
                                    >
                                        {productPackage.name}
                                    </button>
                                ))}
                        </div>
                        <ul>
                            {product.packages &&
                                product.packages
                                    .filter((pckg) => pckg.name === selectedPackage)
                                    .flatMap((pckg) =>
                                        pckg.items.map((item, index) => (
                                            <li key={index}>
                                                {item.flavor.name} ({item.flavorVariant.size}): {item.quantity}
                                            </li>
                                        )),
                                    )}
                        </ul>
                        {showWarning && <div className="p-error-bubble">{warningMessage}</div>}
                        <h3>Product Description:</h3>
                        <p className="p-product-description" style={{ whiteSpace: 'pre-line' }}>
                            {product.description}
                        </p>
                        <div className="p-quantity-selector">
                            <label htmlFor="quantity">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                value={quantity}
                                onChange={handleQuantityChange}
                            />
                        </div>
                        <ul>
                            <li>Ingredients: {product.ingredients}</li>
                        </ul>
                        <button className="p-add-to-cart" onClick={handleAddToCart}>
                            ADD TO CART
                        </button>
                        {addedToCartMessage && <div className="p-success-message">{addedToCartMessage}</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;
