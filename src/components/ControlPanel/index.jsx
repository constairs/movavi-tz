// @flow

import React, { useCallback } from 'react';
import { Button } from '..';

import './index.styles.scss';

type ControlPanelProps = {
  type: string;
  onClickAddButton: () => void;
  onClickDeleteButton: () => Promise<any>;
}

export const ControlPanel = ({
  type = '',
  onClickAddButton,
  onClickDeleteButton
}: ControlPanelProps) => (
  <div className="control-panel">
    <Button onClick={useCallback(() => onClickAddButton())}>{`Add ${type}`}</Button>
    <Button onClick={useCallback(() => onClickDeleteButton())}>{`Delete ${type}`}</Button>
  </div>
);
