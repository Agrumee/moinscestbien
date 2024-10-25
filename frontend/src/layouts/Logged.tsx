import React from 'react';
import Navbar from '../components/organisms/Navbar/Navbar';
import './Logged.scss';

// Déclaration du composant Logged avec des children
const Logged: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="l-logged">
      <div className="content">
        {children}
      </div>
      <Navbar />
    </div>
  );
};

export default Logged;