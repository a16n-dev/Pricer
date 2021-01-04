import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import withReduxState, { reduxStateProps } from '../../components/HOC/withReduxState';
import ProductState from '../../redux/product/productState';

import ProductTable from './ProductTable';


const ProductIndex : React.FC<reduxStateProps<ProductState>> = ({state}) => {

  const [ searchText, setSearchText ] = useState<string>();
  
  const products = Object.values(state.products)
    .filter(p => searchText ? p.name.toLowerCase().includes(searchText.toLowerCase()) : true);

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
        <Col sm={3} className={'ml-auto'}>
          <FormGroup>
            <Label>Search</Label>
            <div>
              <Input
                type={'text'}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className={'mr-2'}
              />
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <ProductTable products={products}/>
      </Row>
    </Container>);
}
  ;

export default withReduxState<{}, ProductState>(ProductIndex,
  state => (state.products));