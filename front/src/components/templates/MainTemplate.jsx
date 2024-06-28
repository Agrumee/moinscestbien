import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainTemplate = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/addnew">Add New</Link>
          </li>
          <li>
            <Link to="/listview">List View</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainTemplate;
