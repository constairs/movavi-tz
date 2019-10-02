// @flow

import React from 'react';

import './index.styles.scss';

type TextareaProps = {
  id?: string | number;
  label?: string;
  value: string;
  onChange: (e: Event) => void;
};

export const Textarea = React.memo<TextareaProps>(({
  id = '',
  label = '',
  value,
  onChange,
}: TextareaProps) => (
  <div className="textarea">
    {label && (<label className="label" htmlFor={id}>{label}</label>)}
    <textarea
      id={id}
      value={value}
      onChange={onChange}
    />
  </div>
));
