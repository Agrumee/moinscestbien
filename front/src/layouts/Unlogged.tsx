import React, { ReactNode } from 'react';
import './Unlogged.scss';

// Déclaration du composant Unlogged avec des children
const Unlogged: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="l-unlogged">
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Unlogged;
