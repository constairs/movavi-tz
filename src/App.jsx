// @flow

import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Modal } from './components/Modal';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryPage } from './pages/CategoryPage';
import { MessagesPage } from './pages/MessagesPage';
import { MessagePage } from './pages/MessagePage';

import './styles.scss';

export const App = () => {
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState('');
  const showErrorModal = (err) => setError(err.message);

  return (
    <Router>
      <Nav />
      <Route
        exact
        path="/"
        render={(props) => <CategoriesPage {...props} onError={showErrorModal} />}
      />
      <Route
        path="/messages"
        render={(props) => <MessagesPage {...props} onError={showErrorModal} />}
      />
      <Route
        path="/category/:id/"
        render={(props) => <CategoryPage {...props} onError={showErrorModal} />}
      />
      <Route
        path="/message/:id/"
        render={(props) => <MessagePage {...props} onError={showErrorModal} />}
      />

      <Modal
        show={errorModal}
        onClose={useCallback(() => setErrorModal(false), [])}
      >
        {error}
      </Modal>
    </Router>
  );
};
