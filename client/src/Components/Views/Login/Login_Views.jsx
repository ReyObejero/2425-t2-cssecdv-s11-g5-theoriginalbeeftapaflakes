import React from 'react';
import Login from '../../Login/Login.jsx'
import Dulo from '../../Footer/Dulo.jsx'
import './Login_Views.css';

const Login_Views = () => {
  return (
    <div className="login_views-container">
      <Login/>
      <Dulo/>
    </div>
  );
};

export default Login_Views;
