import React from 'react'
import Product from '../../Products/ProductPage.jsx'
import Dulo from '../../Footer/Dulo.jsx'
import './ProductPage_Views.css'

const Product_Views = () => {
  return (
    <div className="product_views-container">
      <Product/>
      <Dulo/>
    </div>
  )
}

export default Product_Views