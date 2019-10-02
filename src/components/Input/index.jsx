// @flow

import * as React from 'react';
import './index.styles.scss';

type InputProps = {
  id?: string;
  type?: string;
  value: string;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  onChange: (e: any) => void;
};

export const Input = React.memo<InputProps>(({
  id = '',
  type = 'text',
  label = '',
  placeholder = '',
  maxLength = null,
  value,
  error = '',
  onChange,
}: InputProps) => (
  <div className={`text-input ${error ? 'error' : ''}`}>
    {label && <label className="label" htmlFor={id}>{label}</label>}
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      maxLength={maxLength}
    />
  </div>
));
