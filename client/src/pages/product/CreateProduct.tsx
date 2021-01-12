import { useSnackbar } from 'notistack';
import React from 'react';
import { FieldValues } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import withConfirmation, { confirmationProps } from '../../components/HOC/withConfirmation';
import withReduxState, { reduxStateProps } from '../../components/HOC/withReduxState';
import { Unit } from '../../models/Unit';
import { createProduct } from '../../redux/product/createProduct';
import { useAppDispatch } from '../../redux/store';
import ProductForm from './ProductForm';

interface createProductProps {

}

interface initialState {
  units: Array<Unit>

}

const CreateProduct: React.FC<
  confirmationProps &
  createProductProps &
  reduxStateProps<initialState>
 > = ({confirm, state}) => {

   const { enqueueSnackbar } = useSnackbar();
   const history = useHistory();
   const dispatch = useAppDispatch();

   const onSubmit = async ({
     productName,
     productPrice,
     productQuantity,
     productUnit,
     productBrand,
     productDescription,
     productDensity,
   }: FieldValues) => {
     const res = await dispatch(createProduct({
       name: productName,
       cost: productPrice,
       description: productDescription,
       brand: productBrand,
       quantity: productQuantity,
       unitId: productUnit.value,
       density: productDensity,
     }));

     if(createProduct.fulfilled.match(res)){
       enqueueSnackbar(`Created ${productName}`, {
         variant:'success',
       });
       history.push(`/products/view/${res.payload.id}`);
     }
   };

   const onCancel = () => {
     confirm('Are you sure? This will exit without saving', () => {
       history.push('/products');
     });
   };
   const unitOptions = state.units.map(u => ({
     label: `${u.symbol} (${u.name})`,
     value: u.id,
   }));

   return (
     <Container>
       <Row className={'mb-5'}>
         <Col>
           <h1 className={'display-4'}>Add New Product</h1>
         </Col>
       </Row>
       <Row>
         <Col>
           <ProductForm onCancel={onCancel} onSubmit={onSubmit} units={unitOptions}/>
         </Col>
       </Row>
     </Container>
   );
 };

export default withReduxState<createProductProps, initialState>(
  withConfirmation<createProductProps & reduxStateProps<initialState>>(CreateProduct),
  (state) => ({
    units: Object.values(state.units.units),
  }),
);