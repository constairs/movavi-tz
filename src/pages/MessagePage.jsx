// @flow

import React, { useState, useEffect, useCallback } from 'react';
import { History, Match } from 'react-router';
import {
  readMessage,
  deleteMessage,
  updateMessage,
  readCategory,
} from '../services';
import {
  Button,
  Modal,
  Textarea,
  Input,
  StyledSelect,
} from '../components';

export const MessagePage = ({
  history,
  match: {
    params: {
      id: messageId,
    }
  },
  onError,
}: {
  history: History;
  match: Match;
  onError: (err: any) => void;
}) => {
  const [message, setMessage] = useState<Object>(undefined);
  const [options, setOptions] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    type: '',
    show: false
  });
  const [error, setError] = useState('');

  const getMessage = async (params = {}, filter = { id: messageId }) => {
    try {
      const { data: { result } } = await readMessage(params, filter);
      setMessage(result.data[0]);
    } catch (err) {
      onError(err);
    }
  };

  const getCategoriesList = async () => {
    try {
      const { data: { result } } = await readCategory({
        fields: ['id', 'title'],
        perPage: 100,
      });

      setOptions(result.data.map(({ id, title }) => ({
        value: id,
        label: title,
      })));
    } catch (err) {
      onError(err);
    }
  };

  useEffect(() => {
    getMessage();
    getCategoriesList();
  }, []);

  const deleteMessages = async () => {
    try {
      await deleteMessage([messageId]);

      history.push('/messages');
    } catch (err) {
      onError(err);
    }
  };

  const applyChanges = async () => {
    try {
      setConfirmModal({ type: '', show: false });
      if (message.title === '') {
        setError("Message title shouldn't be empty!");
        return;
      }

      await updateMessage(message);
      history.push('/messages');
    } catch (err) {
      onError(err);
    }
  };

  const changeMessageBody = ({ target: { value } }) => {
    setMessage((messageState) => ({
      ...messageState,
      body: value,
    }));
  };

  const changeMessageTitle = ({ target: { value } }) => {
    setMessage((messageState) => ({
      ...messageState,
      title: value,
    }));
    setError('');
  };

  const changeMessageCategory = ({ value }) => {
    setMessage((messageState) => ({
      ...messageState,
      category: {
        id: value
      },
    }));
  };

  const showConfirmModal = (show, type) => {
    setConfirmModal((modalState) => ({
      ...modalState,
      show,
      type
    }));
  };

  const selectValue = options.find((option) => option.value === message.category.id);

  return (
    <div className="container page">
      {message && (
        <>
          <div>
            <h2>{message.title}</h2>
            {error && <p className="error">{error}</p>}
            <Input
              label="Message title"
              value={message.title}
              onChange={changeMessageTitle}
              error={error}
            />
          </div>
          <Textarea
            label="Message body"
            value={message.body || ''}
            onChange={changeMessageBody}
          />
          <StyledSelect
            label="Message category"
            options={options}
            value={selectValue}
            onChange={changeMessageCategory}
          />
        </>
      )}

      <div className="control-buttons">
        <Button onClick={useCallback(() => showConfirmModal(true, 'apply'), [])}>Apply changes</Button>
        <Button color="red" onClick={useCallback(() => showConfirmModal(true, 'delete'), [])}>Delete this message</Button>
      </div>

      <Modal show={confirmModal.show} onClose={useCallback(() => showConfirmModal(false, ''), [])}>
        <p>
          {confirmModal.type === 'delete'
            ? 'Do you want delete this message?'
            : 'Do you want apply changes?'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={confirmModal.type === 'delete' ? deleteMessages : applyChanges}
            color={confirmModal.type === 'delete' ? 'red' : ''}
          >
            Yes
          </Button>
          <Button onClick={useCallback(() => showConfirmModal(false, ''), [])}>NO</Button>
        </div>
      </Modal>
    </div>
  );
};
