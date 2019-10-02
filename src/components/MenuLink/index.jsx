import React from 'react';
import { Route, Link } from 'react-router-dom';

type MainLinkProps = {
  label: string;
  to: string;
  activeOnlyWhenExact: boolean;
};

export const MenuLink = ({
  label,
  to,
  activeOnlyWhenExact = false
}: MainLinkProps) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    // eslint-disable-next-line
    children={({ match }) => (
      <Link className={match ? 'active' : ''} to={to}>{label}</Link>
    )}
  />
);
