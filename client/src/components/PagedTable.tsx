import React, { useState } from 'react';
import {
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from 'reactstrap';
import { columnMappings } from './SelectTable';

interface PagedTableProps<T> {
  items: Array<T>;
  pageLimit?: number;
  columnMappings: columnMappings<T>;
  clickAction: (item: T) => void;
}

const PagedTable = <T,>({
  items,
  pageLimit = 10,
  columnMappings,
  clickAction,
}: PagedTableProps<T>) => {
  const [ page, setPage ] = useState<number>(1);
  const maxPage = Math.ceil(items.length / pageLimit);

  const rightPad = Math.min(2, maxPage - page);
  const leftPad = Math.min(2, page - 1);
  const startSel = Math.max(page - (leftPad + Math.max(0, 2 - rightPad)), 1);
  const endSel = Math.min(
    page + (rightPad + Math.max(0, 2 - leftPad)),
    maxPage,
  );
  const range = Array(endSel - startSel + 1)
    .fill(0)
    .map((_, idx) => startSel + idx);

  const startItem = (page - 1) * pageLimit;
  const endItem = Math.min(page * pageLimit, items.length);

  return (
    <Col>
      <Row>
        <Table hover={true}>
          <thead>
            <tr>
              {Object.keys(columnMappings).map((k, i) => (
                <th key={i}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.slice(startItem, endItem).map((u, i) => (
              <tr key={i} onClick={() => clickAction(u)}>
                {Object.values(columnMappings).map((v, i) => (
                  <td key={i}>{v(u)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <hr />
      <Row>
        <Col>
          {items.length > 0
            ? `Showing ${startItem + 1}-${endItem} of ${items.length}`
            : 'No Results'}
        </Col>
        <Col className={'col-md-auto'}>
          <Pagination aria-label="Page navigation example">
            <PaginationItem disabled={page === 1}>
              <PaginationLink first onClick={() => setPage(1)} />
            </PaginationItem>
            <PaginationItem disabled={page === 1}>
              <PaginationLink previous onClick={() => setPage(page - 1)} />
            </PaginationItem>

            {/* render up to 5 links */}
            {range.map((n) => (
              <PaginationItem active={page === n} onClick={() => setPage(n)}>
                <PaginationLink>{n}</PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem disabled={page === maxPage || items.length === 0}>
              <PaginationLink next onClick={() => setPage(page + 1)} />
            </PaginationItem>
            <PaginationItem disabled={page === maxPage || items.length === 0}>
              <PaginationLink last onClick={() => setPage(maxPage)} />
            </PaginationItem>
          </Pagination>
        </Col>
      </Row>
    </Col>
  );
};

export default PagedTable;
