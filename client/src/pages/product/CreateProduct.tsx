import { useSnackbar } from 'notistack';
import React from 'react';
import { FieldValues } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { createProductRequest, productClient } from '../../api/client';
import withConfirmation, { confirmationProps } from '../../components/HOC/withConfirmation';
import ProductForm from './ProductForm';

const CreateProduct: React.FC<confirmationProps> = ({confirm}) => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const onSubmit = ({
    productName,
    productPrice,
    productQuantity,
    productUnit,
    productBrand,
    productDescription,
  }: FieldValues) => {
    const req: createProductRequest = {
      name: productName,
      brand: productBrand,
      description: productDescription,
      cost: productPrice,
      quantity: productQuantity,
      unit: productUnit.value,
    };

    const res = productClient.createProduct(req);
    if(res){
      enqueueSnackbar(`Created ${productName}`, {
        variant:'success',
      });
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
          <ProductForm onCancel={onCancel} onSubmit={onSubmit}/>
        </Col>
      </Row>
    </Container>
  );
};

export default withConfirmation(CreateProduct);