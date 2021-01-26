import React, { useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
import CustomSelect from '../../components/CustomSelect';
import { useModal } from '../../components/functionalModal/useModal';
import { ProductData } from '../../models/Product';
import { Unit } from '../../models/Unit';
import DensityCalculationModal from './DensityCalculationModal';
import ProductUnitForm from './ProductUnitForm';
import ProductUnitTable from './ProductUnitTable';
import SimpleModal from './SimpleModal';

interface productFormProps {
  onSubmit: (data: FieldValues) => void;
  onCancel: () => void;
  initialState?: ProductData;
  units: Array<{ value: string; label: string }>;
}

const ProductForm: React.FC<productFormProps> = ({
  onSubmit,
  onCancel,
  units,
  initialState,
}) => {
  const [ modal, setModal ] = useState<boolean>(false);

  const [ specificUnits, setSpecificUnits ] = useState<Array<Unit>>(initialState?.units || []);

  const fullUnits = [ ...units, ...specificUnits.map(u => ({
    label: `${u.symbol} (${u.name})`,
    value: u.id,
  })) ];

  const { register, handleSubmit, errors, control, setValue } = useForm({
    defaultValues: {
      productName: initialState?.name,
      productPrice: initialState?.cost,
      productQuantity: initialState?.quantity,
      productUnit: fullUnits.find((u) => u.value === initialState?.unitId),
      productBrand: initialState?.brand,
      productDescription: initialState?.description,
      productDensity: initialState?.density ? initialState.density : 1,
      productUnits: initialState?.units,
    },
  });

  const preSubmit = (data: FieldValues) => {
    Object.keys(data).forEach((key) => {
      if (data[key] === '' || data[key] == null) {
        delete data[key];
      }
    });
    data['productUnits'] = specificUnits;
    onSubmit(data);
  };

  return (
    <>
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
              invalid={Boolean(errors.productName)}
            />
            {errors.productName && (
              <FormFeedback>Please enter a product name</FormFeedback>
            )}
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
                className={'rounded-right'}
                placeholder={'0.00'}
                min={0}
                innerRef={register({
                  required: true,
                  min: 0,
                  valueAsNumber: true,
                })}
                invalid={Boolean(errors.productPrice)}
              />
              {errors.productPrice && (
                <FormFeedback>Please enter a product price</FormFeedback>
              )}
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={5}>
            <Label>Quantity</Label>
            <InputGroup>
              <Input
                name={'productQuantity'}
                className={'rounded'}
                min={0}
                innerRef={register({
                  required: true,
                  min: 0,
                  valueAsNumber: true,
                })}
                invalid={Boolean(errors.productQuantity)}
              />

              <Controller
                className={'w-75 ml-3'}
                name="productUnit"
                control={control}
                options={fullUnits}
                as={CustomSelect}
                invalid={errors.productUnit}
                rules={{ required: true }}
                placeholder={'Select a unit'}
              />

              {errors.productQuantity && (
                <FormFeedback>Please enter a valid quantity</FormFeedback>
              )}
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={4}>
            <Label>Density</Label>
            <InputGroup>
              <Input
                name={'productDensity'}
                className={'rounded-left'}
                min={0}
                innerRef={register({
                  required: true,
                  min: 0,
                  valueAsNumber: true,
                })}
                invalid={Boolean(errors.productDensity)}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>g/ml</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Col>
          <Col className={'mt-auto'}>
            <Button color={'primary'} outline onClick={() => setModal(true)}>
              Calculate Density
            </Button>
          </Col>
        </FormGroup>
        <hr />
        <FormGroup row>
          <Col sm={4}>
            <Label>
              Brand
              <span className={'text-muted ml-2'}>
                <small>Optional</small>
              </span>
            </Label>
            <Input name={'productBrand'} innerRef={register} />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={6}>
            <Label>
              Description{' '}
              <span className={'text-muted ml-2'}>
                <small>Optional</small>
              </span>
            </Label>
            <Input
              name={'productDescription'}
              type={'textarea'}
              innerRef={register}
            />
          </Col>
        </FormGroup>
        <hr />
        <Row>
          <Col><h3>Units</h3></Col>
        </Row>
        
        <ProductUnitTable specificUnits={specificUnits} setSpecificUnits={setSpecificUnits}/>
        <hr />
        <FormGroup>
          <Button type="submit" color={'primary'}>
            Save
          </Button>
          <Button
            onClick={onCancel}
            color={'primary'}
            className={'ml-4'}
            outline
          >
            Cancel
          </Button>
        </FormGroup>
      </form>
      <DensityCalculationModal
        modal={modal}
        setModal={setModal}
        onSave={(v) => {
          setValue('productDensity', v);
        }}
      />
    </>
  );
};

export default ProductForm;
