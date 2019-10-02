// @flow

import React from 'react';
import { History } from 'react-router';

import {
  readMessage,
  createMessage,
  deleteMessage,
  readCategory,
} from '../services';

import {
  Modal,
  ItemsList,
  Pagination,
  MessageFilter,
  Spinner,
} from '../components';

import { ControlPanel } from '../components/ControlPanel';
import { SortPanel } from '../components/SortPanel';
import { MessageForm } from '../components/MessageForm';

import type { Message } from '../types';

import {
  sortByNumber,
  sortByTitle,
} from '../utilities';

type Props = {
  history: History;
  onError: (err: any) => void;
};

type State = {
  loading: boolean;
  messages: any[];
  categoriesList: any[];
  totalPages: number;
  page: ?number;
  selectedMessages: any[];
  titleFilter: string;
  categoryFilter: string;
  showModal: boolean;
  sortBy: ?{ label: string, value: string };
};

export class MessagesPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: false,
      messages: [],
      categoriesList: [],
      totalPages: 0,
      selectedMessages: [],
      titleFilter: '',
      categoryFilter: '',
      showModal: false,
      page: null,
      sortBy: null,
    };
  }

  getMessages = async (params: any = {}, filter: any) => {
    try {
      this.setState({ loading: true });
      const { data: { result } } = await readMessage(params);
      const list = () => {
        if (filter && filter.title && filter.categoryId) {
          return result.data.filter((message) => {
            return message.title.includes(filter.title)
              && message.category.id === filter.categoryId;
          });
        }

        if (filter && filter.title) {
          return result.data.filter((message) => {
            return message.title.includes(filter.title);
          });
        }

        if (filter && filter.categoryId) {
          return result.data.filter((message) => {
            return message.category.id === filter.categoryId;
          });
        }

        return result.data || [];
      };

      this.setState({
        messages: list(),
        totalPages: result.totalPages,
        page: result.page,
        loading: false,
      });
    } catch (err) {
      this.setState({ loading: false });
      this.props.onError(err);
    }
  };

  getCategories = async (params: any = { fields: ['id', 'title'] }) => {
    try {
      const { data } = await readCategory(params);
      this.setState({ categoriesList: data.result.data });
    } catch (err) {
      this.props.onError(err);
    }
  };

  create = async (messageData: Message) => {
    try {
      const { data } = await createMessage(messageData);
      if (data.result['Primary key']) {
        this.setState((state) => {
          const newList = [].concat(
            {
              id: data.result['Primary key'].id,
              ...messageData,
            },
            state.messages
          );
          return ({
            messages: newList.length > 10
              ? newList.slice(0, newList.length - 1)
              : newList
          });
        });
        this.sortItems(this.state.sortBy);
      }
      this.changeModal();
    } catch (err) {
      this.changeModal();
      this.props.onError(err);
    }
  }

  deleteMessages = async () => {
    try {
      await deleteMessage(this.state.selectedMessages);

      this.setState((state) => {
        const filtered = state.messages.filter(({ id }) => {
          return !state.selectedMessages.includes(id);
        });
        return ({
          messages: filtered
        });
      });
      this.props.history.push('messages');
    } catch (err) {
      this.props.onError(err);
    }
  };

  componentDidMount() {
    this.getMessages();
    this.getCategories();
  }

  changePage = (pageNum: number) => this.getMessages({ page: pageNum });

  changeTitleFilter = (value: string) => {
    this.setState({ titleFilter: value });
    const category = this.state.categoriesList.find((cat) => {
      return (cat.title === this.state.categoryFilter);
    });
    this.getMessages({ page: this.state.page }, {
      title: value,
      categoryId: category ? category.id : null
    });
  };

  changeCategoryFilter = (value: string) => {
    this.setState({ categoryFilter: value });
    const category = this.state.categoriesList.find((cat) => (cat.title === value));
    this.getMessages({ page: this.state.page }, {
      categoryId: category ? category.id : null,
      title: this.state.titleFilter
    });
  };

  onClickMessageItem = (id: string) => this.props.history.push(`message/${id}`);

  selectItem = (items: any[]) => this.setState({ selectedMessages: items });

  changeModal = () => {
    this.setState((state) => ({
      ...state,
      showModal: !state.showModal
    }));
  }

  sortItems = ({ label, value }: any) => {
    this.setState({ sortBy: { label, value } });
    switch (value) {
      case 'id':
        this.setState((state) => {
          const sortedList = state.messages.sort((a, b) => {
            return a.id - b.id;
          });
          return ({ messages: sortedList });
        });
        break;

      case 'title':
        this.setState((state) => {
          const sortedList = state.messages.sort((a, b) => {
            return sortByTitle(a, b, value);
          });
          return ({ messages: sortedList });
        });
        break;

      case 'category':
        this.setState((state) => {
          const sortedList = state.messages.sort((a, b) => {
            if (a[value] && b[value]) {
              return sortByNumber(a[value], b[value], 'id');
            }
            return 1;
          });
          return ({ messages: sortedList });
        });
        break;

      default:
        break;
    }
  }

  render() {
    const {
      state: {
        messages,
        selectedMessages,
        titleFilter,
        categoryFilter,
        totalPages,
        categoriesList,
        showModal,
        page,
        sortBy,
        loading,
      },
      changePage,
      changeTitleFilter,
      changeCategoryFilter,
      onClickMessageItem,
      selectItem,
      deleteMessages,
      changeModal,
      sortItems,
    } = this;

    return (
      <div className="container">
        <ControlPanel
          type="message"
          onClickAddButton={changeModal}
          onClickDeleteButton={deleteMessages}
        />
        <SortPanel
          onChangeSort={sortItems}
          appearance="messages"
          sortValue={sortBy}
        />
        <MessageFilter
          titleFilter={titleFilter}
          categoryFilter={categoryFilter}
          onChangeTitleFilter={changeTitleFilter}
          onChangeCategoryFilter={changeCategoryFilter}
        />
        <h2>Messages</h2>

        {loading && <Spinner />}
        <ItemsList
          list={messages}
          onClickItem={onClickMessageItem}
          selectedItems={selectedMessages}
          onSelectItem={selectItem}
          selectable
        />

        <Pagination
          pages={totalPages}
          active={page}
          onChangePage={changePage}
        />

        <Modal show={showModal} onClose={changeModal}>
          <h2>Create new message</h2>
          <MessageForm
            categories={categoriesList}
            onCreateMessage={this.create}
          />
        </Modal>
      </div>
    );
  }
}
