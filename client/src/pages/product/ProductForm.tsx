import React from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Button, Col, FormFeedback, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row } from 'reactstrap';
import CustomSelect from '../../components/CustomSelect';

interface productFormProps {
    onSubmit: (data: FieldValues) => void;
    onCancel: () => void;
    initialState?: productFormData;
    units: Array<{value: string; label: string}>
}

interface productFormData {
    name: string;
    cost: number;
    quantity: number;
    unit: string;
    description?: string;
    brand?: string;
}

const ProductForm: React.FC<productFormProps> = ({onSubmit, onCancel, units}) => {

  const { register, handleSubmit, errors, control } = useForm();

  const initialState = {
    name: 'peanut butter',
    cost: 5.23,
    quantity: 300,
    unit: 'gram',
  };

  const preSubmit = (data : FieldValues) => {
    Object.keys(data).forEach(key => {
      if (data[key] === '' || data[key] == null) {
        delete data[key];
      }
    });
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(preSubmit)}>
      <FormGroup row>
        <Col sm={6}>
          <Label>Product Name</Label>
          <Input
            name="productName"
            placeholder="Enter a name for the product"
            innerRef={register({
              required: true,
            })}
            invalid={errors.productName}
          />
          {errors.productName && <FormFeedback>Please enter a product name</FormFeedback>}
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col sm={2}>
          <Label>Cost</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <Input
              name={'productPrice'}
              type={'number'}
              className={'rounded-right'}
              placeholder={'0.00'}
              min={0}
              step={0.01}
              innerRef={register({
                required: true,
                min: 0,
              })}
              invalid={errors.productPrice}
            />
            {errors.productPrice && <FormFeedback>Please enter a product price</FormFeedback>}
          </InputGroup>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col sm={5}>
          <Label>Quantity</Label>
          <InputGroup>

            <Input
              name={'productQuantity'}
              type={'number'}
              className={'rounded'}
              min={0}
              innerRef={register({
                required: true,
                min: 0,
              })}
              invalid={errors.productQuantity}
            />
              
            <Controller
              className={'w-75 ml-3'}
              name="productUnit"
              control={control}
              options={units}
              as={CustomSelect}
              invalid={errors.productUnit}
              rules={{ required: true }}
              placeholder={'Select a unit'}
            />

            {errors.productQuantity && <FormFeedback>Please enter a valid quantity</FormFeedback>}
          </InputGroup>
        </Col>
      </FormGroup>
      <hr/>
      <FormGroup row>
        <Col sm={4}>
          <Label>Brand <span className={'text-muted ml-2'}><small>Optional</small></span></Label>
          <Input
            name={'productBrand'}
            innerRef={register}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col sm={6}>
          <Label>Description <span className={'text-muted ml-2'}><small>Optional</small></span></Label>
          <Input
            name={'productDescription'}
            type={'textarea'}
            innerRef={register}
          />
        </Col>
      </FormGroup>
      <hr/>
      <FormGroup>
        <Button type="submit" color={'primary'}>Save</Button>
        <Button onClick={onCancel} color={'primary'} className={'ml-4'} outline>Cancel</Button>
      </FormGroup>
    </form>
  );
};

export default ProductForm;