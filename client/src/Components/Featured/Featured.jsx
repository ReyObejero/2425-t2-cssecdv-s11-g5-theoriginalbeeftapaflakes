import React, { useState, useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import styles from './Featured.module.css';
import { PRODUCT_URL } from '../../API/constants';
import axiosInstance from '../../API/axiosInstance.js';
import { Link } from 'react-router-dom';

const Featured = () => {
    const [products, setProducts] = useState([]);

    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        setHasAnimated(true);
    }, []);

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
        <div className={styles.featured}>
            <h1 className={styles.title}>Beefy, Flakey, and Original.</h1>
            <div className={styles.container}>
                <div className={styles.features}>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <Fade delay={index * 150} key={product.id} triggerOnce={hasAnimated}>
                                <div
                                    className={`${styles.item} ${index % 2 === 0 ? styles.row : styles['row-reverse']} ${index === 1 ? styles['second-item'] : ''}`}
                                >
                                    <div className={styles.imagecontainer}>
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className={styles['featured-image']}
                                        />
                                    </div>
                                    <div className={styles.description}>
                                        <h2>{product.name}</h2>
                                        <p>{product.description}</p>
                                        <Link to={`/products/${product.id}`}>
                                            <button
                                                className={`${styles.button} ${index % 2 !== 0 ? styles['button-right'] : ''}`}
                                            >
                                                Buy Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </Fade>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Featured;
