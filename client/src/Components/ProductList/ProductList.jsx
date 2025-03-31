import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';
import { PRODUCT_URL } from '../../API/constants';
import axiosInstance from '../../API/axiosInstance.js';

const ProductList = () => {
    // State to store the products fetched from the database
    const [products, setProducts] = useState([]);

    const calculateMinMax = (packages) => {
        if (!packages || packages.length === 0) return null;

        // Extract prices from each package option object
        const prices = packages.map((pckg) => pckg.price);

        // Filter out undefined or null values
        // const filteredPrices = prices.filter((price) => price !== undefined && price !== null);
        // if (filteredPrices.length === 0) return null;

        // Convert Decimal128 values to numbers
        // const numericPrices = filteredPrices.map((price) => parseFloat(price.$numberDecimal));

        // Filter out NaN values and ensure array has at least one numeric value
        // const filteredNumericPrices = numericPrices.filter((price) => !isNaN(price));
        // if (filteredNumericPrices.length === 0) return null;

        // Calculate minimum and maximum prices
        const min = Math.min(...prices).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
        const max = Math.max(...prices).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });

        if (min === max) return `${min}`;

        // Return the price range as a string
        return `${min} - ${max}`;
    };

    useEffect(() => {
        // Function to fetch products from the database
        const fetchProducts = async () => {
            try {
                // Make a GET request to fetch products from the database
                const response = await axiosInstance.get(PRODUCT_URL);
                console.log(response);
                // Set the products state with the fetched data
                setProducts(response.data.data.items);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        // Call the fetchProducts function when the component mounts
        fetchProducts();
    }, []);

    return (
        <div className="productlist-container">
            <hr />
            <h1>PRODUCT LIST</h1>
            <div className="productlist-imgs">
                {/* Map over the products array and render each product */}
                {products.map((product) => (
                    <div key={product.id} className="productlist-image-container">
                        <Link to={`/products/${product.id}`}>
                            <img src={product.imageUrl} alt={product.name} className="productlist-image" />
                        </Link>
                        <Link to={`/products/${product.id}`} className="product-title">
                            <h3>{product.name}</h3>
                        </Link>
                        <p className="product-price">
                            <strong>{calculateMinMax(product.packages)}</strong>
                        </p>
                    </div>
                ))}
            </div>
            <hr className="hr-bottom" />
        </div>
    );
};

export default ProductList;
