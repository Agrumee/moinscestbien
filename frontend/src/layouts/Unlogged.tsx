import React, { ReactNode } from 'react';
import Logo from "../components/atoms/Logo/Logo"
import './Unlogged.scss';

// Déclaration du composant Unlogged avec des children
const Unlogged: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="l-unlogged">
      <Logo size="large" />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Unlogged;
