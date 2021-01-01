import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink, Row,
  Table,
} from 'reactstrap';
import withInitialState, { initialStateProps } from '../../components/HOC/withInitialState';

interface ProductInfo {
  id: string;
  name: string;
  quantity: string;
  cost: string
}
interface initialState {
  count: number;
  results: Array<ProductInfo>;
}

const ProductIndex : React.FC<initialStateProps<initialState>> = ({initialState}) => {
  
  const history = useHistory();

  return(
    <Container>
      <Row className={'mb-5'}>
        <Col>
          <h1 className={'display-4 mb-0'}>Products</h1>
        </Col>
        <Col className={'mt-auto col-md-auto'}>
          <Link to={'/products/new'}>
            <Button color={'primary'}  className={'ml-auto'}>Add New Product</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col sm={3}>
          <FormGroup>
            <Label>Price</Label>
            <div className={'d-flex'}>
              <Input type={'select'} className={'mr-2'}>
                <option>Equal to</option>
                <option>Less than</option>
                <option>Greater than</option>
              </Input>
              <Input type={'number'} step="0.01" max={200} min={0} className={'mr-2 w-50'}>30</Input>
            </div>
          </FormGroup>
        </Col>
        <Col sm={3} className={'ml-auto'}>
          <FormGroup>
            <Label>Search</Label>
            <div>
              <Input type={'text'} className={'mr-2'}/>
            </div>
          </FormGroup>
        </Col>
        <Col className={'col-md-auto mt-auto mb-3'}>
          <Button color={'primary'} outline>Apply Filters</Button>
        </Col>
      </Row>
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
            {initialState.results.map(({id, name, cost, quantity}, i) => (
              <tr key={i} onClick={() => history.push('/')}>
                <td>{id}</td>
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
        <Col>Page 1 of 23</Col>
        <Col className={'col-md-auto'}>
          <Pagination aria-label="Page navigation example">
            <PaginationItem>
              <PaginationLink first href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink previous href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
          1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
          2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
          3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
          4
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
          5
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink next href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink last href="#" />
            </PaginationItem>
          </Pagination>
        </Col>
      </Row>
    </Container>);
}
  ;

export default withInitialState<{}, initialState>(ProductIndex,
  () => ({
    count: 10,
    results: [
      {
        id: 'A0',
        name: 'Peanut Butter',
        quantity: '400g',
        cost: '14.50',
      },
      {
        id: 'A1',
        name: 'Flour',
        quantity: '1kg',
        cost: '4.53',
      },
    ],
  }));