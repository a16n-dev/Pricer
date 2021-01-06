import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import withReduxState, {
  reduxStateProps,
} from '../../components/HOC/withReduxState';
import PagedTable from '../../components/PagedTable';
import { columnMappings } from '../../components/SelectTable';
import { Product } from '../../models/Product';
import ProductState from '../../redux/product/productState';


const ProductIndex: React.FC<reduxStateProps<ProductState>> = ({ state }) => {
  const [ searchText, setSearchText ] = useState<string>();
  const history = useHistory();
  const products = Object.values(state.products).filter((p) =>
    searchText ? p.name.toLowerCase().includes(searchText.toLowerCase()) : true,
  );

  const handleClick = (p: Product) => history.push(`/products/view/${p.id}`);

  const map: columnMappings<Product> = {
    Name: (i) => i.name,
    Quantity: (i) => `${i.quantity}`,
    Cost: (i) => `${i.cost}`,
  };

  return (
    <Container>
      <Row className={'mb-5'}>
        <Col>
          <h1 className={'display-4 mb-0'}>Products</h1>
        </Col>
        <Col className={'mt-auto col-md-auto'}>
          <Link to={'/products/new'}>
            <Button color={'primary'} className={'ml-auto'}>
              Add New Product
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col sm={3} className={'ml-auto'}>
          <FormGroup>
            <Label>Search</Label>
            <div>
              <Input
                type={'text'}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={'mr-2'}
              />
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <PagedTable<Product>
          items={products}
          clickAction={handleClick}
          columnMappings={map}
        />
      </Row>
    </Container>
  );
};
export default withReduxState<{}, ProductState>(
  ProductIndex,
  (state) => state.products,
);
