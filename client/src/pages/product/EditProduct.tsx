import React from 'react';
import { FieldValues } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router-dom';
import { Container } from 'reactstrap';
import withReduxState, { reduxStateProps } from '../../components/HOC/withReduxState';
import { Product } from '../../models/Product';
import { Unit } from '../../models/Unit';
import LoadingPage from '../common/LoadingPage';
import ProductForm from './ProductForm';

interface URLParams {
  id: string
}

interface stateProps {
  product: Product;
  units: Array<Unit>;
  isHydrated: boolean;
}

const EditProduct: React.FC<reduxStateProps<stateProps>> = ({state}) => {

  const history = useHistory();

  const unitOptions = state.units.map(u => ({
    label: `${u.symbol} (${u.name})`,
    value: u.id,
  }));


  if(!state.isHydrated){
    return <LoadingPage/>;
  }

  if(!state.product){
    return <Redirect to={'/not-found'}/>;
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
      <h1>Details of {state.product.name}</h1>
      <ProductForm
        initialState={{...state.product}}
        onCancel={onCancel}
        onSubmit={onSubmit}
        units={unitOptions}/>
    </Container>
  );

};

export default withReduxState<{}, stateProps, URLParams>(EditProduct,
  (state, params) => (
    {
      product: state.products.products[params.id],
      units: Object.values(state.units.units),
      isHydrated: state.products.isHydrated,
    }
  ));