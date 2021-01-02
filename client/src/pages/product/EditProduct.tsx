import React from 'react';
import { FieldValues } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Container } from 'reactstrap';
import withReduxState, { reduxStateProps } from '../../components/HOC/withReduxState';
import { Product } from '../../models/models';
import ProductForm, { productFormData } from './ProductForm';

interface URLParams {
  id: string
}

const EditProduct: React.FC<reduxStateProps<Product>> = ({state}) => {

  const history = useHistory();

  if(!state){
    history.push('/not-found');
  }

  const onCancel = async () => {
    history.push('/products');
  };

  const onSubmit = async ({
    productName,
    productPrice,
    productQuantity,
    productUnit,
    productBrand,
    productDescription,
  }: FieldValues) => {};

  return (
    <Container>
      <h1>Details of {state.name}</h1>
      <ProductForm initialState={{...state}} onCancel={onCancel} onSubmit={onSubmit} units={[]}/>
    </Container>
  );

};

export default withReduxState<{}, Product, URLParams>(EditProduct,
  (state, params) => (state.products.products[params.id]));