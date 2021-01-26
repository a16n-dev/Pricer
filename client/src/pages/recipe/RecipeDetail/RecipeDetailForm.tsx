import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
} from 'reactstrap';
import CustomSelect from '../../../components/CustomSelect';
import { Product } from '../../../models/Product';
import { RecipeItemDetail } from '../../../models/Recipe';
import { Unit } from '../../../models/Unit';

interface RecipeDetailFormFields {
  itemUnitId: Option<Unit>;
  itemQuantity: number;
  itemText: string;
  itemProductId: Option<Product>;
}

interface RecipeDetailFormProps {
  units: Array<Unit>;
  products: Array<Product>;
  disabled?: boolean;
  existingItem?: RecipeItemDetail;
  onSubmit: (data: RecipeItemDetail) => void;
  onDelete: () => void;
}

interface Option<T> {
  label: string;
  value: T;
  isDisabled?: boolean;
}

const toOption = <T extends { name: string }>(i: T): Option<T> => ({
  label: i.name,
  value: i,
});

const RecipeDetailForm: React.FC<RecipeDetailFormProps> = ({
  units,
  products,
  disabled,
  existingItem,
  onSubmit,
  onDelete,
}) => {

  // ====================================================================================
  const {
    register,
    handleSubmit,
    errors,
    control,
    reset,
    watch,
    setValue,
  } = useForm<RecipeDetailFormFields>();

  const [ unitOptions, setUnitOptions ] = useState<Array<Option<Unit>>>();
  const [ productOptions, setProductOptions ] = useState<Array<Option<Product>>>();

  const selectedProduct = watch('itemProductId');

  // This hook runs when the user changes the selected ingredient
  useEffect(() => {

    const prodOpt = products.map((u) =>
      toOption(u),
    );
        
    setProductOptions(prodOpt);

    setValue('itemProductId', prodOpt.find(
      (o) => o.value.id === existingItem?.detail?.productId,
    ) || null);

    setValue('itemText', existingItem?.detail?.itemText || '');
    setValue('itemQuantity', existingItem?.detail?.quantity || '');

  }, [ existingItem, products, setValue ]);

  // update units when product changes
  useEffect(() => {
    const unitOpt= [
      ...(selectedProduct?.value?.units || []),
      ...units ].map(
      (u) => toOption(u),
    );
    setUnitOptions(unitOpt);
  }, [ selectedProduct, units ]);

  // This hook runs when the user switches the selected product to update the units
  // set unit list ->
  useEffect(() => {
    const val =  unitOptions?.find(
      (o) => o.value.id === existingItem?.detail?.unitId,
    ) || null;
    setValue('itemUnitId', val);
  }, [ unitOptions, setValue ]);

  const preSubmit = ({
    itemUnitId,
    itemQuantity,
    itemText,
    itemProductId,
  }: RecipeDetailFormFields) => {
    if (existingItem) {
      const detail: RecipeItemDetail = {
        plainText: existingItem?.plainText,
        detail: {
          itemText: itemText,
          quantity: itemQuantity,
          unitId: itemUnitId.value.id,
          productId: itemProductId.value.id,
        },
      };
      onSubmit(detail);
    }
  };

  return (
    <Form onSubmit={handleSubmit(preSubmit)}>
      <FormGroup>{existingItem?.plainText}</FormGroup>
      <hr />
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
      <FormGroup>
        <Label>Product</Label>
        <Controller
          defaultValue={''}
          name="itemProductId"
          control={control}
          options={productOptions}
          as={CustomSelect}
          invalid={errors.itemProductId}
          rules={{ required: true }}
          placeholder={'Select a product'}
          isDisabled={disabled}
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
                valueAsNumber: true,
              })}
              invalid={Boolean(errors.itemQuantity)}
              disabled={disabled}
            />

            <Controller
              className={'w-50 ml-3'}
              name="itemUnitId"
              control={control}
              options={unitOptions}
              as={CustomSelect}
              invalid={errors.itemUnitId}
              rules={{ required: true }}
              placeholder={'Select a unit'}
              isDisabled={disabled}
            />
          </InputGroup>
        </Col>
      </FormGroup>
      <FormGroup className={'mb-0'}>
        <Button disabled={disabled} color={'primary'} type={'submit'}>
          Submit
        </Button>
        <Button
          disabled={disabled}
          color={'primary'}
          onClick={onDelete}
          outline
          className={'ml-4'}
        >
          Delete
        </Button>
      </FormGroup>
    </Form>
  );
};

export default RecipeDetailForm;
