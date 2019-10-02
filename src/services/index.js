import axios from 'axios';

export const BASE_URL = 'https://simple-api.sandbox.movavi.com/api/v1/';
const REQUEST_PARAMS = {
  jsonrpc: '2.0',
  id: 'test',
};

export const readCategory = (params, filter) => {
  const readParams = () => {
    const createdParams = {
      page: params.page || 1,
      perPage: params.perPage || 10,
      fields: params.fields || ['id', 'title', 'messages', 'children', 'parent'],
    };

    if (filter && filter.id) {
      createdParams.conditions = ['id', '=', filter.id];
    }

    return createdParams;
  };

  const res = axios.post(BASE_URL, {
    ...REQUEST_PARAMS,
    method: 'readCategory',
    params: readParams(),
  });

  return res;
};

export const readMessage = (params, filter) => {
  const readParams = () => {
    const createdParams = {
      page: params.page || 1,
      perPage: params.perPage || 10,
      fields: ['id', 'title', 'body', 'category'],
    };

    if (filter && filter.id) {
      createdParams.conditions = ['id', '=', filter.id];
    }

    return createdParams;
  };

  const res = axios.post(BASE_URL, {
    ...REQUEST_PARAMS,
    method: 'readMessage',
    params: readParams(),
  });

  return res;
};

export const createCategory = (categoryData) => {
  const res = axios.post(BASE_URL, {
    ...REQUEST_PARAMS,
    method: 'createCategory',
    params: {
      data: categoryData
    }
  });

  return res;
};

export const createMessage = (messageData) => {
  const res = axios.post(BASE_URL, {
    ...REQUEST_PARAMS,
    method: 'createMessage',
    params: {
      data: messageData
    }
  });

  return res;
};


export const updateCategory = (categoryData) => {
  const res = axios.post(BASE_URL, {
    ...REQUEST_PARAMS,
    method: 'updateCategory',
    params: {
      conditions: ['id', '=', categoryData.id],
      data: categoryData
    }
  });

  return res;
};

export const updateMessage = (messageData) => {
  const res = axios.post(BASE_URL, {
    ...REQUEST_PARAMS,
    method: 'updateMessage',
    params: {
      conditions: ['id', '=', messageData.id],
      data: {
        title: messageData.title,
        body: messageData.body,
        category: messageData.category
      }
    }
  });

  return res;
};

export const deleteCategory = (categoryIds) => {
  const res = axios.post(BASE_URL, {
    ...REQUEST_PARAMS,
    method: 'deleteCategory',
    params: {
      conditions: ['id', 'IN', categoryIds],
    }
  });

  return res;
};

export const deleteMessage = (messageIds) => {
  const res = axios.post(BASE_URL, {
    ...REQUEST_PARAMS,
    method: 'deleteMessage',
    params: {
      conditions: ['id', 'IN', messageIds],
    }
  });

  return res;
};
