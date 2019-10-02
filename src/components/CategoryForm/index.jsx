// @flow

import React, { useState, useCallback } from 'react';
import type { Category } from '../../types';
import { Button, Input, StyledSelect } from '..';

import './index.styles.scss';

type CategoryFormProps = {
  categories: Category[];
  onCreateCategory: (categoryData: Category) => Promise<any>;
};

export const CategoryForm = ({
  categories = [],
  onCreateCategory,
}: CategoryFormProps) => {
  const [categoryTitle, setTitle] = useState<string>('');
  const [parentCategory, setParent] = useState<Object>(null);
  const [feedback, setFeedback] = useState<Object>(null);

  const changeTitle = useCallback(({ target: { value } }) => setTitle(value), []);

  const changeParentCategory = (value) => setParent(value);

  const onSubmit = async () => {
    if (categoryTitle === '') {
      setFeedback({
        message: 'Please, enter category title!',
        cause: 'categoryTitle',
      });
      return;
    }

    onCreateCategory({
      title: categoryTitle,
      parent: parentCategory ? { id: parentCategory.value } : null,
    });
    setTitle('');
    setParent(null);
  };

  const options = categories.map(({ id, title }) => ({ value: id, label: title }));

  return (
    <form className="form">
      <Input
        label="Category title*"
        id="categoryTitle"
        value={categoryTitle}
        onChange={changeTitle}
        maxLength={255}
        error={feedback && feedback.cause === 'categoryTitle'}
      />
      <StyledSelect
        label="Parent category"
        id="parentCategory"
        value={parentCategory}
        options={options}
        onChange={changeParentCategory}
      />
      <Button onClick={onSubmit}>Create category</Button>
      {feedback && <p className="error">{feedback.message}</p>}
    </form>
  );
};
