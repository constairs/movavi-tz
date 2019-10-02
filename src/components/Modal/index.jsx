// @flow

import * as React from 'react';

import './index.styles.scss';

type ModalProps = {
  children: string | React.Node | React.Node[];
  show?: boolean;
  onClose: () => void;
};

export const Modal = React.memo<ModalProps>(({
  children,
  show = false,
  onClose,
}: ModalProps) => (
  <>
    <div
      className={`modal-wrap ${show ? 'show' : ''}`}
      onClick={(e) => (e.target === e.currentTarget ? onClose() : null)}
    >
      <div className="modal">
        <button type="button" className="close-button" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  </>
));
