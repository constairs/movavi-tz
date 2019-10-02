// @flow

import React from 'react';
import { Checkbox } from '../Checkbox';
import './index.styles.scss';


type Props = {
  list: {
    id: number;
    title: string;
    parent: {
      id: number;
    };
  }[];
  selectable?: boolean;
  selectedItems?: number[];
  onClickItem: (id: number) => void;
  onSelectItem?: (items: number[]) => void;
}


export const ItemsList = ({
  list,
  onClickItem,
  selectedItems = [],
  selectable = false,
  onSelectItem = () => {},
}: Props) => {
  const changeSelection = (value, id: number) => {
    if (!value) {
      onSelectItem(selectedItems.filter((categoryId) => categoryId !== id));
    } else {
      onSelectItem(selectedItems.concat(id));
    }
  };

  const clickItem = (e) => {
    onClickItem(e.target.dataset.id);
  };

  return (
    <ul className={`list ${selectable ? 'selectable' : ''}`}>
      {list.map((item) => (
        <li className="list-item" key={item.id}>
          {selectable && (
            <Checkbox
              id={item.id}
              checked={!!selectedItems.find((category) => category === item.id)}
              onChange={changeSelection}
            />
          )}
          <a className="list-item-link" data-id={item.id} onClick={clickItem}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
};
