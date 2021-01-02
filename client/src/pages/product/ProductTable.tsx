import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { Product } from '../../models/Product';

interface productTableProps {
    products: Array<Product>
}

const PAGE_LIMIT = 10;

const ProductTable: React.FC<productTableProps> = ({products}) => {

  const history = useHistory();

  const [ page, setPage ] = useState<number>(1);
  const maxPage = Math.ceil(products.length / PAGE_LIMIT);

  const rightPad = Math.min(2, (maxPage - page));
  const leftPad = Math.min(2, page - 1);
  const startSel = Math.max(page - (leftPad + Math.max(0, 2 - rightPad)), 1);
  const endSel =Math.min(page + (rightPad + Math.max(0, 2 - leftPad)), maxPage);
  const range = Array(endSel - startSel + 1).fill(0).map((_, idx) => startSel + idx);

  const startItem = (page - 1) * PAGE_LIMIT;
  const endItem = Math.min((page * PAGE_LIMIT), products.length);

  return  (<Col>
    <Row>
      <Table hover={true}>
        <thead>
          <tr>
            <th>id #</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.slice(startItem, endItem).map(({id,name, cost, quantity}, i) => (
            <tr key={i} onClick={() => history.push(`/products/view/${id}`)}>
              <td>{i}</td>
              <td>{name}</td>
              <td>{quantity}</td>
              <td>${cost}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Row>
    <hr/>
    <Row>
      <Col>
        {products.length > 0 ?
          `Showing ${startItem + 1}-${endItem} of ${products.length}`
          : 'No Results'}
      </Col>
      <Col className={'col-md-auto'}>
        <Pagination aria-label="Page navigation example">
          <PaginationItem disabled={page === 1}>
            <PaginationLink first onClick={() => setPage(1)}/>
          </PaginationItem>
          <PaginationItem disabled={page === 1} >
            <PaginationLink previous onClick={() => setPage(page - 1)}/>
          </PaginationItem>

          {/* render up to 5 links */}
          {range.map(n => (
            <PaginationItem active={page === n} onClick={() => setPage(n)}>
              <PaginationLink>
                {n}
              </PaginationLink>
            </PaginationItem>
          ))}
                
          <PaginationItem disabled={page === maxPage || products.length === 0} >
            <PaginationLink next onClick={() => setPage(page+1)}/>
          </PaginationItem>
          <PaginationItem disabled={page === maxPage || products.length === 0}>
            <PaginationLink last onClick={() => setPage(maxPage)}/>
          </PaginationItem>
        </Pagination>
      </Col>
    </Row>
  </Col>);
};

export default ProductTable;