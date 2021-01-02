import { useSnackbar } from 'notistack';
import React from 'react';
import { FieldValues } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import withConfirmation, { confirmationProps } from '../../components/HOC/withConfirmation';
import withInitialState, { initialStateProps } from '../../components/HOC/withInitialState';
import { createProduct } from '../../redux/ProductSlice';
import { useAppDispatch } from '../../redux/store';
import ProductForm from './ProductForm';

interface createProductProps {

}

interface initialState {
  units: Array<{value: string; label: string}>
}

const CreateProduct: React.FC<
  confirmationProps &
  createProductProps &
  initialStateProps<initialState>
 > = ({confirm, initialState}) => {
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
   }: FieldValues) => {
     const res = await dispatch(createProduct({
       name: productName,
       cost: productPrice,
       description: productDescription,
       brand: productBrand,
       quantity: productQuantity,
       units: productUnit.value,
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

   return (
     <Container>
       <Row className={'mb-5'}>
         <Col>
           <h1 className={'display-4'}>Add New Product</h1>
         </Col>
       </Row>
       <Row>
         <Col>
           <ProductForm onCancel={onCancel} onSubmit={onSubmit} units={initialState.units}/>
         </Col>
       </Row>
     </Container>
   );
 };

export default withInitialState<createProductProps, initialState>(
  withConfirmation<createProductProps & initialStateProps<initialState>>(CreateProduct),
  () => {

    // return state here
    const res = {
      units: [
        {value: 'g', label: 'Grams (g)'},
        {value: 'kg', label: 'Kilograms (kg)'},
      ],
    };
    return res;
  },
);