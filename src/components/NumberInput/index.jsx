// @flow

import React, { useCallback } from 'react';

import './index.styles.scss';

type NumberInputProps = {
  id?: string;
  value: number;
  label?: string;
  placeholder?: string;
  onChange: (change: number) => void;
};

export const NumberInput = React.memo<NumberInputProps>(({
  id = '',
  value,
  onChange,
  label = '',
  placeholder = ''
}: NumberInputProps) => (
  <div className="text-input">
    {label && <label className="label" htmlFor={id}>{label}</label>}
    <input
      id={id}
      min="0"
      type="number"
      value={value}
      placeholder={placeholder}
      onChange={useCallback(({ target: { value: val } }) => {
        onChange(parseInt(val, 10));
      }, [])}
    />
    <div className="control-buttons">
      <button
        type="button"
        onClick={useCallback(() => {
          onChange(parseInt(value, 10) + 1);
        }, [value])}
      >
        +
      </button>
      <button
        type="button"
        onClick={useCallback(() => {
          if (parseInt(value, 10) > 0) {
            return onChange(parseInt(value, 10) - 1);
          }

          return null;
        }, [value])}
      >
        -
      </button>
    </div>
  </div>
));
