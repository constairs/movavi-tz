import React from 'react';
// import { Link } from 'react-router-dom';
import { MenuLink } from '..';

import './index.styles.scss';

export const Nav = () => (
  <div className="container">
    <nav>
      <ul>
        <li>
          <MenuLink label="Categories" activeOnlyWhenExact to="/" />
        </li>
        <li>
          <MenuLink label="Messages" activeOnlyWhenExact to="/messages" />
        </li>
      </ul>
    </nav>
  </div>
);
