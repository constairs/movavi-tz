// @flow

import React, { useCallback } from 'react';
import { Input } from '../Input';
import { NumberInput } from '../NumberInput';

import './index.styles.scss';

type MessageFilterProps = {
  titleFilter: string;
  categoryFilter: string;
  messagesFilter: number;
  onChangeTitleFilter: (change: string) => void;
  onChangeCategoryFilter: (change: string) => void;
  onChangeMessageFilter: (change: number) => void;
};

export const CategoryFilter = ({
  titleFilter,
  categoryFilter,
  messagesFilter,
  onChangeTitleFilter,
  onChangeCategoryFilter,
  onChangeMessageFilter
}: MessageFilterProps) => (
  <div className="category-filter">
    <Input
      value={titleFilter}
      id="titleFilter"
      label="Filter by title"
      onChange={useCallback(({ target: { value } }) => {
        onChangeTitleFilter(value);
      }, [])}
    />
    <Input
      value={categoryFilter}
      id="categoryFilter"
      label="Filter by parent category"
      onChange={useCallback(({ target: { value } }) => {
        onChangeCategoryFilter(value);
      }, [])}
    />
    <NumberInput
      value={messagesFilter}
      id="messageFilter"
      label="Filter by messages quantity"
      onChange={useCallback((change) => {
        onChangeMessageFilter(change);
      }, [])}
    />
  </div>
);
