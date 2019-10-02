// @flow

import React from 'react';
import Select from 'react-select';

import './index.styles.scss';

type StyledSelectProps = {
  id?: string;
  label?: string;
  error?: string;
};

export const StyledSelect = ({
  id = '',
  label = '',
  error,
  ...props
}: StyledSelectProps) => (
  <div className={`select text-input ${error ? 'error' : ''}`}>
    {label && <label className="label" htmlFor={id}>{label}</label>}
    <Select
      {...props}
      className="select-container"
      theme={(theme) => ({
        ...theme,
        borderRadius: 4,
        colors: {
          ...theme.colors,
          primary25: '#d1e7ed',
          primary50: '#bfdde6',
          primary75: '#add3de',
          primary: '#88c0d0',
        },
      })}
    />
  </div>
);
