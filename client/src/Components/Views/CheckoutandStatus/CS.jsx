import React from 'react'
import Dulo from '../../Footer/Dulo.jsx'
import CheckoutOStatus from '../../Checkout&Status/COS.jsx'
import './CS.css';

const CS = () => {
  return (
    <div className="CS-container">
      <CheckoutOStatus/>
      <Dulo/>

    </div>
  )
}

export default CS