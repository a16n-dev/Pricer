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
import { Unit } from '../../models/Unit';
import ProductState from '../../redux/product/productState';

interface stateProps {
  products: {[key: string]: Product};
  units: {[key: string]: Unit};
}

const ProductIndex: React.FC<reduxStateProps<stateProps>> = ({ state }) => {
  const [ searchText, setSearchText ] = useState<string>();
  const history = useHistory();
  const products = Object.values(state.products).filter((p) =>
    searchText ? p.name.toLowerCase().includes(searchText.toLowerCase()) : true,
  );

  const handleClick = (p: Product) => history.push(`/products/view/${p.id}`);

  const map: columnMappings<Product> = {
    Name: (i) => i.name,
    Quantity: (i) => {
      const fullUnits = {...state.units, ...i.units.reduce((map: any, p) => {
        map[p.id] = p;
        return map;
      }, {})};
      const unit = fullUnits[i.unitId];
      return `${i.quantity} ${unit.symbol}`;
    },
    Cost: (i) => `$${i.cost.toFixed(2)}`,
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
export default withReduxState<{}, stateProps>(
  ProductIndex,
  (state) => ({
    products: state.products.products,
    units: state.units.units,
  }),
);
