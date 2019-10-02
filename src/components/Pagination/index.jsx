// @flow

import React from 'react';
import * as _ from 'lodash';

import './index.styles.scss';

type PaginationProps = {
  pages: number;
  active: number;
  onChangePage: (pageNum: number) => void;
};

export const Pagination = React.memo<PaginationProps>(({
  pages,
  active,
  onChangePage,
}: PaginationProps) => (
  <ul className="pagination">
    <li>
      <a onClick={() => (active !== 1 ? onChangePage(active - 1) : null)}>&#8592;</a>
    </li>
    {_.range(1, pages + 1).map((pageNum) => (
      <li key={pageNum}>
        <a
          className={active === pageNum ? 'active' : ''}
          onClick={() => (active !== pageNum ? onChangePage(pageNum) : null)}
        >
          {pageNum}
        </a>
      </li>
    ))}
    <li>
      <a onClick={() => (active < pages ? onChangePage(active + 1) : null)}>&#8594;</a>
    </li>
  </ul>
));
