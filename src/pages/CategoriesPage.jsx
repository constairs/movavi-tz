// @flow

import React from 'react';
import { History } from 'react-router';
import { readCategory, createCategory } from '../services';
import type { Category } from '../types';
import {
  ItemsList,
  Modal,
  Pagination,
  CategoryFilter,
  Spinner,
  Button,
  StyledSelect
} from '../components';
import { CategoryForm } from '../components/CategoryForm';
import { SortPanel } from '../components/SortPanel';
import { sortByNumber, sortByTitle } from '../utilities';

type Props = {
  history: History,
  onError: (err: any) => void;
}

type State = {
  loading: boolean;
  categoriesList: any[];
  page: ?number;
  perPage: { label: string, value: number };
  totalPages: number;
  count: number;
  titleFilter: string;
  categoryFilter: string;
  messagesFilter: number;
  showModal: boolean;
  sortBy: ?{ label: string, value: string };
  feedback: ?{ message: string, cause: string, };
}

export class CategoriesPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: false,
      categoriesList: [],
      totalPages: 0,
      count: 0,
      page: null,
      perPage: { label: '10', value: 10 },
      titleFilter: '',
      categoryFilter: '',
      messagesFilter: 0,
      showModal: false,
      sortBy: null,
      feedback: null,
    };
  }

  getCategories = async (params: any = {
    perPage: this.state.perPage.value
  }, filter: any = undefined) => {
    try {
      this.setState({ loading: true });
      const { data } = await readCategory(params);
      if (data) {
        const list = () => {
          if (filter && filter.messagesCount) {
            return data.result.data.filter((category) => {
              return category.messages.length === filter.messagesCount;
            });
          }

          if (filter && filter.titleFilter) {
            return data.result.data.filter((category) => {
              return category.title.includes(filter.titleFilter);
            });
          }
          return data.result.data;
        };

        this.setState({
          categoriesList: list(),
          page: data.result.page,
          totalPages: data.result.totalPages,
          count: data.result.count,
          loading: false,
        });
      }
    } catch (err) {
      this.props.onError(err);
      this.setState({ loading: false });
    }
  }

  create = async (categoryData: Category) => {
    try {
      const { data } = await createCategory(categoryData);
      if (data.result['Primary key']) {
        this.setState((state) => {
          const newList = [].concat(
            {
              id: data.result['Primary key'].id,
              ...categoryData,
            },
            state.categoriesList,
          );
          return ({
            categoriesList: newList.length > 10
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

  componentDidMount() {
    this.getCategories();
  }

  changeModal = () => {
    this.setState((state) => ({
      ...state,
      showModal: !state.showModal
    }));
  }

  onClickCategoryItem = (id: number) => {
    this.props.history.push(`category/${id}`);
  }

  changeTitleFilter = (value: string) => {
    this.setState({ titleFilter: value });
    this.getCategories(
      {
        page: this.state.page
      }, { titleFilter: value });
  }

  changePage = (pageNum: number) => {
    this.getCategories({
      page: pageNum
    });
  }

  changeCategoryFilter = (value: string) => {
    this.setState({ categoryFilter: value });
    const parent = this.state.categoriesList.find((cat) => (cat.title === value));
    this.getCategories({
      page: this.state.page,
    }, {
      categoryId: parent ? parent.id : null,
      title: this.state.titleFilter
    });
  }

  changeMessageFilter = (value: number) => {
    this.setState({ messagesFilter: value });
    this.getCategories({
      page: this.state.page
    }, { messagesCount: value });
  }

  changeItemsPerPage = (value: { label: string, value: number }) => {
    this.setState({ perPage: value });
    this.getCategories({
      page: this.state.page,
      perPage: value.value
    });
  }

  sortItems = ({ label, value }: any) => {
    this.setState({ sortBy: { label, value } });
    const internalLengthSort = () => {
      this.setState((state) => {
        const sortedList = state.categoriesList.sort((a, b) => {
          return sortByNumber(a[value], b[value], 'length', value);
        });
        return ({ categoriesList: sortedList });
      });
    };

    switch (value) {
      case 'id':
        this.setState((state) => {
          const sortedList = state.categoriesList.sort((a, b) => {
            return a.id - b.id;
          });
          return ({ categoriesList: sortedList });
        });
        break;

      case 'title':
        this.setState((state) => {
          const sortedList = state.categoriesList.sort((a, b) => {
            return sortByTitle(a, b, value);
          });
          return ({ categoriesList: sortedList });
        });
        break;

      case 'messages':
        internalLengthSort();
        break;

      case 'children':
        internalLengthSort();
        break;

      default:
        break;
    }
  }

  render() {
    const {
      state: {
        categoriesList,
        page,
        totalPages,
        titleFilter,
        categoryFilter,
        messagesFilter,
        showModal,
        sortBy,
        loading,
        perPage
      },
      changeModal,
      changePage,
      onClickCategoryItem,
      changeTitleFilter,
      changeCategoryFilter,
      changeMessageFilter,
      changeItemsPerPage,
      sortItems,
    } = this;

    return (
      <div className="container">
        <Button onClick={changeModal}>Add category</Button>

        <SortPanel
          onChangeSort={sortItems}
          sortValue={sortBy}
          appearance="categories"
        />

        <CategoryFilter
          titleFilter={titleFilter}
          categoryFilter={categoryFilter}
          messagesFilter={messagesFilter}
          onChangeTitleFilter={changeTitleFilter}
          onChangeCategoryFilter={changeCategoryFilter}
          onChangeMessageFilter={changeMessageFilter}
        />

        <h2>Categories</h2>
        {loading ? <Spinner /> : (
          <StyledSelect
            options={[
              { label: '5', value: 5 },
              { label: '10', value: 10 },
              { label: '20', value: 20 }
            ]}
            value={perPage}
            onChange={changeItemsPerPage}
          />
        )}

        <ItemsList
          list={categoriesList}
          onClickItem={onClickCategoryItem}
        />

        {page && totalPages && (
          <Pagination
            pages={totalPages}
            active={page}
            onChangePage={changePage}
          />
        )}

        <Modal show={showModal} onClose={changeModal}>
          <h2>Create new category</h2>
          <CategoryForm
            categories={categoriesList}
            onCreateCategory={this.create}
          />
        </Modal>
      </div>
    );
  }
}
