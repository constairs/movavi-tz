// @flow

import React, { useCallback } from 'react';
import { StyledSelect } from '..';

import './index.styles.scss';

type SortPanelProps = {
  appearance?: 'messages' | 'categories' | '';
  sortValue: ?{ label: string, value: string };
  onChangeSort: (value: string | number) => void;
};

export const SortPanel = ({
  appearance = '',
  sortValue,
  onChangeSort,
}: SortPanelProps) => {
  const options = [
    { label: 'By id', value: 'id' },
    { label: 'By title', value: 'title' },
  ];

  const categoryOptions = [
    ...options,
    { label: 'By messages count', value: 'messages' },
    { label: 'By children categories', value: 'children' },
  ];

  const messagesOptions = [
    ...options,
    { label: 'By category', value: 'category' }
  ];

  return (
    <div className="sort-panel">
      <StyledSelect
        label="Sort by"
        options={appearance === 'categories' ? categoryOptions : messagesOptions}
        value={sortValue}
        onChange={useCallback((value) => onChangeSort(value), [])}
      />
    </div>
  );
};
