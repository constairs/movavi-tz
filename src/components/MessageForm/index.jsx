// @flow

import React, { useState, useCallback } from 'react';
import {
  Button,
  Textarea,
  Input,
  StyledSelect,
} from '..';
import type { Category, Message } from '../../types';

type MessageFormProps = {
  categories: Category[];
  onCreateMessage: (messageData: Message) => Promise<any>;
};

export const MessageForm = ({
  categories,
  onCreateMessage,
}: MessageFormProps) => {
  const [messageTitle, setTitle] = useState('');
  const [category, setCategory] = useState<Object>(null);
  const [messageBody, setMessageBody] = useState('');
  const [feedback, setFeedback] = useState<Object>(null);

  const changeTitle = useCallback(({ target: { value } }) => setTitle(value), []);

  const changeCategory = (value) => setCategory(value);

  const changeMessage = useCallback(({ target: { value } }) => setMessageBody(value), []);

  const onSubmit = async () => {
    if (messageTitle === '') {
      setFeedback({
        message: 'Please enter message title!',
        cause: 'messageTitle'
      });
      return;
    }

    if (!category || !category.value) {
      setFeedback({
        message: 'Please select message category!',
        cause: 'category'
      });
      return;
    }

    onCreateMessage({
      title: messageTitle,
      body: messageBody,
      category: {
        id: category.value
      },
    });
    setTitle('');
    setCategory(null);
    setMessageBody('');
    setFeedback(null);
  };

  const options = categories.map(({ id, title }) => ({ value: id, label: title }));

  return (
    <form className="form">
      <Input
        label="Message title*"
        id="messageTitle"
        value={messageTitle}
        onChange={changeTitle}
        maxLength={1024}
        error={feedback && feedback.cause === 'messageTitle' ? feedback.message : null}
      />
      <Textarea
        label="Message body"
        id="messageBody"
        value={messageBody}
        onChange={changeMessage}
      />
      <StyledSelect
        label="Message category"
        options={options}
        value={category}
        onChange={changeCategory}
        error={feedback && feedback.cause === 'category' ? feedback.message : null}
      />
      <Button onClick={onSubmit}>Create message</Button>

      {feedback && (<p className="error">{feedback.message}</p>)}
    </form>
  );
};
