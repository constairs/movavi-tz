// @flow

import React from 'react';
import './index.styles.scss';

type CheckboxProps = {
  id: number;
  checked: boolean;
  disabled?: boolean;
  onChange: (change: boolean, id: number) => void;
};

export const Checkbox = React.memo<CheckboxProps>(({
  id,
  checked,
  disabled = false,
  onChange,
}: CheckboxProps) => (
  <label className="checkbox" htmlFor={id}>
    <input
      onChange={() => onChange(!checked, id)}
      id={id}
      checked={checked}
      disabled={disabled}
      type="checkbox"
    />
    <div />
  </label>
));
