// @flow

import React, { useState, useEffect, useCallback } from 'react';
import { History, Match } from 'react-router';
import { readCategory, updateCategory, deleteCategory } from '../services';

import {
  StyledSelect,
  Input,
  Button,
  Modal,
} from '../components';


export const CategoryPage = ({
  history,
  match: {
    params: {
      id: categoryId
    }
  },
  onError,
}: {
  history: History;
  match: Match;
  onError: (err: any) => void;
}) => {
  const [category, setCategory] = useState<Object>(undefined);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState<string>('');
  const [confirmModal, setConfirmModal] = useState<Object>({
    type: '',
    show: false,
    params: {},
  });

  const getCategories = async (
    params = {
      fields: ['id', 'title', 'parent', 'messages', 'children'],
      perPage: 1
    },
    filter = {
      id: categoryId
    }) => {
    try {
      const { data: { result } } = await readCategory(params, filter);
      setCategory(result.data[0]);
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

  const deleteCategories = async () => {
    try {
      const res = await deleteCategory([categoryId]);

      if (res) history.push('/messages');
    } catch (err) {
      onError(err);
    }
  };

  useEffect(() => {
    getCategories();
    getCategoriesList();
  }, []);

  const applyChanges = async () => {
    try {
      setConfirmModal({ type: '', show: false });

      if (category.title === '') {
        setError("Category title shouldn't be empty!");
        return;
      }

      updateCategory(category);
    } catch (err) {
      onError(err);
    }
  };

  const changeCategoryTitle = useCallback(({ target: { value } }) => {
    setCategory((categoryState) => ({
      ...categoryState,
      title: value
    }));
    setError('');
  }, []);

  const changeCategoryParent = useCallback(({ value }) => {
    setCategory((categoryState) => ({
      ...categoryState,
      parent: {
        id: value
      }
    }));
  }, []);

  const showConfirmModal = (show, type) => {
    setConfirmModal((modalState) => ({
      ...modalState,
      show,
      type
    }));
  };

  const clickConfirm = () => {
    if (confirmModal.type === 'delete'
      && (category.children.length || category.messages.length)) {
      showConfirmModal(false, '');
      showConfirmModal(true, 'double-confirm');
    } else if (confirmModal.type === 'double-confirm') {
      deleteCategories();
    } else {
      applyChanges();
    }
  };

  const selectValue = options.find((option) => {
    return category.parent && (option.value === category.parent.id);
  });

  const message = () => {
    if (category) {
      return (`This category have${category.children.length > 0 ? ` ${category.children.length} child categories` : ''} ${category.messages.length > 0 ? ` ${category.messages.length} messages` : ''}.\n Do you want delete this category?`);
    }
    return ('');
  };

  return (
    <div className="container page">
      {category && (
        <>
          <h2>{category.title}</h2>
          {error && <p className="error">{error}</p>}
          <Input
            label="Category title"
            value={category.title}
            error={error}
            onChange={changeCategoryTitle}
          />
        </>
      )}

      <StyledSelect
        label="Parent category"
        options={options}
        value={selectValue}
        onChange={changeCategoryParent}
      />

      <div className="control-buttons">
        <Button onClick={useCallback(() => showConfirmModal(true, 'apply'), [])}>Apply changes</Button>
        <Button color="red" onClick={useCallback(() => showConfirmModal(true, 'delete'), [])}>Delete this category</Button>
      </div>

      <Modal
        show={confirmModal.show}
        onClose={useCallback(() => showConfirmModal(false, ''), [])}
      >
        <p>
          {{
            delete: 'Do you want delete this category?',
            apply: 'Do you want apply changes?',
            'double-confirm': message(),
          }[confirmModal.type]}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={clickConfirm}
            color={confirmModal.type === 'delete' ? 'red' : ''}
          >
            Yes
          </Button>
          <Button onClick={useCallback(() => showConfirmModal(false, ''), [])}>No</Button>
        </div>
      </Modal>
    </div>
  );
};
