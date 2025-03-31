import React from 'react'
import ProductList from '../../ProductList/ProductList.jsx'
import Dulo from '../../Footer/Dulo.jsx'
import './ProductList_Views.css'

const ProductList_Views = () => {
  return (
    <div className="productlist_views-container">
      <ProductList/>
      <Dulo/>
    </div>
  )
}

export default ProductList_Views