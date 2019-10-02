// @flow

import React, { useCallback } from 'react';
import { Input } from '../Input';

import './index.styles.scss';

type MessageFilterProps = {
  titleFilter: string;
  categoryFilter: string;
  onChangeTitleFilter: (change: string) => void;
  onChangeCategoryFilter: (change: string) => void;
};

export const MessageFilter = ({
  titleFilter,
  categoryFilter,
  onChangeTitleFilter,
  onChangeCategoryFilter,
}: MessageFilterProps) => (
  <div className="filter">
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
      label="Filter by category"
      onChange={useCallback(({ target: { value } }) => {
        onChangeCategoryFilter(value);
      }, [])}
    />
  </div>
);
