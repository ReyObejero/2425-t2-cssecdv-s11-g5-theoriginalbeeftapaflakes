import React from 'react'
import ErrorPage from '../../ErrorPage/ErrorPage.jsx';
import Dulo from '../../Footer/Dulo.jsx';
import './Error_Views.css';

const Error_Views = () => {
  return (
    <div className="error-container">
      <ErrorPage/>
      <Dulo />
    </div>
  )
}

export default Error_Views