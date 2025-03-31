import React from 'react'
import Dulo from '../../Footer/Dulo.jsx'
import CartItems from '../../MyCart/CartItems.jsx'
import './Cart.css';

const Cart = () => {
  return (
    <div className="cart-container">
      <CartItems/>
      <Dulo/>

    </div>
  )
}

export default Cart