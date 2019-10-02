// @flow

import * as React from 'react';
import './index.styles.scss';

type ButtonProps = {
  children: string | React.Node | React.Node[];
  onClick: (event: any) => void;
  color?: string;
}

export const Button = React.memo<ButtonProps>(({
  children,
  onClick,
  color = '',
}: ButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`button ${color || ''}`}
  >
    {children}
  </button>
));
