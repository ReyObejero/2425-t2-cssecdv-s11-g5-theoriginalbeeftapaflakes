import React from 'react';
import CreateAdmin from '../../CreateAdmin/CreateAdmin.jsx'
import Dulo from '../../Footer/Dulo.jsx'
import './CreateAdmin_Views.css';

const CreateAdmin_Views = () => {
  return (
    <div className="createadmin_views-container">
      <CreateAdmin/>
      <Dulo/>
    </div>
  );
};

export default CreateAdmin_Views;
