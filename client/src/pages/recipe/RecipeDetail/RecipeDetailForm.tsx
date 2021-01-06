import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Col, Form, FormGroup, Input, InputGroup, Label } from 'reactstrap';
import CustomSelect from '../../../components/CustomSelect';
import { Product } from '../../../models/Product';
import { RecipeItemDetail } from '../../../models/Recipe';
import { Unit } from '../../../models/Unit';

interface RecipeDetailFormFields {
  itemUnitId: string;
  itemQuantity: string;
  itemText: string;
  itemProductId: string;
}

interface RecipeDetailFormProps {
  units: Array<Unit>
  products: Array<Product>
  disabled?: boolean;
  existingItem?: RecipeItemDetail
}

interface Option<T> {
  label: string;
  value: T;
  isDisabled?: boolean;
}

const RecipeDetailForm: React.FC<RecipeDetailFormProps> = ({units, products, disabled, existingItem}) => {
  
  const defaultValues: Partial<RecipeDetailFormFields> = {
    itemUnitId: existingItem?.detail?.unitId,
    itemQuantity: existingItem?.detail?.quantity.toString(),
    itemText: existingItem?.detail?.itemText.toString(),
    itemProductId: existingItem?.detail?.productId,
  };

  const {
    register,
    handleSubmit,
    errors,
    control,
    watch,
    reset,
  } = useForm<RecipeDetailFormFields>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [ existingItem ]);

  const preSubmit = (data: RecipeDetailFormFields) => {
    console.log(data);
  };

  const toOption = <T extends {name: string},>(i: T): Option<T> => ({
    label: i.name,
    value: i,
  });

  const unitDropdownOptions: Array<Option<Unit>> = units.map(u => toOption(u));
  const productDropdownOptions: Array<Option<Product>> = products.map(u => toOption(u));

  return (
    <Form onSubmit={handleSubmit(preSubmit)}>
      <FormGroup>
        {existingItem?.plainText}
      </FormGroup>
      <hr/>
      <FormGroup>
        <Label>Item Name</Label>
        <Input
          name={'itemText'}
          min={0}
          innerRef={register({
            required: true,
          })}
          invalid={Boolean(errors.itemQuantity)}
          disabled={disabled}
        />
      </FormGroup>
      <FormGroup row>
        <Col>
          <Label>Quantity</Label>
          <InputGroup>

            <Input
              name={'itemQuantity'}
              min={0}
              innerRef={register({
                required: true,
                min: 0,
              })}
              invalid={Boolean(errors.itemQuantity)}
              disabled={disabled}
            />
              
            <Controller
              className={'w-50 ml-3'}
              name="itemUnitId"
              control={control}
              options={unitDropdownOptions}
              as={CustomSelect}
              invalid={errors.itemUnitId}
              rules={{ required: true }}
              placeholder={'Select a unit'}
              isDisabled={disabled}
            />
          </InputGroup>
        </Col>
      </FormGroup>
      <FormGroup>
        <Label>Product</Label>
        <Controller
          name="itemUnitId"
          control={control}
          options={productDropdownOptions}
          as={CustomSelect}
          invalid={errors.itemUnitId}
          rules={{ required: true }}
          placeholder={'Select a unit'}
          isDisabled={disabled}
        />
      </FormGroup>
      <FormGroup className={'mb-0'}>
        <Button disabled={disabled} color={'primary'} type={'submit'}>Submit</Button>
        <Button disabled={disabled} color={'primary'} outline className={'ml-4'}>Delete</Button>
      </FormGroup>
    </Form>
  );
};

export default RecipeDetailForm;
